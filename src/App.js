import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import NavBar from './NavBar/NavBar';
import Callback from './Callback';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import FetchExamples from './ClientFetchExamples/FetchExamples';
import BookingList from './ClientBookingList/BookingList';
import * as constants from './Constants'
import dateformat from './Utils/date'

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    /*
    if (this.props.location.pathname === '/callback') {
      this.setState({checkingSession:false});
      return;
    }*/

    if(constants.OAUTH_AUTO_RENEW_TOKEN) {
    var intervalId = setInterval(async () => {
        console.log('validating session...')       
        await auth0Client.validateAuth().then(result => {
            //this.forceUpdate();
            console.log('session validated.')
          }).catch(error => {
            console.log('validating error:')
            console.log(error)

            //terminate this loop
            clearInterval(this.state.intervalId);

          });
      }, 5000);
      
      this.setState({intervalId: intervalId});
    } else {
      this.setState({checkingSession:false});
    }



 }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
 }

  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/callback' component={Callback}/>
        <Alert stack={{limit: 3}} 
          timeout = {3000}
          position='top-right' effect='slide' offset={65} />

     
      <p>What to do?</p>
      <ul>
          <li><a href={`https://entrasso-${constants.APP_ENVIRONMENT_NAME}.entraos.io/sso/signup`}>Signup</a></li>
      </ul>
      <FetchExamples />
      <BookingList/>
      <br/> https://api-demo.entraos.io/booking/health
      <p>Other useful links</p>
      <ul>
        <li><a href={`https://swagger-devtest.entraos.io/?urls.primaryName=Booking%20API`}>Swagger API documentation</a></li>
        <li><a href={`https://visuale-${constants.APP_ENVIRONMENT_NAME}.entraos.io/?ui_extension=groupByTag&servicetype=true`}>Visuale environment dashboard</a></li>
        <li><a href={`${constants.APP_API_URL}/person/health`}>PersonRegister Health</a></li>
        <li><a href={`${constants.APP_API_URL}/restaurant/menu/health`}>Restaurant Menu Health</a></li>
        <li><a href={`${constants.APP_API_URL}/room/authorization/health`}>Building Authorization Health</a></li>
        <li><a href={`${constants.APP_API_URL}/room/authorization/api/status`}>Building Authorization Status</a></li>
        <li><a href={`${constants.APP_API_URL}/booking/health`}>Booking Health</a></li>
        <li><a href={`https://entralab-${constants.APP_ENVIRONMENT_NAME}.entraos.io/?ui_extension=groupByTag`}>EntraOS Rebel DoorLock Simulator</a></li>
        <li><a href={`https://doorsim.entraos.io/?ui_extension=groupByTag`}>EntraOS Rebel Beta DoorLock Simulator</a></li>
      </ul>
      <div>{`App-version [${constants.APP_ENVIRONMENT_NAME}]: ${constants.APP_GIT_SHA.slice(0,7)}`}</div>
      <div>{`Build deploy at: ${dateformat(new Date().toISOString())}`}</div>
      </div>

    );
  }
}

export default withRouter(App);
