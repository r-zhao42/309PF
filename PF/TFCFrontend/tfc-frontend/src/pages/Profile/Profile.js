import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './Profile.css';
import Tabs from "../../components/ProfileTabs/Tabs"

function Profile() {
  const [editMode, setEditMode] = useState(true);
  const clickEditMode = () => {
    setEditMode(editMode ? false : true);
  };


  const [avatarHover, setAvatarHover] = useState(false);
  const avatarHoverOn = () => {
    console.log("Here");
    setAvatarHover(true);
  };
  const avatarHoverOff = () => {
    setAvatarHover(false);
  };

  const [show, setShow] = useState(false);
  const avatarModal = () => {
    setShow(show ? false : true);
  };

  
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatpassword, setRepeatPassword] = useState('');
  const [avatar, setAvatar] = useState([]);

  const [errors, setErrors] = useState({});

  const handleFirstChange = event => {
    setFirst(event.target.value);
  };
  const handleLastChange = event => {
    setLast(event.target.value);
  };
  const handlePhoneChange = event => {
    setPhone(event.target.value);
  };
  const handleEmailChange = event => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };
  const handleRepeatPasswordChange = event => {
    setRepeatPassword(event.target.value);
  };
  const handleAvatarChange = event => {
    setAvatar(event.target.files[0]);
  };

  const formbody = new FormData();
  formbody.append("first_name", first);
  formbody.append("last_name", last);
  formbody.append("phone_num", phone);
  formbody.append("email", email);
  formbody.append("password", password);
  formbody.append("repeat_password", repeatpassword);
  formbody.append("avatar", avatar);

  const handleEdit = event => {
    event.preventDefault();
    fetch("http://127.0.0.1:8000/api/accounts/edit/", {
      method: "put",
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
      body: formbody,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const newErrorsState = {
          first_name: '',
          last_name: '',
          phone_num: '',
          email: '',
          password: '',
          repeatpassword: ''
        };

        if ('first_name' in responseJson) {
          newErrorsState.first_name = responseJson.first_name[0]
        }
        if ('last_name' in responseJson) {
          newErrorsState.last_name = responseJson.last_name[0]
        }
        if ('phone_num' in responseJson) {
          newErrorsState.phone_num = responseJson.phone_num[0]
        }
        if ('email' in responseJson) {
          newErrorsState.email = responseJson.email[0]
        }
        if ('password' in responseJson) {
          newErrorsState.password = responseJson.password[0]
        }
        if ('repeat_password' in responseJson) {
          newErrorsState.repeatpassword = responseJson.repeat_password[0]
        }
        setErrors(newErrorsState);
      });
  }


  const [isHover, setIsHover] = useState(false);
  const handleMouseOver = () => {
    setIsHover(true);
  };
  const handleMouseOut = () => {
    setIsHover(false);
  };


  const [accData, setAccData] = useState(null);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accounts/details/', {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
    }).then((response) => response.json())
      .then((data) => {
        setAccData(data.account_details);
      });
  }, []);

  return (
    <div className='profile'>
      <div className={'profile-header ' + (isHover ? 'shadow' : 'shadow-sm')}
            onMouseOver={handleMouseOver} 
            onMouseOut={handleMouseOut}>
        <Modal show={show} onHide={avatarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Select Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEdit} className="edit-form">
              <Form.Group>
                <Form.Label className="float-start">Avatar</Form.Label>
                <Form.Control className="float-start" type="file" accept="image/png, image/jpeg" onChange={handleAvatarChange} />
              </Form.Group>
              <Button variant="edit" type="submit" onClick={avatarModal}>
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={avatarModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className='avatar-table'>
          <div className='account-avatar'>
            <div className='avatar-frame' onClick={avatarModal}
                                          onMouseOver={avatarHoverOn} 
                                          onMouseOut={avatarHoverOff}>
              {accData && <img alt='Avatar' src={'http://localhost:8000' + accData.avatar}/>}
              <div className={avatarHover ? 'avatar-blur' : ''}></div>
            </div>
          </div>
        </div>
        {editMode ? ( accData &&
          <div className='account-short-details'>
            <button className="edit-profile-btn" onClick={clickEditMode}>Edit</button>
            <div className="details-section">
              <div className="details-data">
                <h1 className="name-text">{accData.first_name} {accData.last_name}</h1>
                <p className="contact-text">{accData.email}</p>
                <p className="contact-text">{accData.phone_num}</p>
              </div>
            </div>
            <div className="details-section">
              {accData.subscription && 
              <div className="details-data">
                <h3 className="name-text">Next Payment Due:</h3>
                <p className="contact-text">{accData.subscription.next_payment_date}</p>
              </div>}
            </div>
          </div>
          )
        : 
          <div className="account-short-details-edit">
            <button className="edit-profile-btn" onClick={clickEditMode}>Edit</button>
            {accData && 
              <Form onSubmit={handleEdit} className="edit-form">
                <div className="edit-form-duo">
                  <Form.Group className="edit-form-left">
                    <Form.Label className="float-start">First Name</Form.Label>
                    <Form.Control className="float-start" type="text" value={first} onChange={handleFirstChange} />
                  </Form.Group>
                  <Form.Group className="edit-form-right">
                    <Form.Label className="float-start">Last Name</Form.Label>
                    <Form.Control className="float-start" type="text" value={last} onChange={handleLastChange} />
                  </Form.Group>
                </div>
                <div className="edit-form-duo">
                  <Form.Group className="edit-form-left">
                    <Form.Label className="float-start">Phone Number</Form.Label>
                    <Form.Control type="tel" value={phone} placeholder="+14169567234" onChange={handlePhoneChange} isInvalid={!!errors.phone_num} />
                    <Form.Control.Feedback className="float-start" type="invalid">{errors.phone_num}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="edit-form-right">
                    <Form.Label className="float-start">Email</Form.Label>
                    <Form.Control type="email" value={email} placeholder="some@example.com" onChange={handleEmailChange} isInvalid={!!errors.email} />
                    <Form.Control.Feedback className="float-start" type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="edit-form-duo">
                  <Form.Group className="edit-form-left">
                    <Form.Label className="float-start">Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={handlePasswordChange} isInvalid={!!errors.password} />
                    <Form.Control.Feedback className="float-start" type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="edit-form-right">
                    <Form.Label className="float-start">Repeat Password</Form.Label>
                    <Form.Control type="password" value={repeatpassword} onChange={handleRepeatPasswordChange} isInvalid={!!errors.repeatpassword} />
                    <Form.Control.Feedback className="float-start" type="invalid">{errors.repeatpassword}</Form.Control.Feedback>
                  </Form.Group>
                </div>
                <Button className="float-end" variant="edit" type="submit">
                  Save
                </Button>
              </Form>
            }
          </div>
        }
      </div>

      <Tabs payment_info={accData && accData.payment_info}
            subscription={accData && accData.subscription} />
    </div>
  );
}
  
  export default Profile;