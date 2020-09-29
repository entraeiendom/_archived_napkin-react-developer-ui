import auth0 from 'auth0-js';
import * as constant from './Constants' 


class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: window.env.OAUTH_DOMAIN,
      clientID: window.env.OAUTH_CLIENT_ID,
      redirectUri: window.env.OAUTH_REDIRECT_URI,
      scope: constant.OAUTH_SCOPE,
      responseType: 'code'
    });

    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.requestToken = this.requestToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    if(!this.access_token && localStorage.getItem(constant.LOCALSTORAGE_ID_TOKEN)) {
      var id_token_payload = this.parseJwt(localStorage.getItem(constant.LOCALSTORAGE_ID_TOKEN))
      this.profile = {...id_token_payload, 'name': `${id_token_payload.first_name} ${id_token_payload.last_name}`}
    }
    return this.profile;
  }

  getAccessToken() {
    if(!this.access_token && localStorage.getItem(constant.LOCALSTORAGE_ACCESS_TOKEN)) {
      this.access_token = this.parseJwt(localStorage.getItem(constant.LOCALSTORAGE_ACCESS_TOKEN)) 
    }
    return this.access_token;
  }

  isAuthenticated() {
    if(!this.expiresAt && localStorage.getItem(constant.LOCALSTORAGE_ACCESS_TOKEN)) {
      var access_token_payload = this.parseJwt(localStorage.getItem(constant.LOCALSTORAGE_ACCESS_TOKEN))
      this.expiresAt = access_token_payload.exp*1000
    }
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(constant.LOCALSTORAGE_ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(constant.LOCALSTORAGE_ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
}

parseJwt(token) {
  var base64Payload = token.split('.')[1];
  var payload = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payload);
}

refreshToken(refresh_token) {
  
  let base64Credentials = Buffer.from(window.env.OAUTH_CLIENT_ID+ ':' + 'optional').toString('base64');
  return new Promise((resolve, reject) => {
    this.request({
      url: `https://${window.env.OAUTH_DOMAIN}/token?grant_type=refresh_token&refresh_token=${refresh_token}`,
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + base64Credentials,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(response => {
        this.setSession(response)
        resolve()
  }).catch(error => {
        return reject(error);
  })})
}

requestToken(authorization_code) {
  
    let base64Credentials = Buffer.from(window.env.OAUTH_CLIENT_ID+ ':' + 'optional').toString('base64');
    return new Promise((resolve, reject) => {
      this.request({
        url: `https://${window.env.OAUTH_DOMAIN}/token?grant_type=authorization_code&code=${authorization_code}`,
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + base64Credentials,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).then(response => {
          this.setSession(response);
          resolve(response)
    }).catch(error => {
          return reject(error);
    })})
  }

  setSession(response) {
    var access_token_payload = this.parseJwt(response.access_token);
    var id_token_payload = this.parseJwt(response.id_token);

    this.access_token = response.access_token;
    this.expiresAt = access_token_payload.exp * 1000;
    this.profile = { ...id_token_payload, 'name': `${id_token_payload.first_name} ${id_token_payload.last_name}` };

    localStorage.setItem(constant.LOCALSTORAGE_ACCESS_TOKEN, response.access_token);
    localStorage.setItem(constant.LOCALSTORAGE_REFRESH_TOKEN, response.refresh_token);
    localStorage.setItem(constant.LOCALSTORAGE_ID_TOKEN, response.id_token);
  }

  signOut() {
    //log out SSO
    fetch(`https://${window.env.OAUTH_DOMAIN}/logout`, {
      method: 'GET'
    });

    localStorage.removeItem(constant.LOCALSTORAGE_ACCESS_TOKEN)
    localStorage.removeItem(constant.LOCALSTORAGE_REFRESH_TOKEN)
    localStorage.removeItem(constant.LOCALSTORAGE_ID_TOKEN)
    this.expiresAt = 0
    this.profile = undefined
    
  }

  validateAuth() {
    return new Promise((resolve, reject) => {
      resolve();
      if(this.expiresAt && new Date().getTime() < this.expiresAt - 30*1000) { //30 seconds before it expires
        resolve();
      } else {
        if(localStorage.getItem(constant.LOCALSTORAGE_REFRESH_TOKEN)){
           this.refreshToken(localStorage.getItem(constant.LOCALSTORAGE_REFRESH_TOKEN)).then(response => {
            console.log('refresh_token called successfully')
            resolve();
          }).catch(error => {
            reject(error)
          });
        } else {
          reject({error: 'login_required'})
        }
      }
    });
  }
}

const auth0Client = new Auth();

export default auth0Client;
