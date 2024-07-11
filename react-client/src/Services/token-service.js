import axios from "axios";
import React, { useState, useEffect } from "react";

class TokenService {
    constructor() {
        this.audience = process.env.REACT_APP_AUDIENCE;
        this.token_varname = this.audience + "_access_token";
    }

    getAccessToken = () => {
        return localStorage.getItem(this.token_varname);
    }

    refreshAccessToken = () => {
        // return ("new access token");
        const audience = process.env.REACT_APP_AUDIENCE;
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

        return (axios(options)
            .then(response => {
                console.log("Received new API access token")
                return (response.data.access_token);
            })
            .catch(error => {
                console.error(error);
                return (error);
            })
        )
    }

    setAccessToken = (token) => {
        localStorage.setItem(this.token_varname, token);
        return true;
    }
}

export default TokenService