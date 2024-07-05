import { React, useEffect, useState, useCallback } from 'react';
import GetApiAccessToken from '../lib/GetApiAccessToken.js';
import { useAuth0 } from "@auth0/auth0-react";
import TokenService from '../services/token-service.js';
import { config } from '../config.js';
import request from "../services/request-service.js"; // Assuming request.js is in the same directory

const api_url = process.env.REACT_APP_BACKEND_API_URL;

const Testview = () => {
    const { user,
        isLoading,
    } = useAuth0();

    const [token, setToken] = useState('')

    useEffect(() => {
        if (user) {
            GetApiAccessToken(setToken);
        }
    }, [user])

    useEffect(() => {
        if (token) {
            console.log("Access token", token);
        }
    }, [token])

    useEffect(() => {
        request.get("/products")
            .then(response => {
                console.log("Response");
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    })

    

    let tokenService = new TokenService();
    if (!tokenService.getAccessToken()) {
        // tokenService.refreshAccessToken().then((token) => {
        //     tokenService.setAccessToken(token);
        // })
    }


    // console.log(token);

    return (
        <div>
            Testarea
            <div>
                Token:
                <p>
                    {token}
                </p>
            </div>
            <div>
                Token Service:
                <p>
                    {tokenService.getAccessToken()}
                </p>
            </div>
            <div>
                {config.baseUrl}
            </div>
        </div>
    )
}

export default Testview