import React, { useState, useEffect }  from 'react'
import moment from 'moment'
import NewBooking from '../ClientNewBooking/NewBooking'
import * as constants from '../Constants'

// Documentation available at https://swagger-devtest.entraos.io/


function FetchExamples() {

  const [rooms, setRooms] = useState([]);
  const [menu, setMenu] = useState([]);


    useEffect(() => {

      fetchMenu();
      fetchRooms();

    }, []);

    const fetchMenu = async () =>  {
      const result = await fetch(`${constants.APP_API_URL}/restaurant/menu/list/preorder`);
      const data = await result.json();
      setMenu(data);
      console.log('Menu for preorder', data)
    }

    const fetchRooms = async () =>  {
      const result = await fetch(`${constants.APP_API_URL}/booking/rooms`);
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
