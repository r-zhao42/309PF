import Button from 'react-bootstrap/Button';
import React from 'react';
import '../Button/button.css';



const ClassScheduleRow = ({classInfo}) => {

    const enrollClass = (enrollFuture) => {
        const fetchUrl = "http://127.0.0.1:8000/api/studios/classes/enroll/"
        // const data = {
        //     class_id: classInfo.id,
        //     enroll_future: enrollFuture
        // }

        const data = new FormData();
        data.append("class_id", classInfo.id);
        data.append("enroll_future", enrollFuture);

        console.log(fetchUrl)
        console.log(data)


        fetch(fetchUrl, {
            method: 'post',
            mode: 'cors',
            headers: new Headers({
                'Authorization': 'Token a32af8a10d8eb61c3cfbfa350ccd3ba3e8e81dcc',
            }),
            body: data
          }).then((response) => response.text())
            .then((data) => {
              // TODO 
              console.log(data)

            });
    }

    const handleEnroll = (e) => {
        e.preventDefault();
        enrollClass(false)
    }

    const handleEnrollFuture = (e) => {
        e.preventDefault();
        enrollClass(true)
    }

    return (
        <div className="class-row">
                            <div className='class-row-text'>                            
                                <h6>{classInfo.parent_class.name}</h6>
                                <div className='class-row-info'>
                                    <p>Date: {new Date(classInfo.start_time).toLocaleDateString()}</p>
                                    <p>Time: {new Date(classInfo.start_time).toLocaleTimeString()} - {new Date(classInfo.end_time).toLocaleTimeString()}</p>
                                    <p>Coach: {classInfo.parent_class.coach}</p>
                                </div>
                            </div>
                            {localStorage.getItem('token') ? 
                                <div className='class-row-buttons'> 
                                    <Button onClick={handleEnroll} variant="orange">Enroll</Button>
                                    <Button onClick={handleEnrollFuture} variant="orange">Enroll All</Button>
                                </div> 
                                :
                                <p>You must be logged in to enroll</p>
                            }
                            
                        </div>
    )
}

export default ClassScheduleRow