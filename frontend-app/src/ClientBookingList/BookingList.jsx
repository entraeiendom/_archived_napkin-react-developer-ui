import React, { useState, useEffect }  from 'react'
import moment from 'moment'
import NewBooking from '../ClientNewBooking/NewBooking'
import * as constants from '../Constants'



function BookingList() {

  const [bookings, setBookings] = useState([]);
  const [lastBooking, setLastBooking] = useState({});


    useEffect(() => {

      fetchData();

    }, [lastBooking]);

    const fetchData = async () =>  {
      const result = await fetch(`${window.env.APP_API_URL}/booking/reservations/list`);
      const data = await result.json();
      setBookings(data);
    }



  return (
    <div>
      <NewBooking update={setLastBooking} />
      <h3>Bookings:</h3>
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
