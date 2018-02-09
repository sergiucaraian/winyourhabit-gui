import { createAction } from 'redux-actions';
import {
    REQUEST_ERROR,
    LOGIN_REQUEST,
    REGISTER_REQUEST,
    LOGOUT,
    SET_LOGGED_IN_USER_ID,
    FETCH_USERS_REQUEST,
    FETCH_GROUPS_REQUEST,
    FETCH_USER_GROUPS_REQUEST,
    FETCH_OBJECTIVES_REQUEST,
    FETCH_GROUP_ACTIVE_OBJECTIVES_REQUEST,
    FETCH_GROUP_OBJECTIVES_TO_VOTE_REQUEST,
    SET_USERS,
    SET_GROUPS,
    SET_USER_GROUPS,
    SET_OBJECTIVES,
    SET_GROUP_ACTIVE_OBJECTIVES,
    SET_GROUP_OBJECTIVES_TO_VOTE,
    SEND_TEXT_PROOF_REQUEST,
    SEND_PHOTO_PROOF_REQUEST,
    ADD_COMMITMENT_REQUEST,
    SEND_VOTE_REQUEST,
    ADD_GROUP_REQUEST,
    ADD_USER_TO_GROUP_REQUEST
} from './types';

export const requestError = createAction(REQUEST_ERROR, errorMessage => (errorMessage));

export const loginRequest = createAction(LOGIN_REQUEST, (username, password, resolve, reject) => ({
    username, password, resolve, reject
}));

export const registerRequest = createAction(REGISTER_REQUEST, (username, email, password, resolve, reject) => ({
    username, email, password, resolve, reject
}));

export const logout = createAction(LOGOUT);

export const setLoggedInUserID = createAction(SET_LOGGED_IN_USER_ID, id => id);

export const fetchUsersRequest = createAction(FETCH_USERS_REQUEST);
export const fetchGroupsRequest = createAction(FETCH_GROUPS_REQUEST);
export const fetchUserGroupsRequest = createAction(FETCH_USER_GROUPS_REQUEST);
export const fetchObjectivesRequest = createAction(FETCH_OBJECTIVES_REQUEST);
export const fetchGroupActiveObjectivesRequest = createAction(FETCH_GROUP_ACTIVE_OBJECTIVES_REQUEST, groupID => groupID);
export const fetchGroupObjectivesToVoteRequest = createAction(FETCH_GROUP_OBJECTIVES_TO_VOTE_REQUEST, groupID => groupID);
export const sendTextProofRequest = createAction(SEND_TEXT_PROOF_REQUEST, (groupID, objectiveID, proofValue) => ({groupID, objectiveID, proofValue}));
export const sendPhotoProofRequest = createAction(SEND_PHOTO_PROOF_REQUEST, (groupID, objectiveID, photoURI) => ({groupID, objectiveID, photoURI}));
export const addCommitmentRequest = createAction(ADD_COMMITMENT_REQUEST, (groupID, description, date, bet) => ({groupID, description, date, bet}));
export const sendVoteRequest = createAction(SEND_VOTE_REQUEST, (groupID, objectiveID, value) => ({groupID, objectiveID, value}));
export const addGroupRequest = createAction(ADD_GROUP_REQUEST, (title, description, timeframe, proofType) => ({title, description, timeframe, proofType}));
export const addUserToGroupRequest = createAction(ADD_USER_TO_GROUP_REQUEST, (userID, groupID) => ({userID, groupID}));

export const setUsers = createAction(SET_USERS, users => users);
export const setGroups = createAction(SET_GROUPS, groups => groups);
export const setUserGroups = createAction(SET_USER_GROUPS, userGroups => userGroups);
export const setObjectives = createAction(SET_OBJECTIVES, objectives => objectives);
export const setGroupActiveObjectives = createAction(SET_GROUP_ACTIVE_OBJECTIVES, (groupID, objectives) => ({groupID, objectives}) );
export const setGroupObjectivesToVote = createAction(SET_GROUP_OBJECTIVES_TO_VOTE, (groupID, objectives) => ({groupID, objectives}) );
