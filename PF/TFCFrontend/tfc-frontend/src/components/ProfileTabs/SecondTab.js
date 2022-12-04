import React, { useEffect, useState } from "react";
import './TableTab.css';
import "bootstrap/dist/css/bootstrap.min.css";

const SecondTab = () => {
  const [classSchedule, setClassSchedule] = useState(null);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/studios/schedule/', {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
          'Authorization': 'Token ac0aca069c9f1c7c2725419c4617c8381ccf09a9',
      }),
    }).then((response) => response.json())
      .then((data) => {
        setClassSchedule(data.results);
      });
  }, []);

  return (
    <div className="table-tab">
      <div className="table-container">
        <div className="table-center">
          <table className="table table-hover table-dark">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Cancelled</th>
              </tr>
            </thead>
            <tbody>
              {classSchedule && classSchedule.map(({repeat_class}) => {
                return (
                  <tr key={repeat_class.id}>
                    <td>{repeat_class.parent_class.name}</td>
                    <td>{repeat_class.start_time}</td>
                    <td>{repeat_class.end_time}</td>
                    <td>{repeat_class.cancelled ? 'true' : 'false'}</td>
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

export default SecondTab;
