import './Profile.css';
import Tabs from "../../components/ProfileTabs/Tabs"

function Profile() {
    fetch("http://127.0.0.1:8000/").then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
      }).catch(function() {
        console.log("Booo");
      });
    return (
        <div className='profile'>
            <div className='profile-header'>
                <div className='account-avatar'>
                    <h1>Avatar Block</h1>
                </div>
                <div className='account-short-details'>
                    <h1>Account Short</h1>
                </div>
            </div>

            <Tabs/>
        </div>
    );
  }
  
  export default Profile;