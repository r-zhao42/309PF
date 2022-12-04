import Form from 'react-bootstrap/Form';
import SummaryCard from '../../components/SummaryCard/SummaryCard';
import './StudioSearch.css';
import React, {useEffect} from 'react';


// need to make call to backend to get all studios and conver each to a Summary card
// use the useEffect for loading the page

const StudioSearch = () => {
    // const Studio = function(name, id, address, phone, ) {
    //     const rank = rank;
    //     const suit = suit;
    //     return { rank, suit };
    // };

    // const [studios, setStudios] = useState([])
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/studios/list/', {
          method: 'get',
          mode: 'cors',
          headers: new Headers({
              'Authorization': 'Token a32af8a10d8eb61c3cfbfa350ccd3ba3e8e81dcc',
          }),
        }).then((response) => response.json())
          .then((data) => {
            console.log(data)
          });
      }, []);

    return (
        <>
            <h1>Find a Gym</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Search for a gym name, classes, coaches" />
            </Form.Group> 

            <SummaryCard title="gym1" link="gymDetails" subtitles={['subtitle1', 'subtitle2']} buttons={['button1', 'button2']}></SummaryCard>
            <SummaryCard title="gym1" subtitles={['subtitle1']} buttons={['button1']}></SummaryCard>
        </>
    )
}

export default StudioSearch