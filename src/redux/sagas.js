import { take, call, put, fork, race, getContext, select } from 'redux-saga/effects';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import { SubmissionError } from 'redux-form';
import Authentication from '../logic/Authentication';
import { requestError, loginRequest, setLoggedInUserID, setUsers, setGroups, setUserGroups, setObjectives, getGroupActiveObjectives, getGroupObjectivesToVote, setGroupActiveObjectives, setGroupObjectivesToVote } from './actions';
import { LOGIN_REQUEST, REGISTER_REQUEST, LOGOUT, FETCH_USERS_REQUEST, FETCH_GROUPS_REQUEST, FETCH_USER_GROUPS_REQUEST, FETCH_OBJECTIVES_REQUEST, FETCH_GROUP_ACTIVE_OBJECTIVES_REQUEST, FETCH_GROUP_OBJECTIVES_TO_VOTE_REQUEST } from './types';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';


export function* authenticate(username, password)
{
    const api = yield getContext('api');

    try
    {
        const result = yield call([api, api.login], username, password);
        Cookies.set(Config.COOKIE_NAME || 'jwt', result.access);
        const jwtDecodedCookie =  jwtDecode(result.access);
        
        yield put(setLoggedInUserID(jwtDecodedCookie.user_id));

        return { success: true, result };
    }
    catch (error)
    {
        console.error(error);
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
        console.error(error);
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

export function* fetchUsers()
{
    const api = yield getContext('api');

    while (true)
    {
        yield take(FETCH_USERS_REQUEST);

        try
        {
            const users = yield call([api, api.getUsers]);
            yield put(setUsers(users));
        }
        catch (error)
        {
            console.error(error);
            yield put(requestError(error.message));
            continue;
        }
    }
}

export function* fetchGroups()
{
    const api = yield getContext('api');

    while (true)
    {
        yield take(FETCH_GROUPS_REQUEST);

        try
        {
            const groups = yield call([api, api.getGroups]);
            yield put(setGroups(groups));
        }
        catch (error)
        {
            console.error(error);
            yield put(requestError(error.message));
            continue;
        }
    }
}

export function* fetchUserGroups()
{
    const api = yield getContext('api');

    while (true)
    {
        yield take(FETCH_USER_GROUPS_REQUEST);

        try
        {
            const loggedInUserID = yield select(state => state.loggedInUserID); 
            const userGroups = yield call([api, api.getUserGroups], loggedInUserID);

            yield put(setUserGroups(userGroups));
        }
        catch (error)
        {
            console.error(error);
            yield put(requestError(error.message));
            continue;
        }
    }
}

export function* fetchObjectives()
{
    const api = yield getContext('api');

    while (true)
    {
        yield take(FETCH_OBJECTIVES_REQUEST);

        try
        {
            const objectives = yield call([api, api.getObjectives]);
            yield put(setObjectives(objectives));
        }
        catch (error)
        {
            console.error(error);
            yield put(requestError(error.message));
            continue;
        }
    }
}

export function* fetchGroupActiveObjectives()
{
    const api = yield getContext('api');

    while (true)
    {
        const action = yield take(FETCH_GROUP_ACTIVE_OBJECTIVES_REQUEST);
    
        try
        {
            const objectives = yield call([api, api.getGroupActiveObjectives], action.payload);
            yield put(setGroupActiveObjectives(action.payload, objectives));
        }
        catch (error)
        {
            console.log(error);
            yield put(requestError(error.message));
            continue;
        }
    }
}

export function* fetchGroupObjectivesToVote()
{
    const api = yield getContext('api');

    while (true)
    {
        const action = yield take(FETCH_GROUP_OBJECTIVES_TO_VOTE_REQUEST);
        const loggedInUserID = yield select(state => state.loggedInUserID); 

        try
        {
            const objectives = yield call([api, api.getObjectives], action.payload, loggedInUserID);
            yield put(setGroupObjectivesToVote(action.payload, objectives));
        }
        catch (error)
        {
            console.error(error);
            yield put(requestError(error.message));
            continue;
        }
    }
}

export default function* ()
{
    yield fork(loginFlow);
    yield fork(logoutFlow);
    yield fork(registerFlow);
    yield fork(fetchUsers);
    yield fork(fetchGroups);
    yield fork(fetchUserGroups);
    yield fork(fetchObjectives);
    yield fork(fetchGroupActiveObjectives);
    yield fork(fetchGroupObjectivesToVote);
}
