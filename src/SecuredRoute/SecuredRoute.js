import React from 'react';
import {Route} from 'react-router-dom';
import auth0Client from '../Auth';
import Alert from 'react-s-alert';

function SecuredRoute(props) {
  const {component: Component, path} = props;
  return (
    <Route path={path} render={() => {
      //if (checkingSession) return <h3 className="text-center">Validating session...</h3>;
      if (!auth0Client.isAuthenticated()) {
        Alert.error('Login required');
        auth0Client.signIn();
        return <div></div>;
      }
      return <Component />
    }} />
  );
}

export default SecuredRoute;
