import React, { useState, useEffect }  from 'react'
import moment from 'moment'
import * as constants from '../Constants'
import auth0Client from '../Auth'
import Alert from 'react-s-alert';

const FORMAT = 'DD.MM.YY HH:mm';
const ROOM_ID = 1272543272

function NewBooking(o) {
  const originalFromTime = moment().startOf('hour').add(1, 'hour');
  const [fromTime, setFromTime] = useState(originalFromTime);

  const originalToTime = moment().startOf('hour').add(2, 'hour');
  const [toTime, setToTime] = useState(originalToTime);

  const postBookingV2 = async () =>  {

    if (!auth0Client.isAuthenticated()) {
      Alert.error('Login required');
      return;
    }
    let body = {
      resourceId: ROOM_ID,
      fromTime: fromTime.toISOString(),
      toTime: toTime.toISOString()
    };

    const result = await fetch(`${window.env.APP_API_URL}/booking/reservation/create`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth0Client.getAccessToken()}`
      },
      body: JSON.stringify(body)
    });
    const data = await result.json();
    o.update(data)
  }

  const update = function(setter, e){
    const newTime = moment(e.target.value, FORMAT)
    setter(newTime);
  }

  return (
    <div>
      <h3>Book room {ROOM_ID}</h3>

      <div>Suggested starting time: {originalFromTime.format(FORMAT)}
        <span> Change to ({FORMAT}):
        <input onChange={(e) => update(setFromTime, e)} type="text"></input>
        </span>
      </div>
      <div>Suggested ending time: {originalToTime.format(FORMAT)}
        <span> Change to ({FORMAT}):
        <input onChange={(e) => update(setToTime, e)} type="text"></input>
        </span>
      </div>
      <p onClick={postBookingV2}><strong>[V2-API] Click here to book {fromTime.format(FORMAT)} to {toTime.format(FORMAT)}</strong></p>
    </div>
  );
}
export default NewBooking;
