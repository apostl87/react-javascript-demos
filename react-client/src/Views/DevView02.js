import { React, useEffect, useState, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { NotLoggedIn, NoDeveloper, Loading } from '../Components/Misc.js';
import TokenService from '../Services/token-service.js';
import request from "../Services/request-service.js";

import { Button, View, Text } from 'react-native';

const api_url = process.env.REACT_APP_BACKEND_API_URL;

const DevView01 = () => {
    const { user,
        isLoading,
        getAccessTokenSilently,
    } = useAuth0();



    const [token, setToken] = useState('')

    if (isLoading) {
        return <Loading />
    }
    if (!user) {
        return <NotLoggedIn />
    }
    if (!process.env.REACT_APP_DEVELOPER_USER_IDS.split(" ").includes(user.sub)) {
        return <NoDeveloper />;
    }

    async function getToken() {
        let res = await getAccessTokenSilently();
        setToken(res)
    }


    return (
        <div>
            <h2>Dev Area</h2>
            <div>
                User:
                <p>
                    {user && user.sub}
                </p>
            </div>
            <div>
                Token:
                <p>
                    {token}
                </p>
                <button onClick={getToken}>Get Token</button>
            </div>

        </div>
    )
}

export default DevView01