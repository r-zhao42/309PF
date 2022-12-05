import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./FirstTab.css"

const FirstTab = ({payment_info, subscription}) => {
  const [editMode, setEditMode] = useState(true);
  const clickEditMode = () => {
    setEditMode(editMode ? false : true);
  };


  const [number, setNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvv, setCVV] = useState('');

  const [errors, setErrors] = useState({});

  const handleNumberChange = event => {
    setNumber(event.target.value);
  };
  const handleMonthChange = event => {
    setMonth(event.target.value);
  };
  const handleYearChange = event => {
    setYear(event.target.value);
  };
  const handleCVVChange = event => {
    setCVV(event.target.value);
  };

  const formbody = new FormData();
  formbody.append("credit_num", number);
  formbody.append("credit_exp_month", month);
  formbody.append("credit_exp_year", year);
  formbody.append("credit_cvv", cvv);

  const handleEdit = event => {
    event.preventDefault();
    fetch("http://127.0.0.1:8000/api/accounts/payment-info/edit/", {
      method: "patch",
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ac0aca069c9f1c7c2725419c4617c8381ccf09a9',
      }),
      body: formbody,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const newErrorsState = {
          credit_num: '',
          credit_exp_month: '',
          credit_exp_year: '',
          credit_cvv: '',
        };

        if ('credit_num' in responseJson) {
          newErrorsState.credit_num = responseJson.credit_num[0]
        }
        if ('credit_exp_month' in responseJson) {
          newErrorsState.credit_exp_month = responseJson.credit_exp_month[0]
        }
        if ('credit_exp_year' in responseJson) {
          newErrorsState.credit_exp_year = responseJson.credit_exp_year[0]
        }
        if ('credit_cvv' in responseJson) {
          newErrorsState.credit_cvv = responseJson.credit_cvv[0]
        }
        setErrors(newErrorsState);
      });
  }

  return (
    <div className="account-details">
      {editMode ? 
        <div className="info-container">
          <div className="card-info">
            <button className="edit-info-btn" onClick={clickEditMode}>Edit</button>
            <h3 className="info-subtitle">Payment Information:</h3>
            <div className="row info-text">
              <p className="col-sm">Number: {payment_info && payment_info.credit_num}</p>
              <p className="col-sm">Exp Date: {payment_info && (payment_info.credit_exp_month + '/' + payment_info.credit_exp_year)}</p>
            </div>
            <div className="row info-text">
              <p className="col-sm">CVV: {payment_info && payment_info.credit_cvv}</p>
            </div>
          </div>
          <div className="sub-info">
            <h3 className="info-subtitle">Subscription Information:</h3>
            <div className="row info-text">
              <p className="col-sm">Start Date: {subscription && subscription.start_date}</p>
              <p className="col-sm">Sub Type: {subscription && subscription.sub_type}</p>
            </div>
          </div>
        </div>
      :
        <div className="info-container-edit">
          <button className="edit-info-btn" onClick={clickEditMode}>Edit</button>
          <h3 className="info-subtitle">Edit Payment Info</h3>
          <Form onSubmit={handleEdit}>
            <Form.Group className="">
              <Form.Label className="float-start">Number</Form.Label>
              <Form.Control className="float-start" type="text" value={number} onChange={handleNumberChange} />
              <Form.Control.Feedback className="float-start" type="invalid">{errors.credit_num}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="">
              <Form.Label className="float-start">Exp Month</Form.Label>
              <Form.Control className="float-start" type="text" value={month} onChange={handleMonthChange} />
              <Form.Control.Feedback className="float-start" type="invalid">{errors.credit_exp_month}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="">
              <Form.Label className="float-start">Exp Year</Form.Label>
              <Form.Control className="float-start" type="text" value={year} onChange={handleYearChange} />
              <Form.Control.Feedback className="float-start" type="invalid">{errors.credit_exp_year}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="">
              <Form.Label className="float-start">CVV</Form.Label>
              <Form.Control className="float-start" type="text" value={cvv} onChange={handleCVVChange} />
              <Form.Control.Feedback className="float-start" type="invalid">{errors.credit_cvv}</Form.Control.Feedback>
            </Form.Group>
            <Button className="float-start" variant="edit" type="submit">
              Save
            </Button>
          </Form>
        </div>
      }
    </div>
  );
};

export default FirstTab;
