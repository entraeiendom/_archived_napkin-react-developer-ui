
import React, { useState, useEffect }  from 'react'
import * as API from './api'
import auth0Client from "../Auth";
import Alert from "react-s-alert";

class SensorLookupForUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: ''
        }

        this.handleClick = this.handleClick.bind(this);

    }
    handleClick() {
        if (!auth0Client.isAuthenticated()) {
            Alert.error('Login required');
            return;
        }
        const candidates = API.getSensorCandidates('U2');
        console.log('Click happened' + candidates);

        this.setState({
            sensors: candidates
        });
    }

    render() {
        return (
            <div>
                <h3>Sensor subscription candidates</h3>
                <button onClick={this.handleClick}>Get sensor candidates</button>
                <p>{this.state.sensors}</p>
            </div>
        )
    }
}

export default SensorLookupForUser;