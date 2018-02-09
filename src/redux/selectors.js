import { createSelector } from 'reselect';

export function getGroups(state)
{
    return state.groups;
}

export function getUsers(state)
{
    return state.users;
}

export function getLoggedInUserID(state)
{
    return state.loggedInUserID;
}

export const getLoggedInUser = createSelector(
    [getUsers, getLoggedInUserID],
    (users, loggedInUserID) => {
        if(!loggedInUserID)
            return null;

        for(let crtUser of users) {
            if(crtUser.id === loggedInUserID)
            {
                return crtUser;
            }
        }

        return null;
    }
);

export const getLoggedInUserGroups = createSelector(
    [getGroups, getLoggedInUserID],
    (groups, loggedInUserID) => {
        return groups.filter((group) => {
            let bUserIsPartOfGroup = false;

            group.users.forEach((userInGroup) => {
                if(userInGroup.id === loggedInUserID)
                {
                    bUserIsPartOfGroup = true;
                }
            });

            return bUserIsPartOfGroup;
        });
    }
)

export const getActiveObjectives = state => state.activeObjectives;
export const getObjectivesToVote = state => state.objectivesToVote;

export const makeGetGroupUsers = props => createSelector(
    getGroups,
    (groups) => {
        if(!groups[props.groupID])
            return [];

        return groups[props.groupID].users;
    }
);

export const makeGetMyActiveObjectives = props => createSelector(
    [getActiveObjectives, getLoggedInUserID],
    (activeObjectives, loggedInUserID) => {
        if(!activeObjectives[props.groupID])
            return [];

        return activeObjectives[props.groupID].filter(objective => objective.user === loggedInUserID);
    }
);

export const makeGetOtherUsersActiveObjectives = props => createSelector(
    [getActiveObjectives, getLoggedInUserID],
    (activeObjectives, loggedInUserID) => {
        if(!activeObjectives[props.groupID])
            return [];

        return activeObjectives[props.groupID].filter(objective => objective.user !== loggedInUserID);
    }
);

export const makeGetObjectivesToVote = props => createSelector(
    [getObjectivesToVote, getLoggedInUserID],
    (objectivesToVote, loggedInUserID) => {
        if(!objectivesToVote[props.groupID])
            return [];

        return objectivesToVote[props.groupID];
    }
);
