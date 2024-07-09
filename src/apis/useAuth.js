import { useState, useEffect } from "react";

const redirectUri = process.env.REACT_APP_REDIRECT_URI_LOCAL;
const client_id = process.env.REACT_APP_CLIENT_ID;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  // console.log('code', code)

  useEffect(() => {
    if (code)  {
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
      })
      .then(res => res.json())
      .then(data => {
        setAccessToken(data.access_token);
        if (data.refresh_token !== undefined) {
          window.localStorage.setItem('refresh_token', JSON.stringify(data.refresh_token));
        }
        setExpiresIn(data.expires_in);
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        window.location = "/"
      })
    }
  }, [code])

  return accessToken
}

const reToken = JSON.parse(localStorage.getItem('refresh_token'));

export function refreshToken () {
  async function loadRefreshToken () {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
      },
      body: `grant_type=refresh_token&refresh_token=${reToken}&redirect_uri=${redirectUri}`
    })
    .then(res => res.json())
    .then(data => {
      if (data.access_token !== undefined) {
        localStorage.setItem('token', JSON.stringify(data.access_token))
        console.log('data',data)
        return data.access_token;
      }
    })

    return result !== undefined ? result : null;
  }
  loadRefreshToken();
}