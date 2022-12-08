import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import '../Button/button.css';
import Modal from 'react-bootstrap/Modal';



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

    const [showDetailModal, setShowModal] = useState(false)

    const handleClose = () => setShowModal(false);
    const handleShow = () => {
        console.log(classInfo)
        setShowModal(true)
    };

    const getTimeString = (dateTime) => {
        return new Date(dateTime).toLocaleTimeString("en-US", {hour: '2-digit', minute:'2-digit'})
    }

    const getLocaleDateStringOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }

    return (
        <>
            <tr className="class-row" onClick={handleShow}>
                    <td>                    
                        <h6>{classInfo.parent_class.name}</h6>
                    </td>    
                    <td> 
                        <div className='class-row-info'>
                            <p>Date: {new Date(classInfo.start_time).toLocaleDateString("en-US", getLocaleDateStringOptions)}</p>
                            <p>Time: {getTimeString(classInfo.start_time)} - {getTimeString(classInfo.end_time)}</p>
                            <p>Coach: {classInfo.parent_class.coach}</p>
                        </div>
                    </td>
                <td className="button-td">
                {localStorage.getItem('token') ? 
                    <div className='class-row-buttons'> 
                        <Button onClick={handleEnroll} variant="orange">Enroll</Button>
                        <Button onClick={handleEnrollFuture} variant="orange">Enroll All</Button>
                    </div> 
                    :
                    <p>You must be logged in to enroll</p>
                }    
                </td>       
            </tr>
            <Modal show={showDetailModal} onHide={handleClose}>

                <Modal.Header closeButton>
                    <div>
                        <h4>{classInfo.parent_class.name}</h4>
                        <h6>{getTimeString(classInfo.parent_class.start_time)} - {getTimeString(classInfo.parent_class.start_time)}</h6>
                        <h6>Coach: {classInfo.parent_class.coach}</h6>
                    </div>
                </Modal.Header>

                <Modal.Body>
                    <p>{classInfo.parent_class.desc}</p>
                    <p>Keywords: {classInfo.parent_class.keywords.keywords.join(', ')}</p>
                </Modal.Body>

                <Modal.Footer>
                <Button variant="orange" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="orange" onClick={(e) => {
                                                handleClose() 
                                                handleEnroll(e)}
                                                }>
                    Enroll
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ClassScheduleRow