import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};
  
const center = {
    lat: -3.745,
    lng: -38.523
};

// const position = {
//     lat: 37.772,
//     lng: -122.214
//   }

const onLoad = marker => {
    console.log('marker: ', marker)
}
  
const StudioMap = (props) => {


    return (
        <LoadScript googleMapsApiKey="AIzaSyBkEdtl--bBXsq8DJfVCyWzQiOsafvxhQQ">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          {props.markers &&
            props.markers.map((marker) =>  <Marker onLoad={onLoad} position={marker}
          />)
          }
          <></>
        </GoogleMap>
      </LoadScript>
    )
}

export default StudioMap