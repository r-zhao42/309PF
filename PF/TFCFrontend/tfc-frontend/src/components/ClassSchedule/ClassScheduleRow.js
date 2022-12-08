import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import '../Button/button.css';
import Modal from 'react-bootstrap/Modal';



const ClassScheduleRow = ({classInfo}) => {

    const [showResponseModal, setShowResponseModal] = useState(false)
    const [response, setResponse] = useState("")


    const enrollClass = (enrollFuture) => {
        const fetchUrl = "http://127.0.0.1:8000/api/studios/classes/enroll/"

        const data = new FormData();
        data.append("class_id", classInfo.id);
        data.append("enroll_future", enrollFuture);

        console.log(fetchUrl)
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
          }).then((response) => response.text())
            .then((data) => {
              setResponse(data)
              setShowResponseModal(true)
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
    const handleShow = () => setShowModal(true);

    const handleCloseResponse = () => setShowResponseModal(false);

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
            <tr className="class-row" >
                    <td onClick={handleShow} className='class-name-td'>                    
                        <h6>{classInfo.parent_class.name}</h6>
                    </td>    
                    <td onClick={handleShow} className='class-info-td'> 
                        <div className='class-row-info'>
                            <p>Date: {new Date(classInfo.start_time).toLocaleDateString("en-US", getLocaleDateStringOptions)}</p>
                            <p>Time: {getTimeString(classInfo.start_time)} - {getTimeString(classInfo.end_time)}</p>
                            <p>Coach: {classInfo.parent_class.coach}</p>
                        </div>
                    </td>
                <td className="class-button-td">
                    <Button 
                        onClick={handleEnroll} 
                        variant={localStorage.getItem('token') ? "orange" : "disabled"} 
                        disabled={localStorage.getItem('token') ? false : true}>Enroll</Button>
                    <Button 
                        onClick={handleEnrollFuture} 
                        variant={localStorage.getItem('token') ? "orange" : "disabled"}
                        disabled={localStorage.getItem('token') ? false : true}>Enroll All</Button>
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
                <Button variant={localStorage.getItem('token') ? "orange" : "disabled"}
                        disabled={localStorage.getItem('token') ? false : true}
                        onClick={(e) => {
                                            handleClose() 
                                            handleEnroll(e)}
                                        }>
                    Enroll
                </Button>
                </Modal.Footer>
            </Modal>



            <Modal show={showResponseModal} onHide={handleCloseResponse}>

                <Modal.Header closeButton>
                </Modal.Header>

                <Modal.Body> {response ? response.substring(1, response.length - 1) : "Enrollment Successful"}
                </Modal.Body>

                <Modal.Footer>
                <Button variant="orange" onClick={handleCloseResponse}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ClassScheduleRow