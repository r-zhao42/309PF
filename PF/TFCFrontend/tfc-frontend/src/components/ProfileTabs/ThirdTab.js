import React, { useEffect, useState } from "react";
import './TableTab.css';

const ThirdTab = () => {
  const [paymentHistory, setPaymentHistory] = useState(null);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accounts/payment/history/', {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
          'Authorization': 'Token ac0aca069c9f1c7c2725419c4617c8381ccf09a9',
      }),
    }).then((response) => response.json())
      .then((data) => {
        setPaymentHistory(data.results);
      });
  }, []);

  return (
    <div className="table-tab">
      <div className="table-container">
        <div className="table-center">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                <th scope="col">Card Number</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory && paymentHistory.map(({id, datetime, amount, payment_info}) => {
                return (
                  <tr key={id}>
                    <td>{datetime.slice(0,10)} {datetime.slice(11,19)}</td>
                    <td>{amount}</td>
                    <td>{payment_info.credit_num}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ThirdTab;
