import axios from 'axios';
import React from 'react';

let baseUrl = process.env.REACT_APP_AUTH0_DOMAIN;
let apiToken = process.env.REACT_APP_AUTH0_MNGMT_TOKEN;

export const getUser = async (id) => {
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

    return axios.request(config)
        .then((response) => {
            //console.log(response)
            return (response)
        })
        .catch((error) => {
            console.log(error);
            return (error.response)
        });
}

export const updateUser = async (id, userData) => {
    let data = JSON.stringify(userData);

    let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `https://${baseUrl}/api/v2/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
        },
        data: data
    };

    return axios.request(config)
        .then((response) => {
            // console.log(response)
            return (response)
        })
        .catch((error) => {
            console.log(error);
            return (error.response)
        });
}

export const deleteUser = async (id) => {
    let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `https://${baseUrl}/api/v2/users/${id}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
        },
    };

    return axios.request(config)
        .then((response) => {
            return (response)
        })
        .catch((error) => {
            console.log(error);
            return (error.response)
        });
}