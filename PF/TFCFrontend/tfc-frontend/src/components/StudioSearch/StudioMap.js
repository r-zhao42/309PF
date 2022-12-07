import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import './StudioSearch';
import React from 'react';


const containerStyle = {
    width: '100%',
    height: '100%'
};
  
const StudioMap = (props) => {

    return (
        <LoadScript googleMapsApiKey="AIzaSyBkEdtl--bBXsq8DJfVCyWzQiOsafvxhQQ">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={props.center}
          zoom={15}
          animation={1}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          {props.markers && 
            props.markers.map((marker, i) =>  <Marker key={i} position={marker}
          />)
          }
          <></>
        </GoogleMap>
      </LoadScript>
    )
}

export default StudioMap