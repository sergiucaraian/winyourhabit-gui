import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { SET_LOGGED_IN_USER_ID, SET_USERS, SET_GROUPS, SET_USER_GROUPS, SET_OBJECTIVES, SET_GROUP_ACTIVE_OBJECTIVES, SET_GROUP_OBJECTIVES_TO_VOTE } from './types';
import { race } from 'redux-saga/effects';

function loggedInUserID(state=null, action)
{
    switch(action.type)
    {
        case SET_LOGGED_IN_USER_ID:
            return action.payload;
        default:
            return state;
    }
}


function users(state=[], action)
{
    switch(action.type)
    {
        case SET_USERS:
            return action.payload;
        default:
            return state;
    }
}


function groups(state=[], action)
{
    switch(action.type)
    {
        case SET_GROUPS:
            return action.payload;
        default:
            return state;
    }
}


function objectives(state=[], action)
{
    switch(action.type)
    {
        case SET_OBJECTIVES:
            return action.payload;
        default:
            return state;
    }
}


function activeObjectives(state={}, action)
{
    switch(action.type)
    {
        case SET_GROUP_ACTIVE_OBJECTIVES:
            return {...state, [action.payload.groupID]: action.payload.objectives };
        default:
            return state;
    }
}


function objectivesToVote(state={}, action)
{
    switch(action.type)
    {
        case SET_GROUP_OBJECTIVES_TO_VOTE:
            return {...state, [action.payload.groupID]: action.payload.objectives };
        default:
            return state;
    }
}


function userGroups(state=[], action)
{
    switch(action.type)
    {
        case SET_USER_GROUPS:
            return action.payload;
        default:
            return state;
    }
}


export default combineReducers({
    form: formReducer,
    loggedInUserID,
    users,
    groups,
    userGroups,
    objectives,
    activeObjectives,
    objectivesToVote
});
