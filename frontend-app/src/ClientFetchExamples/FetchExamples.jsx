import React, { useState, useEffect }  from 'react'
import moment from 'moment'
import NewBooking from '../ClientNewBooking/NewBooking'
import * as constants from '../Constants'
import auth0Client from "../Auth";

// Documentation available at https://swagger-devtest.entraos.io/


function FetchExamples() {

  const [rooms, setRooms] = useState([]);
  const [menu, setMenu] = useState([]);
  const [baseline, setBaseline] = useState({});


    useEffect(() => {

      fetchMenu();
      fetchRooms();
      fetchUser();

    }, []);

  const fetchUser = async () =>  {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
    if (auth0Client.isAuthenticated()){
      headers = {
        ...headers,
        'Authorization': `Bearer ${auth0Client.getAccessToken()}`
      }
    };
    const response = await fetch(`${window.env.APP_API_URL}/baseline/integrationpoint`,{
      headers: headers
    } );
    const authenticatedResponse = await response.json();

    const b = {
      ...baseline ,
      "authenticated": authenticatedResponse
    };
    setBaseline(b);
    console.log('User: Baseline info', baseline)
  }


  const fetchMenu = async () =>  {
      const result = await fetch(`${window.env.APP_API_URL}/restaurant/menu/list/preorder`);
      const data = await result.json();
      setMenu(data);
      console.log('Menu for preorder', data)
    }

    const fetchRooms = async () =>  {
      const result = await fetch(`${window.env.APP_API_URL}/booking/rooms`);
      const data = await result.json();
      setRooms(data);
      console.log('Rooms available for booking', data)
    }



  return (
    <p>
      See network tab for GET-requests
    </p>
  );
}
export default FetchExamples;
