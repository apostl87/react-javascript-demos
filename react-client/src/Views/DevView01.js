import { React, useEffect, useState, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { NotLoggedIn, NoDeveloper, Loading } from '../Components/Misc.js';
import TokenService from '../Services/token-service.js';
import request from "../Services/request-service.js";

const api_url = process.env.REACT_APP_BACKEND_API_URL;

const DevView01 = () => {
    const { user,
        isLoading,
    } = useAuth0();

    if (isLoading) {
        return <Loading />
    }
    if (!user) {
        return <NotLoggedIn />
    }
    if (!process.env.REACT_APP_DEVELOPER_EMAILS.split(" ").includes(user.sub)) {
        return <NoDeveloper />;
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
                Saved access token:
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

export default DevView01