import React, { useEffect, useState } from "react";
import './TableTab.css';

const ThirdTab = () => {
  const [paymentHistory, setPaymentHistory] = useState(null);
  const [fetchLink, setFetchLink] = useState('http://127.0.0.1:8000/api/accounts/payment/history/');
  useEffect(() => {
    fetch(fetchLink, {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
    }).then((response) => response.json())
      .then((data) => {
        setPaymentHistory({'history': data.results,
                            'next': data.next,
                            'prev': data.previous});
      });
  }, [fetchLink]);

  const prevPage = () => {
    if (paymentHistory.prev != null){
      setFetchLink(String(paymentHistory.prev));
    }
  };
  const nextPage = () => {
    if (paymentHistory.next != null){
      setFetchLink(String(paymentHistory.next));
    }
  };

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
              {paymentHistory && paymentHistory.history.map(({id, datetime, amount, payment_info}) => {
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
          <div className="pagination-btns">
            {paymentHistory && (paymentHistory.prev && <button className="btn btn-schedule" onClick={prevPage}>Prev</button>)}
            {paymentHistory && (paymentHistory.next && <button className="btn btn-schedule" onClick={nextPage}>Next</button>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdTab;
