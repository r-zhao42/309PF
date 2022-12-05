import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import './StudioSearch';

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
          zoom={5}
          animation={1}
        >
          { /* Child components, such as markers, info windows, etc. */ }
          {props.markers && 
            props.markers.map((marker) =>  <Marker position={marker}
          />)
          }
          <></>
        </GoogleMap>
      </LoadScript>
    )
}

export default StudioMap