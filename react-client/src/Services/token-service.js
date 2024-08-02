import axios from "axios";

const audience = process.env.REACT_APP_API_AUDIENCE;
const request_url = "https://" + process.env.REACT_APP_AUTH0_DOMAIN + "/oauth/token";
const client_id = process.env.REACT_APP_AUTH0_API_M2M_CLIENT_ID;
const client_secret = process.env.REACT_APP_AUTH0_API_M2M_CLIENT_SECRET;

// Token service for the Node/Express API holding the data for the page content
class TokenService {
    constructor() {
        this.audience = audience;
        this.token_varname = "access-token_" + this.audience;
    }

    getAccessToken = () => {
        return localStorage.getItem(this.token_varname);
    }

    refreshAccessToken = () => {

        const options = {
            method: 'POST',
            url: request_url,
            headers: { 'content-type': 'application/json' },
            data: `{"client_id": "${client_id}", "client_secret": "${client_secret}",
            "audience": "${audience}", "grant_type": "client_credentials"}`
        };

        console.log(options);

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