import React from "react";
import "./FirstTab.css"

const FirstTab = ({payment_info, subscription}) => {
  return (
    <div className="account-details">
      <div className="info-container">
        <div className="card-info">
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
    </div>
  );
};

export default FirstTab;
