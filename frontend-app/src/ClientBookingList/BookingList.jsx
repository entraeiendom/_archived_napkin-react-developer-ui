import React, {useEffect, useState} from 'react'
import moment from 'moment'
import NewBooking from '../ClientNewBooking/NewBooking'
import auth0Client from "../Auth";


function BookingList() {

  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [lastBooking, setLastBooking] = useState({});


    useEffect(() => {

      fetchData();
      fetchMyBookings();

    }, [lastBooking]);

    const fetchData = async () =>  {
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
        const result = await fetch(`${window.env.APP_API_URL}/booking/reservations/list`,{
            headers: headers
        } );

        const data = await result.json();
        setBookings(data);
    }

    const fetchMyBookings = async () =>  {

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const id = auth0Client.getProfile().customer_ref;
        console.log(`Customer ref from token ${id}`)
        if (auth0Client.isAuthenticated() && !!id){
            headers = {
                ...headers,
                'Authorization': `Bearer ${auth0Client.getAccessToken()}`
            }

            const result = await fetch(`${window.env.APP_API_URL}/booking/reservations/list/${id}`,{
                headers: headers
            } );

            const data = await result.json();
            setMyBookings(data);
        };

    }



  return (
    <div>
      <NewBooking update={setLastBooking} />
        <h3>My bookings (from yesterday and the next 7 days)</h3>
        <ul>
            {
                myBookings
                    .sort((a,b) => moment(a.fromTime).isAfter(moment(b.fromTime)))
                    .map((b, i) => {
                        const roominfo = b.room ? `Room '${b.room.name}' with resourceId ${b.room.resourceId}` : "<strong>Undefined room<strong>";
                        const hostinfo = b.host ? `booked by ${b.host.firstName}` : "booked by <strong>undefined host<strong>";
                        return (
                            <li key={i}>
                                <span>{roominfo} </span>
                                <span>{hostinfo} </span>
                                <span>starting at {moment(b.fromTime).format('DD.MM.YY HH:mm')} </span>
                                <span>ending at {moment(b.toTime).format('DD.MM.YY HH:mm')} </span>
                                <span>(duration: {moment(b.fromTime).to(moment(b.toTime), true) }) </span>
                                <span>[{b.id}] </span>
                            </li>
                        )
                    })
            }
        </ul>
      <h3>Bookings for today:</h3>
      <ul>
        {
          bookings
          .sort((a,b) => moment(a.fromTime).isAfter(moment(b.fromTime)))
          .map((b, i) => {
              const roominfo = b.room ? `Room '${b.room.name}' with resourceId ${b.room.resourceId}` : "<strong>Undefined room<strong>";
              const hostinfo = b.host ? `booked by ${b.host.firstName}` : "booked by <strong>undefined host<strong>";
              return (
              <li key={i}>
                <span>{roominfo} </span>
                <span>{hostinfo} </span>
                <span>starting at {moment(b.fromTime).format('DD.MM.YY HH:mm')} </span>
                <span>ending at {moment(b.toTime).format('DD.MM.YY HH:mm')} </span>
                <span>(duration: {moment(b.fromTime).to(moment(b.toTime), true) }) </span>
              </li>
            )
          })
        }
      </ul>
    </div>
  );
}
export default BookingList;
