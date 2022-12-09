// import { Button } from "bootstrap";
import React, { useEffect, useState } from "react";
import './TableTab.css';

const SecondTab = () => {
  const [classData, setClassSchedule] = useState(null);
  const [fetchLink, setFetchLink] = useState('http://127.0.0.1:8000/api/studios/schedule/');
  useEffect(() => {
    refreshTab()
  }, [fetchLink]);
  
  const refreshTab = () => {
    fetch(fetchLink, {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
    }).then((response) => response.json())
      .then((data) => {
        console.log(data.results)
        setClassSchedule({'schedule': data.results,
                          'next': data.next,
                          'prev': data.previous});
      });
  }

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

  const handleUnenroll = (classData, enrollFuture) => {
      const fetchUrl = "http://127.0.0.1:8000/api/studios/classes/unenroll/"

      const data = new FormData();
      data.append("class_id", classData.id);
      data.append("enroll_future", enrollFuture);

      console.log(fetchUrl)
      console.log(classData.start_time)
      for (var pair of data.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
      fetch(fetchUrl, {
          method: 'post',
          mode: 'cors',
          headers: new Headers({
              'Authorization': 'Token ' + localStorage.getItem('token'),
          }),
          body: data
        }).then((response) => refreshTab());
  }

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
                    <td>
                      <button className="btn btn-schedule" onClick={(e) => handleUnenroll(repeat_class, false)}>
                        Unenroll
                      </button> 
                      <button className="btn btn-schedule" onClick={(e) => handleUnenroll(repeat_class, true)}>
                        Unenroll All
                      </button>
                    </td>
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
