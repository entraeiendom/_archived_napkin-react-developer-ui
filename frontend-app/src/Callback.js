import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import auth0Client from './Auth';
import Alert from 'react-s-alert';

class Callback extends Component {
  async componentDidMount() {

    if(this.getUrlParameter('code')) {
      await auth0Client.requestToken(this.getUrlParameter('code'))
      .then(response => {
        this.props.history.push("/");
      }).catch(error => {
          Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
      });
    }

    this.props.history.replace('/');
  }
  
  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

    var results = regex.exec(this.props.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

  render() {
    
    return (
      <p>Loading profile...</p>
    );
  }
}

export default withRouter(Callback);
