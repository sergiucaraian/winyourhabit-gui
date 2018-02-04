import merge from 'merge';
import Cookies from 'js-cookie';
import Config from 'react-native-config';


export default class Client
{
    constructor(endpoint)
    {
        this.endpoint = endpoint;
    }


    async makeRequest(strRequestPath, strMethod = 'GET', body = null, objHeaders = {}, bStoreAuthorizationBearer = false)
    {
        if(!this.constructor.requestMethods.includes(strMethod))
        {
            throw new Error(`Request methond ${strMethod} is invalid. Valid request methods are ${this.constructor.requestMethods}.`);
        }

        if(!strRequestPath.startsWith('/'))
        {
            throw new Error('strRequestPath must start with "/"');
        }

        const headers = new Headers();
        Object.entries(merge({}, this.constructor.defaultHeaders, objHeaders))
            .forEach(([key, value]) => {
                headers.append(key, value);
            });

        if(Cookies.get(Config.COOKIE_NAME))
        {
            headers.set('Authorization', `Bearer ${Cookies.get(Config.COOKIE_NAME)}`);
        }

        const requestOptions = {
            method: strMethod,
            headers,
            mode: 'cors',
            credentials: 'include'
        };

        if(body)
        {
            if(headers.get('Content-Type') === 'application/x-www-form-urlencoded')
            {
                requestOptions.body = body
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join('&');
            }
            else
            {
                requestOptions.body = body;
            }
        }

        const request = new Request(`${this.endpoint}${strRequestPath}`, requestOptions);

        let response = null;

        try
        {
            response = await fetch(request);
        }
        catch (error)
        {
            throw new Error(`[${strMethod}] ${this.endpoint}${strRequestPath}: Request failed with error: ${error}`);
        }


        if(bStoreAuthorizationBearer && response.headers.has('Authorization'))
        {
            Cookies.set(Config.COOKIE_NAME, response.headers.get('Authorization').split(' ')[1]);
        }


        if(response.ok)
        {
            try
            {
                if(headers.has('Content-Type') && headers.get('Content-Type') === 'application/json')
                {
                    return await response.json();
                }
                else if(headers.has('Content-Type') && headers.get('Content-Type') === 'application/octet-stream')
                {
                    return await response.blob();
                }

                return await response.text();
            }
            catch (error)
            {
                throw new Error(`[${strMethod}] ${this.endpoint}${strRequestPath}: Reading response data failed with error: ${error}`);
            }
        }
        else
        {
            let strErrorMessage;

            try
            {
                strErrorMessage = await response.text();
            }
            catch (error)
            {
                strErrorMessage = '';
            }

            throw new Error(`[${strMethod}] ${this.endpoint}${strRequestPath}: Request failed with HTTP code ${response.status} and message: ${strErrorMessage}}`);
        }
    }


    static get defaultHeaders()
    {
        return {
            'Content-Type': 'application/text'
        };
    }


    static get requestMethods()
    {
        return ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];
    }
};
