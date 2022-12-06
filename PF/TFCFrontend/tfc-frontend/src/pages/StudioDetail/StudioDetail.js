import React from 'react';
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import Table from 'react-bootstrap/Table';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.css';
import "./StudioDetail.css";

const StudioDetail = () => {
  const { name } = useParams()

  const [studioData, setStudioData] = useState({});
  const [directions, setDirections] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/studios/' + name + '/details/', {
      method: 'get',
      mode: 'cors',
    }).then((response) => response.json())
      .then((data) => {
        console.log(localStorage.getItem('token'))

        console.log(data)
        const newStudioState = {
          name: data.name,
          address: data.address,
          location: data.location,
          postal_code: data.postal_code,
          phone_num: data.phone_num,
          amenities: data.amenities,
          images: data.images
        };
        setStudioData(newStudioState);
      });
  }, [name]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/studios/' + name + '/directions/', {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Authorization': 'Token ' + localStorage.getItem('token'),
      }),
    }).then((response) => response.text())
      .then((data) => {
        setDirections(data);
      });
  }, [name]);


  return (
    <>
      <div className="outer-div3">
        <div className="inner-div3">
          <h3>{studioData.name}</h3>
          <div className="studio-details">
            <div className="studio-detail-l">Address:  </div>
            <div className="studio-detail">{studioData.address}</div>
            <div className="studio-detail-l">Location:  </div>
            <div className="studio-detail">{studioData.location}</div>
            <div className="studio-detail-l">Postal Code:  </div>
            <div className="studio-detail">{studioData.postal_code}</div>
            <div className="studio-detail-l">Phone Number:  </div>
            <div className="studio-detail">{studioData.phone_num}</div>

          </div>
          <br />
          <Button href={directions.replace('"', '')} target='_blank' rel="noreferrer" variant="directions-button">
            Get Directions
          </Button>
          <br/><br/>
          <h5>
            Amenities
          </h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Amenity</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {studioData.amenities && studioData.amenities.map(amenity => {
                return (
                  <tr key={amenity.id}>
                    <td>{amenity.name}</td>
                    <td>{amenity.quantity}</td>
                  </tr>

                );
              }

              )}

            </tbody>
          </Table>
          <h5>Images</h5>
          <div className="container-photo">
          <Carousel className="studio-car">
            {studioData.images && studioData.images.map((image) => {
              return <Carousel.Item key={image.id}>
                <img src={image.image} className="studio-image" alt={image.id} />
              </Carousel.Item>;
            })}
          </Carousel>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudioDetail;
