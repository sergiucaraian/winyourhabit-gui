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

    async getGroupActiveObjectives(groupID, userID)
    {
        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        return JSON.parse(await this.makeRequest(`habit-groups/${groupID}/active-objectives/?user_id=${userID}`, 'GET'));
    }

    async getGroupObjectivesToBeVotedByUser(groupID, userID)
    {
        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/json'
        });

        return JSON.parse(await this.makeRequest(`habit-groups/${groupID}/inactive-objectives/?user_id=${userID}`, 'GET'));
    }

    async createTextProof(objectiveID, proofValue)
    {
        const body = new FormData();

        body.append('type', 'text');
        body.append('content', proofValue);
        body.append('objective', objectiveID);

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return JSON.parse(await this.makeRequest('proofs/', 'POST', body, headers));
    }

    async createPhotoProof(objectiveID, photoURI)
    {
        const filename = photoURI.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const body = new FormData();

        body.append('type', 'image');
        body.append('content', 'placeholder-content');
        body.append('objective', objectiveID);
        body.append('image', {uri: photoURI, name: filename, type });

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'multipart/form-data'
        });

        return JSON.parse(await this.makeRequest('proofs/', 'POST', body, headers));
    }

    async createObjective(groupID, userID, description, date, bet)
    {
        const body = new FormData();

        body.append('user', userID);
        body.append('habit_group', groupID);
        body.append('description', description);
        body.append('start_date', date);
        body.append('bet_value', bet);
        body.append('title', 'title_placeholder');

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return JSON.parse(await this.makeRequest('objectives/', 'POST', body, headers));
    }

    async sendVote(objectiveID, userID, value)
    {
        const body = new FormData();

        body.append('user', userID);
        body.append('objective', objectiveID);
        body.append('value', value);

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return JSON.parse(await this.makeRequest('votes/', 'POST', body, headers));
    }

    static get defaultHeaders()
    {
        return merge({}, super.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });
    }
}
