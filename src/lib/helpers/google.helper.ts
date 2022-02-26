import * as queryString from 'query-string';
import { defaultScope, googleConfig } from '../config/googleConfig';
import axios from 'axios';

export const getAccessTokenFromCode = async (code: String, redirectUrl: String) => {

    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: googleConfig.clientId,
            client_secret: googleConfig.clientSecret,
            redirect_uri: redirectUrl,
            grant_type: 'authorization_code',
            code,
        },
    });
    return data.access_token;
}

export const getGoogleUserInfo = async (access_token: String) => {
    const { data } = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    return data;
}