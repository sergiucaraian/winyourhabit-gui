import merge from 'merge';
import Client from './Client';

export default class WinYourHabitClient extends Client
{
    async login(username, password)
    {
        const body = new FormData();

        body.append('username', username);
        body.append('password', password);

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'multipart/form-data'
        });

        const response = await this.makeRequest('api/token/', 'POST', body, headers, true);
        return JSON.parse(response);
    }


    register(username, email, password)
    {
        const body = new FormData();

        body.append('username', username);
        body.append('email', email);
        body.append('password', password);

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.makeRequest('users/', 'POST', body, headers);
    }


    async getUsers()
    {
        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        const response = await this.makeRequest('users/', 'GET');
        return JSON.parse(response);
    }


    async getGroups()
    {
        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        const response = await this.makeRequest('habit-groups/', 'GET');
        return JSON.parse(response);
    }


    async getUserGroups(userID)
    {
        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        const response = await this.makeRequest(`users/${userID}/groups`, 'GET');
        return JSON.parse(response);
    }

    async getObjectives()
    {
        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        const response = await this.makeRequest(`objectives`, 'GET');
        return JSON.parse(response);
    }

    async getGroupActiveObjectives(groupID)
    {
        // Temporary
        return this.getObjectives();

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        const response = await this.makeRequest(`habit-groups/${groupID}/active`, 'GET');
        return JSON.parse(response);
    }

    async getGroupObjectivesToBeVotedByUser(groupID, userID)
    {
        // Temporary
        return this.getObjectives();

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        const response = await this.makeRequest(`habit-groups/${groupID}/to-be-voted/${userID}`, 'GET');
        return JSON.parse(response);
    }

    static get defaultHeaders()
    {
        return merge({}, super.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });
    }
}
