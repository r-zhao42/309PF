import React from 'react';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./Logout.css";

const Logout = ({ setLoginStatus }) => {


  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accounts/logout/', {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
    })
      .then((response) => {
        if (response.status === 202) {
          localStorage.setItem('token', '');
          setLoginStatus('false')
        }

      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="outer-div2">
        <div className="inner-div2">
          <h4>You have logged out</h4>
        </div>
      </div>
    </>
  )
}

export default Logout;
