import React, { useEffect, useState } from "react";
import './TableTab.css';

const SecondTab = () => {
  const [classData, setClassSchedule] = useState(null);
  const [fetchLink, setFetchLink] = useState('http://127.0.0.1:8000/api/studios/schedule/');
  useEffect(() => {
    fetch(fetchLink, {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
          'Authorization': 'Token ac0aca069c9f1c7c2725419c4617c8381ccf09a9',
      }),
    }).then((response) => response.json())
      .then((data) => {
        setClassSchedule({'schedule': data.results,
                          'next': data.next,
                          'prev': data.previous});
      });
  }, [fetchLink]);

  const prevPage = () => {
    if (classData.prev != null){
      setFetchLink(String(classData.prev));
    }
  };
  const nextPage = () => {
    if (classData.next != null){
      setFetchLink(String(classData.next));
    }
  };

  return (
    <div className="table-tab">
      <div className="table-container">
        <div className="table-center">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Cancelled</th>
              </tr>
            </thead>
            <tbody>
              {classData && classData.schedule.map(({repeat_class}) => {
                return (
                  <tr key={repeat_class.id}>
                    <td>{repeat_class.parent_class.name}</td>
                    <td>{repeat_class.start_time.slice(0,10)} {repeat_class.start_time.slice(11,19)}</td>
                    <td>{repeat_class.end_time.slice(0,10)} {repeat_class.end_time.slice(11,19)}</td>
                    <td>{repeat_class.cancelled ? 'true' : 'false'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination-btns">
            {classData && (classData.prev && <button className="btn btn-schedule" onClick={prevPage}>Prev</button>)}
            {classData && (classData.next && <button className="btn btn-schedule" onClick={nextPage}>Next</button>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondTab;
