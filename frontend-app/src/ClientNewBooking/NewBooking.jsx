import React, { useState }  from 'react'
import moment from 'moment'
import auth0Client from '../Auth'
import Alert from 'react-s-alert';

const FORMAT = 'DD.MM.YY HH:mm';

function NewBooking(o) {
  const originalFromTime = moment().startOf('hour').add(1, 'hour');
  const [fromTime, setFromTime] = useState(originalFromTime);

  const originalToTime = moment().startOf('hour').add(2, 'hour');
  const [toTime, setToTime] = useState(originalToTime);

  const [roomId, setRoomId] = useState("1237007781");
  const [contractId, setContractId] = useState("my-contract-uuid");

  const postBookingV2 = async () =>  {

    if (!auth0Client.isAuthenticated()) {
      Alert.error('Login required');
      return;
    }

    if (roomId === "" || contractId === "my-contract-uuid"){
      Alert.error("Rom og kontrakt må være satt for å gjøre en booking");
      return;
    }



    let body = {
      resourceId: parseInt(roomId),
      fromTime: fromTime.toISOString(),
      toTime: toTime.toISOString(),
      contractId: contractId
    };

    console.log("Booking-body", body);
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
      <h3>Book room with contract</h3>

      <div>Room id ({roomId}):
        <span> Change to:
        <input onChange={(e) => setRoomId(e.target.value)} type="text"></input>
        </span>
        <span>See the above list for existing rooms in {window.env.APP_ENVIRONMENT_NAME}</span>
      </div>

      <div>Contractid ({contractId}):
        <span> Change to:
        <input onChange={(e) => setContractId(e.target.value)} type="text"></input>
        </span>
      </div>

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
      <p onClick={postBookingV2}><strong>Click here to book roomId '{roomId}' from {fromTime.format(FORMAT)} to {toTime.format(FORMAT)} using contract '{contractId}'</strong></p>
    </div>
  );
}
export default NewBooking;
