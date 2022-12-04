import React from "react";
import "./FirstTab.css"

const FirstTab = ({payment_info, subscription}) => {
  console.log(payment_info);
  console.log(subscription);
  return (
    <div className="account-details">
      <div className="card-info">
        <p>{payment_info && payment_info.credit_num}</p>
      </div>
    </div>
  );
};

export default FirstTab;
