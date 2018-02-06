import { createAction } from 'redux-actions';
import {
    REQUEST_ERROR,
    LOGIN_REQUEST,
    REGISTER_REQUEST,
    LOGOUT
} from './types';

export const requestError = createAction(REQUEST_ERROR, errorMessage => (errorMessage));

export const loginRequest = createAction(LOGIN_REQUEST, (username, password) => ({
    username, password
}));

export const registerRequest = createAction(REGISTER_REQUEST, (username, password, loginIfSuccessful = true) => ({
    username, password, loginIfSuccessful
}));

export const logout = createAction(LOGOUT);
