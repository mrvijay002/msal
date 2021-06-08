import * as msal from 'msal';

// visit https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
export const msalConfig = {
    auth: {
        clientId: ''
    },
};

// Add here the scopes that you would like the user to consent during sign-in
export const loginRequest = {
    scopes: ['user.read'],
};

// Add here the scopes to request when obtaining an access token for MS Graph API
export const tokenRequest = {
    scopes: ['user.read', 'offline_access'],
    forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

const myMSALObj = new msal.UserAgentApplication(msalConfig);


export const getTokenPopup = async () => {
    if (myMSALObj.getAccount()) {
        var tokenRequest = {
            scopes: ['user.read'],
        };
        tokenRequest.account = myMSALObj.getAccount();
        try {
            return await myMSALObj.acquireTokenSilent(tokenRequest);
        } catch (error) {
            if (error.name === 'InteractionRequiredAuthError') {
                try {
                    return await myMSALObj.acquireTokenRedirect(tokenRequest);
                } catch (error) {
                    new Error(error);
                }
            }
        }
    }
};

const callback = async (error, response) => {
    console.log('login response', response)
    console.log('login error', error)
    try {
        const resp = await getTokenPopup();
        console.log('token response', resp)
    } catch (error) {
        console.log('token error', error)
    }
}

myMSALObj.handleRedirectCallback(callback);

export const login = async function () {
    myMSALObj.loginRedirect(loginRequest);
};