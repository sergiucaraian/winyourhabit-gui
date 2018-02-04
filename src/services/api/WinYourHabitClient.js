import merge from 'merge';
import Client from './Client';

export default class WalletClient extends Client
{
    login(email, password)
    {
        const body = [
            ['email', email],
            ['password', password]
        ];
        
        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.makeRequest('/user/login', 'POST', body, headers, true);
    }


    register(email, password)
    {
        const body = [
            ['email', email],
            ['password', password]
        ];

        const headers = merge({}, this.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.makeRequest('/user', 'POST', body, headers);
    }


    static get defaultHeaders()
    {
        return merge({}, super.constructor.defaultHeaders, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });
    }
}
