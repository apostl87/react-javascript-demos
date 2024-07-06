import { React, useEffect, useState, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import TokenService from '../services/token-service.js';
import request from "../services/request-service.js"; // Assuming request.js is in the same directory

const api_url = process.env.REACT_APP_BACKEND_API_URL;

const Testview = () => {
    const { user,
        isLoading,
    } = useAuth0();

    if (isLoading || !user || user.sub !== 'auth0|667d40d713548da815d3a4b0') {
        return <div className='text-center mt-10'>Your account is not registered as a developer account</div>
    }

    let tokenService = new TokenService();

    function getProducts() {
        request.get("/products")
            .then(response => {
                console.log("Response");
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div>
            <h2>Dev Area</h2>
            <div>
                User:
                <p>
                    {user.sub}
                </p>
            </div>
            <div>
                <button onClick={getProducts} className='button-standard'>Fetch products</button>
            </div>
            <div>
                <button onClick={() => localStorage.clear()} className='button-standard'>Clear local storage</button>
            </div>
            <div>
                Token Service:
                <p>
                    {tokenService.getAccessToken()}
                </p>
            </div>
            <div>
                {process.env.REACT_APP_BACKEND_API_URL}
            </div>
        </div>
    )
}

export default Testview