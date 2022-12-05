import Form from 'react-bootstrap/Form';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import StudioList from '../../components/StudioSearch/StudioList';
import './StudioSearch.css';
import React, {useEffect, useState} from 'react';


// need to make call to backend to get all studios and conver each to a Summary card
// use the useEffect for loading the page

const StudioSearch = () => {
    // const Studio = (studio_name, studio_images, studio_location, studio_address, studio_phone_num, studio_postal_code) => {
    //     const name = studio_name;
    //     const images = studio_images;
    //     const location = studio_location;
    //     const address = studio_address
    //     const phone_num = studio_phone_num
    //     const postal_code = studio_postal_code

    //     return {name, address, postal_code, location, phone_num, images}
    // }

    const [studiosArray, setStudios] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/studios/list/', {
          method: 'get',
          mode: 'cors',
          headers: new Headers({
              'Authorization': 'Token a32af8a10d8eb61c3cfbfa350ccd3ba3e8e81dcc',
          }),
        }).then((response) => response.json())
          .then((data) => {
            setStudios(data.results)
          });
      }, []);

    return (
        <>
            <h1>Find a Gym</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Search for a gym name, classes, coaches" />
            </Form.Group> 

            {/* {studiosArray.map((studio) => <SummaryCard title={studio.name} link="asdf" subtitles={[studio.address, studio.phone_num]} buttons={["Directions", "Class Schedule"]}/>)} */}
            <StudioList studios={studiosArray}/>
        
        </>
    )
}

export default StudioSearch