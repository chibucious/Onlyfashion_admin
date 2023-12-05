import React, { useEffect } from 'react'
import { redirect } from 'react-router-dom';

const Logout = () => {
    useEffect(() => {
        clearCookies();
    }, []);
    function clearCookies() {
        const cookies = document.cookie.split(';');
      
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }

        redirecttoLogin();
    }

    function redirecttoLogin(){
        window.location.replace('/login');
    }
    
}

export default Logout