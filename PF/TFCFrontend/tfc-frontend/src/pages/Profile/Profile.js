import React, { useEffect, useState } from "react";
import './Profile.css';
import Tabs from "../../components/ProfileTabs/Tabs"

function Profile() {
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
          'Authorization': 'Token ac0aca069c9f1c7c2725419c4617c8381ccf09a9',
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
        <div className='avatar-table'>
          <div className='account-avatar'>
            <div className='avatar-frame'>
              {accData && <img alt='Avatar' src={'http://localhost:8000' + accData.avatar}/>}
            </div>
          </div>
        </div>
        <div className='account-short-details'>
          <div className="details-section">
            <div className="details-data">
              {accData && <h1 className="name-text">{accData.first_name} {accData.last_name}</h1>}
              {accData && <p className="contact-text">{accData.email}</p>}
              {accData && <p className="contact-text">{accData.phone_num}</p>}
            </div>
          </div>
          <div className="details-section">
            <div className="details-data">
              {accData && <h3 className="name-text">Next Payment Due:</h3>}
              {accData && <p className="contact-text">{accData.subscription.next_payment_date}</p>}
            </div>
          </div>
        </div>
      </div>

      <Tabs payment_info={accData && accData.payment_info}
            subscription={accData && accData.subscription}/>
    </div>
  );
}
  
  export default Profile;