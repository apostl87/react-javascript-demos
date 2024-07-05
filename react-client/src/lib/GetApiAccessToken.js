import React from 'react';
import axios from 'axios';

const api_url = process.env.REACT_APP_BACKEND_API_URL;

async function checkToken(token) {
    return fetch(`${api_url}check-token`, {
        method: 'GET',
        headers: new Headers({
            Authorization: `Bearer ${token}`,
        })
    })
        .then(response => {
            if (response.status === 401) {
                return (false)
            } else {
                return (true)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

async function GetApiAccessToken(setTokenState, forceNew = false) {
    const audience = process.env.REACT_APP_BACKEND_API_URL;
    if (audience.includes('localhost')) { // No need to get an access token for local development
        setTokenState('local');
        return null; 
    }

    let token_var = audience + '_access_token';

    if (forceNew == false) {
        let token = localStorage.getItem(token_var)
        if (token) {
            const isValid = await checkToken(token);
            if (isValid) {
                console.log("Using cached access token");
                setTokenState(token)
                return(token);
            }
        }
    }

    console.log("Getting new API access token");

    const request_url = "https://" + process.env.REACT_APP_AUTH0_DOMAIN + "/oauth/token";
    const client_id = process.env.REACT_APP_AUTH0_API_M2M_CLIENT_ID;
    const client_secret = process.env.REACT_APP_AUTH0_API_M2M_CLIENT_SECRET;

    const options = {
        method: 'POST',
        url: request_url,
        headers: { 'content-type': 'application/json' },
        data: `{"client_id": "${client_id}", "client_secret": "${client_secret}",
            "audience": "${audience}", "grant_type": "client_credentials"}`
    };

    console.log(options);

    axios(options)
        .then(response => {
            console.log("Received new API access token")
            localStorage.setItem(token_var, response.data.access_token);
            setTokenState(response.data.access_token)
            return (response.data.access_token);
        })
        .catch(error => {
            console.error(error);
            setTokenState('invalid access token');
            return (error);
        });
}

export default GetApiAccessToken