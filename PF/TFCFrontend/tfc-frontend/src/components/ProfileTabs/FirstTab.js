import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./FirstTab.css";

const FirstTab = ({payment_info, subscription}) => {
  const [hasPaymentInfo, setHasPaymentInfo] = useState(payment_info === null ? false : true);
  const [paymentInfo, setPaymentInfo] = useState(hasPaymentInfo ? payment_info : 
                                                                  {'credit_num': '',
                                                                  'credit_exp_month': '',
                                                                  'credit_exp_year': '',
                                                                  'credit_cvv': '',
                                                                  });
  const [addMode, setAddMode] = useState(true);
  const clickAddMode = () => {
    setAddMode(addMode ? false : true);
  };
  const [editMode, setEditMode] = useState(true);
  const clickEditMode = () => {
    setEditMode(editMode ? false : true);
  };


  const [number, setNumber] = useState(paymentInfo.credit_num);
  const [month, setMonth] = useState(paymentInfo.credit_exp_month);
  const [year, setYear] = useState(paymentInfo.credit_exp_year);
  const [cvv, setCVV] = useState(paymentInfo.credit_cvv);

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
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
      body: formbody,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if ('Payment Info Successfully Edited' === responseJson){
          setPaymentInfo({
            'credit_num': number,
            'credit_exp_month': month,
            'credit_exp_year': year,
            'credit_cvv': cvv,
          });
          clickEditMode();
        }
      });
  }

  const handleAdd = event => {
    event.preventDefault();
    fetch("http://127.0.0.1:8000/api/accounts/payment-info/add/", {
      method: "post",
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
      body: formbody,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if ('Payment Info Successfully Added' === responseJson){
          clickAddMode();
          setPaymentInfo({
            'credit_num': number,
            'credit_exp_month': month,
            'credit_exp_year': year,
            'credit_cvv': cvv,
          });
          setHasPaymentInfo(true);
        }
      });
  }

  return (
    <div className="account-details">
      {hasPaymentInfo ? 
        <div>
          {editMode ? 
            <div className="info-container">
              <div className="card-info">
                <button className="edit-info-btn" onClick={clickEditMode}>Edit</button>
                <h3 className="info-subtitle">Payment Information:</h3>
                <div className="row info-text">
                  <p className="col-sm">Number: {paymentInfo.credit_num}</p>
                  <p className="col-sm">Exp Date: {(paymentInfo.credit_exp_month + '/' + paymentInfo.credit_exp_year)}</p>
                </div>
                <div className="row info-text">
                  <p className="col-sm">CVV: {paymentInfo.credit_cvv}</p>
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
              <button className="edit-info-btn" onClick={clickEditMode}>View</button>
              <h3 className="info-subtitle">Edit Payment Info</h3>
              <Form onSubmit={handleEdit}>
                <Form.Group className="">
                  <Form.Label className="float-start">Number</Form.Label>
                  <Form.Control className="float-start" type="text" value={number} placeholder={paymentInfo.credit_num} onChange={handleNumberChange} />
                </Form.Group>
                <Form.Group className="">
                  <Form.Label className="float-start">Exp Month</Form.Label>
                  <Form.Control className="float-start" type="text" value={month} placeholder={paymentInfo.credit_exp_month} onChange={handleMonthChange} />
                </Form.Group>
                <Form.Group className="">
                  <Form.Label className="float-start">Exp Year</Form.Label>
                  <Form.Control className="float-start" type="text" value={year} placeholder={paymentInfo.credit_exp_year} onChange={handleYearChange} />
                </Form.Group>
                <Form.Group className="">
                  <Form.Label className="float-start">CVV</Form.Label>
                  <Form.Control className="float-start" type="text" value={cvv} placeholder={paymentInfo.credit_cvv} onChange={handleCVVChange} />
                </Form.Group>
                <Button className="float-start" variant="edit" type="submit">
                  Save
                </Button>
              </Form>
            </div>
          }
        </div>
      : 
        <div>
          {addMode ? 
            <div>
              <h3 className="info-subtitle">Add Payment Information</h3>
              <button className="add-info-btn" onClick={clickAddMode}>Add</button>
            </div>
          : 
            <div className="info-container-edit">
              <h3 className="info-subtitle">Add Payment Information</h3>
              <button className="edit-info-btn" onClick={clickAddMode}>View</button>
              <Form onSubmit={handleAdd}>
                <Form.Group>
                  <Form.Label className="float-start">Number</Form.Label>
                  <Form.Control className="float-start" type="text" value={number} placeholder={paymentInfo.credit_num} onChange={handleNumberChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="float-start">Exp Month</Form.Label>
                  <Form.Control className="float-start" type="text" value={month} placeholder={paymentInfo.credit_exp_month} onChange={handleMonthChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="float-start">Exp Year</Form.Label>
                  <Form.Control className="float-start" type="text" value={year} placeholder={paymentInfo.credit_exp_year} onChange={handleYearChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="float-start">CVV</Form.Label>
                  <Form.Control className="float-start" type="text" value={cvv} placeholder={paymentInfo.credit_cvv} onChange={handleCVVChange} />
                </Form.Group>
                <Button className="float-start" variant="edit" type="submit">
                  Save
                </Button>
              </Form>
            </div>
          }
        </div>
      }
    </div>
  );
};

export default FirstTab;
