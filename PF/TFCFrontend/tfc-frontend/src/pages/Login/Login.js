import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({});

  const handleEmailChange = event => {
    setEmail(event.target.value)
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value)
  };

  const formbody = new FormData();

  formbody.append("email", email);
  formbody.append("password", password);

  const handleSubmit = event => {
    event.preventDefault();

    fetch("http://127.0.0.1:8000/api/accounts/login/", {
      method: "POST",
      mode: 'cors',
      body: formbody
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (!('token' in responseJson)) {
          const newErrorsState = {
            email: '',
            password: '',
          };

          if ('email' in responseJson) {
            newErrorsState.email = responseJson.email[0]
          }
          if ('password' in responseJson) {
            newErrorsState.password = responseJson.password[0]
          }
          if ('non_field_errors' in responseJson) {
            newErrorsState.email = responseJson.non_field_errors[0]
            newErrorsState.password = responseJson.non_field_errors[0]
          }
          setErrors(newErrorsState);
        }
        else {
          localStorage.setItem('token', responseJson.token);
          navigate('/profile');
        }
      });
  };

  return (
    <>
      <div className="outer-div2">
        <div className="inner-div2">
          <h3>Log In</h3>
          <br />
          <Form onSubmit={handleSubmit} className="form-horizontal" >

            <Form.Group className="llabel">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} placeholder="some@example.com" onChange={handleEmailChange} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="llabel">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={handlePasswordChange} isInvalid={!!errors.password} />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>
            <br />
            <Button variant="login" type="submit">
              Sign Up
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Login;
