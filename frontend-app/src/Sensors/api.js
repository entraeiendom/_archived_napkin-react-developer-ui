import auth0Client from "../Auth";
import {logError, logInfo} from '../Utils/log';

const apiSubscriptionUrl = 'subscription/sensor';
const apiUrl = 'https://observation-devtest.entraos.io'
//const apiSubscriptionUrl = 'http://localhost:15599/subscription/sensor'

export const getSensorCandidates = async (realEstate) => {
    const proxyUrl = `${apiUrl}/${apiSubscriptionUrl}/${realEstate}`

    const response = await fetch(proxyUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth0Client.getAccessToken()}`
        },
        method: 'GET',
        credentials: 'same-origin'
    });
    const responseJson = await response.json();
    if (response.status === 200) {
        logInfo(
            `Got OK from service calls with realeastate ${realEstate}`
        );
        return responseJson;
    } else {
       const error = Error(
            `HTTP request failed while fetching sensor candidates for realestate ${realEstate}, with code: ${
                response.status
            }`
        );
        error.status = response.status;
        logError(error, response.statusText)
    }
};
