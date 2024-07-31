import axios from 'axios';
import React from 'react';

// Service for the Auth0 Management API

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const audience = "https://" + domain + "/api/v2/"
const client_id = process.env.REACT_APP_AUTH0_API_M2M_CLIENT_ID;
const client_secret = process.env.REACT_APP_AUTH0_API_M2M_CLIENT_SECRET;

let token_varname = 'react-demos_auth0-management-token';

const getApiToken = () => {
    return localStorage.getItem(token_varname)
}

export const getUser = async (id) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${domain}/api/v2/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    let res = await axiosRequest(config);
    return res;
}

export const updateUser = async (id, userData) => {
    let data = JSON.stringify(userData);

    let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `https://${domain}/api/v2/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        data: data
    };

    let res = await axiosRequest(config);
    return res;
}

export const deleteUser = async (id) => {
    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://${domain}/api/v2/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };

    let res = await axiosRequest(config);
    return res;
}

const axiosRequest = async (config) => {
    let apiToken = getApiToken();
    let hasNewToken = false;

    // Getting new API token if none is set in localStorage
    if (!apiToken) {
        await refreshToken();
        apiToken = getApiToken();
        hasNewToken = true;
    }

    config.headers.Authorization = `Bearer ${apiToken}`;

    let res = await axios.request(config)
        .then((response) => {
            return (response)
        })
        .catch((error) => {
            console.error(error);
            return (error.response)
        });

    // Refreshing token once on two error codes: 400 (e.g. no token) and 401 (e.g. expired token)
    // TODO: Estimate expiry date
    if ((res.status === 400 || res.status === 401) && hasNewToken == false) {
        localStorage.removeItem(token_varname)
        return await axiosRequest(config);
    } else {
        return res;
    }
}

const refreshToken = async () => {

    let config = {
        method: 'POST',
        url: `https://${domain}/oauth/token`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret,
            audience: audience
        })
    };

    await axios.request(config).then(function (response) {
        console.log("Received new Auth0 Management API access token")
        // console.log("New token: ", response.data.access_token);
        localStorage.setItem(token_varname, response.data.access_token);
    }).catch(function (error) {
        console.error(error);
    });

}
