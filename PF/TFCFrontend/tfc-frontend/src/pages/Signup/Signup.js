import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import "./Signup.css";
const Signup = () => {

  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatpassword, setRepeatPassword] = useState('')

  const [output, setOutput] = useState('')

  const handleFirstChange = event => {
    setFirst(event.target.value)
  };

  const handleLastChange = event => {
    setLast(event.target.value)
  };

  const handlePhoneChange = event => {
    setPhone(event.target.value)
  };

  const handleEmailChange = event => {
    setEmail(event.target.value)
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  };

  const handleRepeatPasswordChange = event => {
    setRepeatPassword(event.target.value)
  };

  const datathing = new FormData();
  datathing.append("first_name", first);
  datathing.append("last_name", last);
  datathing.append("phone_num", phone);
  datathing.append("email", email);
  datathing.append("password", password);
  datathing.append("repeat_password", repeatpassword);

  const handleSubmit = event => {
    event.preventDefault();
    fetch("http://127.0.0.1:8000/api/accounts/register/", {
      method: "POST",
      mode: 'cors',
      body: datathing
    
    }).then((response) => response.json()) 
      .then((responseJson) => {
          setOutput(responseJson)
      }
      ) 
  };


  return (
    <>
      <div className="outer-div">
        <div className="inner-div">
          Login

          <Form onSubmit={handleSubmit} >
            <Form.Group>
              <Form.Label>First Name:</Form.Label>
              <Form.Control type="text" value={first} onChange={handleFirstChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name:</Form.Label>
              <Form.Control type="text" value={last} onChange={handleLastChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number:</Form.Label>
              <Form.Control type="tel" value={phone} placeholder="+14169567234" onChange={handlePhoneChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" value={email} placeholder="some@example.com" onChange={handleEmailChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" value={password} onChange={handlePasswordChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Repeat Password:</Form.Label>
              <Form.Control type="password" value={repeatpassword} onChange={handleRepeatPasswordChange}/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </div>
      </div>
    </>

  )
}

export default Signup;
