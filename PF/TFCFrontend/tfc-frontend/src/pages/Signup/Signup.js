import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import "./Signup.css";

const Signup = ({ setLoginStatus }) => {
  const navigate = useNavigate();
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatpassword, setRepeatPassword] = useState('')
  const [errors, setErrors] = useState({});

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

  const formbody = new FormData();
  formbody.append("first_name", first);
  formbody.append("last_name", last);
  formbody.append("phone_num", phone);
  formbody.append("email", email);
  formbody.append("password", password);
  formbody.append("repeat_password", repeatpassword);

  const handleSubmit = event => {
    event.preventDefault();

    fetch("http://127.0.0.1:8000/api/accounts/register/", {
      method: "POST",
      mode: 'cors',
      body: formbody
    })
      .then((response) => response.json())
      .then((responseJson) => {

        if (!('new_account' in responseJson)) {
          const newErrorsState = {
            first_name: '',
            last_name: '',
            phone_num: '',
            email: '',
            password: '',
            repeatpassword: ''
          };
          if ('first_name' in responseJson) {
            newErrorsState.first_name = responseJson.first_name[0]
          }
          if ('last_name' in responseJson) {
            newErrorsState.last_name = responseJson.last_name[0]
          }
          if ('phone_num' in responseJson) {
            newErrorsState.phone_num = responseJson.phone_num[0]
          }
          if ('email' in responseJson) {
            newErrorsState.email = responseJson.email[0]
          }
          if ('password' in responseJson) {
            newErrorsState.password = responseJson.password[0]
          }
          if ('repeat_password' in responseJson) {
            newErrorsState.repeatpassword = responseJson.repeat_password[0]
          }
          setErrors(newErrorsState);
        }
        else {
          localStorage.setItem('token', responseJson.token);
          setLoginStatus('true')
          navigate('/profile');
        }
      });
  };

  return (
    <>
      <div className="outer-div1">
        <div className="inner-div1">
          <h3>Sign Up</h3>
          <br />
          <Form onSubmit={handleSubmit} className="form-horizontal" >
            <Form.Group className="slabel">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" value={first} onChange={handleFirstChange} isInvalid={!!errors.first_name} />
              <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="slabel">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={last} onChange={handleLastChange} isInvalid={!!errors.last_name} />
              <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="slabel">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" value={phone} placeholder="+14169567234" onChange={handlePhoneChange} isInvalid={!!errors.phone_num} />
              <Form.Control.Feedback type="invalid">{errors.phone_num}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="slabel">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} placeholder="some@example.com" onChange={handleEmailChange} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="slabel">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={handlePasswordChange} isInvalid={!!errors.password} />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="slabel">
              <Form.Label>Repeat Password</Form.Label>
              <Form.Control type="password" value={repeatpassword} onChange={handleRepeatPasswordChange} isInvalid={!!errors.repeatpassword} />
              <Form.Control.Feedback type="invalid">{errors.repeatpassword}</Form.Control.Feedback>
            </Form.Group>
            <br />
            <Button variant="signup" type="submit">
              Sign Up
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Signup;
