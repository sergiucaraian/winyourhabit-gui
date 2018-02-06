import { take, call, put, fork, race, getContext } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import Authentication from '../logic/Authentication';
import { requestError, loginRequest } from './actions';
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGOUT } from './types';


export function* authenticate(username, password)
{
    const api = yield getContext('api');

    try
    {
        return yield call([api, api.login], username, password);
    }
    catch (error)
    {
        yield put(requestError(error.message));
        return false;
    }
}

export function* register(username, password)
{
    const api = yield getContext('api');

    try
    {
        return yield call([api, api.register], username, password);
    }
    catch (error)
    {
        yield put(requestError(error.message));
        return false;
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
        const { username, password } = request.payload;

        const [response, cancel] = yield race([
            call(authenticate, username, password),
            take(LOGOUT)
        ]);

        if(response !== undefined && response !== false)
        {
            Actions.home();
        }
    }
}

export function* registerFlow()
{
    while (true)
    {
        const request = yield take(REGISTER_REQUEST);
        const { username, password, loginIfSuccessful } = request.payload;

        const wasSuccessful = yield call(register, username, password);

        if(wasSuccessful && loginIfSuccessful)
        {
            yield put(loginRequest(username, password));
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
