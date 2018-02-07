import { take, call, put, fork, race, getContext } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import { SubmissionError } from 'redux-form';
import Authentication from '../logic/Authentication';
import { requestError, loginRequest } from './actions';
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGOUT } from './types';
import Cookies from 'js-cookie';


export function* authenticate(username, password)
{
    const api = yield getContext('api');

    try
    {
        const result = yield call([api, api.login], username, password);
        Cookies.set(Config.COOKIE_NAME || 'jwt', result.access);
        return { success: true, result };
    }
    catch (error)
    {
        yield put(requestError(error));
        return { success: false, error};
    }
}

export function* register(username, email, password)
{
    const api = yield getContext('api');

    try
    {
        const result =  yield call([api, api.register], username, email, password);
        return { success: true, result };
    }
    catch (error)
    {
        yield put(requestError(error));
        return { success: false, error };
    }
}

export function* logout()
{
    yield Authentication.logout();
}

export function* loginFlow()
{
    while (true)
    {
        const request = yield take(LOGIN_REQUEST);
        const { username, password, resolve, reject } = request.payload;

        const [response, cancel] = yield race([
            call(authenticate, username, password),
            take(LOGOUT)
        ]);

        if(response !== undefined && response !== false)
        {
            if(response.success)
            {
                Actions.home();
            }
            else if(reject)
            {
                reject(new SubmissionError({
                    username: response.error.username || response.error.non_field_errors,
                    password: response.error.password,
                    _error: response.error.non_field_errors
                }));
            }
        }
    }
}

export function* registerFlow()
{
    while (true)
    {
        const request = yield take(REGISTER_REQUEST);
        const { username, email, password, resolve, reject } = request.payload;

        const resultObject = yield call(register, username, email, password);

        if(resultObject.success)
        {
            yield put(loginRequest(username, password));
        }
        else if(!resultObject.success)
        {
            reject(new SubmissionError({
                username: resultObject.error.username,
                email: resultObject.error.email,
                password: resultObject.error.password,
                _error: 'Register failed' 
            }));
        }
    }
}

export function* logoutFlow()
{
    while (true)
    {
        yield take(LOGOUT);
        yield call(logout);

        Actions.welcome();
    }
}

export default function* ()
{
    yield fork(loginFlow);
    yield fork(logoutFlow);
    yield fork(registerFlow);
}
