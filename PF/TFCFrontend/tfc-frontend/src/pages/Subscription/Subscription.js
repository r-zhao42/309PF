import React from 'react';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.css';
import "./Subscription.css";

const Subscription = ({ loginStatus }) => {

  const [sub, setSub] = useState({})
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accounts/subscription/types/', {
      method: 'get',
      mode: 'cors',
    }).then((response) => response.json())
      .then((data) => {
        const newSubState = {
          results: data.results

        };
        setSub(newSubState);
      });
  }, []);


  const handleChoice0 = event => {
    event.preventDefault();
    setShow(true)
    const formbody = new FormData();
    if (sub.results[0].type === 'monthly') {
      formbody.append("sub_type", 'monthly');
    }
    else {
      formbody.append("sub_type", 'yearly');
    }
    fetch("http://127.0.0.1:8000/api/accounts/subscription/edit/", {
      method: "PUT",
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
      body: formbody
    })
      .then((response) => {
        if (response.status === 200) {
          // alert("Successfully Changed Subscription")
        }
      });
  };

  const handleChoice1 = event => {
    event.preventDefault();
    setShow(true)

    const formbody = new FormData();
    if (sub.results[1].type === 'monthly') {
      formbody.append("sub_type", 'monthly');
    }
    else {
      formbody.append("sub_type", 'yearly');
    }
    fetch("http://127.0.0.1:8000/api/accounts/subscription/edit/", {
      method: "PUT",
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
      body: formbody
    })
      .then((response) => {
        if (response.status === 200) {
          // alert("Successfully Changed Subscription")
        }
      });
  };



  return (
    <>
      <div className="outer-div5">
        {show ?
          // <div className="inner-div5">
          <Alert variant="changed-sub" onClose={() => setShow(false)} dismissible>
            Your Subscription Has Been Changed
          </Alert>
          // </div>
          :
          <></>
        }

        <div className="inner-div5">
          <h3>Our Plans</h3>
          <br />

          {
            (sub.results ?
              (sub.results.length === 1 ?
                (loginStatus === 'true' ?
                  <Button variant="sub" className="subscription-type-1" onClick={handleChoice0}>
                    <h5>{sub.results[0].type.charAt(0).toUpperCase() + sub.results[0].type.slice(1)}</h5>
                    Amount: ${sub.results[0].amount}
                  </Button>
                  :
                  <div className="subscription-type-1">
                    <h5>{sub.results[0].type.charAt(0).toUpperCase() + sub.results[0].type.slice(1)}</h5>
                    Amount: ${sub.results[0].amount}
                  </div>
                )
                :
                (loginStatus === 'true' ?
                  <>
                    <div className="subscription-types">
                      <Button variant="sub" className="subscription-type" onClick={handleChoice1}>
                        <h5>{sub.results[1].type.charAt(0).toUpperCase() + sub.results[1].type.slice(1)}</h5>
                        Amount: ${sub.results[1].amount}
                      </Button>
                      <Button variant="sub" className="subscription-type" onClick={handleChoice0}>
                        <h5>{sub.results[0].type.charAt(0).toUpperCase() + sub.results[0].type.slice(1)}</h5>
                        Amount: ${sub.results[0].amount}
                      </Button>
                    </div>
                  </>
                  :
                  <>
                    <div className="subscription-types">
                      <div className="subscription-type">
                        <h5>{sub.results[1].type.charAt(0).toUpperCase() + sub.results[1].type.slice(1)}</h5>
                        Amount: ${sub.results[1].amount}
                      </div>
                      <div className="subscription-type">
                        <h5>{sub.results[0].type.charAt(0).toUpperCase() + sub.results[0].type.slice(1)}</h5>
                        Amount: ${sub.results[0].amount}
                      </div>
                    </div>
                  </>
                )
              )
              :
              <></>)
          }
        </div>
      </div>
    </>
  )
}

export default Subscription;
