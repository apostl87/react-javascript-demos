import axios from 'axios';
import React from 'react';

let baseUrl = process.env.REACT_APP_AUTH0_DOMAIN;
let apiToken = process.env.REACT_APP_AUTH0_MNGMT_TOKEN;

export const getUser = (id, onSuccess) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${baseUrl}/api/v2/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
        }
    };

    axios.request(config)
    .then((response) => {
        //console.log(response)
        onSuccess(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
}

export const updateUser = (id, userData, onSuccess) => {
    let data = JSON.stringify(userData);

    let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/v2/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
        },
        data: data
    };

    axios.request(config)
    .then((response) => {
        // console.lgo(response)
        onSuccess(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
}