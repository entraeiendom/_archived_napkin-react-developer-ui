import React, {useState, useEffect} from 'react'
import auth0Client from "../Auth";

// Documentation available at https://swagger-devtest.entraos.io/


function FetchExamples() {

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const [rooms, setRooms] = useState([]);
    const [menu, setMenu] = useState([]);
    const [baseline, setBaseline] = useState({});


    useEffect(() => {

        fetchMenu();
        fetchRooms();
        fetchUser();

    }, []);

    const fetchUser = async () => {
        let localHeaders = headers;
        if (auth0Client.isAuthenticated()) {
            localHeaders = {
                ...headers,
                'Authorization': `Bearer ${auth0Client.getAccessToken()}`
            }
        }
        ;
        const response = await fetch(`${window.env.APP_API_URL}/baseline/integrationpoint`, {
            headers: localHeaders
        });
        const authenticatedResponse = await response.json();

        const b = {
            ...baseline,
            "authenticated": authenticatedResponse
        };
        setBaseline(b);
        console.log('User: Baseline info', baseline)
    }


    const fetchMenu = async () => {
        let localHeaders = headers;
        if (auth0Client.isAuthenticated()) {
            localHeaders = {
                ...headers,
                'Authorization': `Bearer ${auth0Client.getAccessToken()}`
            }
        }
        ;
        const response = await fetch(`${window.env.APP_API_URL}/restaurant/menu/list/preorder`, {
            headers: localHeaders
        });
        const data = await response.json();
        setMenu(data);
        console.log('Menu for preorder', data)
    }

    const fetchRooms = async () => {
        let localHeaders = headers;
        if (auth0Client.isAuthenticated()) {
            localHeaders = {
                ...headers,
                'Authorization': `Bearer ${auth0Client.getAccessToken()}`
            }
        }
        ;
        const response = await fetch(`${window.env.APP_API_URL}/booking/rooms`, {
            headers: localHeaders
        });
        const data = await response.json();
        setRooms(data);
        console.log('Rooms available for booking', data)
    }


    return (
        <div>
            <h4>Rooms known in {window.env.APP_ENVIRONMENT_NAME}:</h4>
            <ul>
                {
                    rooms
                        .sort((a, b) => a.name > b.name)
                        .map((room, i) => {
                            return (
                                <li key={i}>
                                    <span>{room.name} med resourceId {room.resourceId} tilhører slackchannel {room.slackChannelName}.
                                        Kapasitet på {room.maxPersons} og timepris {room.Hourly.net_price}</span>
                                </li>
                            )
                        })
                }
            </ul>
        </div>
    );
}

export default FetchExamples;
