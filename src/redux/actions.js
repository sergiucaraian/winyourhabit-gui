import { createAction } from 'redux-actions';
import {
    REQUEST_ERROR,
    LOGIN_REQUEST,
    REGISTER_REQUEST,
    LOGOUT
} from './types';

export const requestError = createAction(REQUEST_ERROR, errorMessage => (errorMessage));

export const loginRequest = createAction(LOGIN_REQUEST, (username, password, resolve, reject) => ({
    username, password, resolve, reject
}));

export const registerRequest = createAction(REGISTER_REQUEST, (username, email, password, resolve, reject) => ({
    username, email, password, resolve, reject
}));

export const logout = createAction(LOGOUT);
