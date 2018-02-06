import Cookies from 'js-cookie';
import Config from 'react-native-config';
import jwtDecode from 'jwt-decode';

export default class Authentication
{
    static isAuthenticated()
    {
        const jwtCookieEncoded = Cookies.get(Config.COOKIE_NAME || 'jwt');

        if(!jwtCookieEncoded)
        {
            return false;
        }

        const jwtCookieDecoded = jwtDecode(jwtCookieEncoded);

        if(new Date(jwtCookieDecoded.exp * 1000) < new Date())
        {
            return false;
        }

        return true;
    }


    static logout()
    {
        Cookies.remove(Config.COOKIE_NAME);
    }
}
