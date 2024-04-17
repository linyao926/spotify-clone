import { useState, useEffect } from "react"

const redirectUri = "http://localhost:3000/";
const client_id ='6947731b9d004c58b00f2e321935abae';
const client_secret = '339c0c9a6292441a923469484fcae464';


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