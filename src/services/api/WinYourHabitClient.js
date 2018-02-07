import merge from 'merge';
import Client from './Client';

export default class WinYourHabitClient extends Client
{
    login(username, password)
    {
        const body = new FormData();

        body.append('username', username);
        body.append('password', password);

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'multipart/form-data'
        });

        return this.makeRequest('api/token/', 'POST', body, headers, true);
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


    static get defaultHeaders()
    {
        return merge({}, super.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });
    }
}
