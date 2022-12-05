import StudioMap from "./StudioMap"
import StudioList from "./StudioList"
import Form from 'react-bootstrap/Form'
import { useState, useEffect} from 'react';




const StudioSearch = (props) => {

    const [studiosArray, setStudios] = useState([])
    const [chosen, setChosen] = useState()
    const [searchName, setSearchName] = useState("test1")
    const [searchAmenity, setSearchAmenity] = useState("")
    const [searchClass, setSearchClass] = useState("")
    const [searchCoach, setSearchCoach] = useState("")
    
    const getFetchLink = () => {
        var result = 'http://127.0.0.1:8000/api/studios/list'
        
        const queries = [searchName, searchAmenity, searchClass, searchCoach]

        if (queries.some((query) => query != "")) {
            result = result.concat('?')

            if(searchName != ""){
                result = result.concat('names=', searchName)
            }

            if(searchAmenity != ""){
                result = result.concat('amenities=', searchAmenity)
            }

            if(searchClass != ""){
                result = result.concat('classes=', searchClass)
            }

            if(searchCoach != ""){
                result = result.concat('coaches=', searchCoach)
            }
        }
        result = result.concat('/')
        console.log(result)
        return result
    }


    useEffect(() => {
        fetch(getFetchLink(), {
          method: 'get',
          mode: 'cors',
          headers: new Headers({
              'Authorization': 'Token a32af8a10d8eb61c3cfbfa350ccd3ba3e8e81dcc',
          }),
        }).then((response) => response.json())
          .then((data) => {
            setStudios(data.results)
          });
      }, [searchName, searchAmenity, searchClass, searchCoach]);

    const position = (studio_lat, studio_lng) => {
        const lat = studio_lat
        const lng = studio_lng
        return {lat, lng}
    }
  
    const getStudioPosition = (studio) => {
        if (studio) {
            var posStr = studio.location.split(',')
        
            const lat = parseFloat(posStr[0])
            const lng = parseFloat(posStr[1])
    
            return position(lat, lng)
        } else {
            return position(0, 0)
        }
        
  
    }
  

    return (
        <>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="input" placeholder="Search for a gym name" />
                <Form.Control type="input" placeholder="Search for a class" />
                <Form.Control type="input" placeholder="Search for a coaches" />
                <Form.Control type="input" placeholder="Search for a amenities" />
            </Form.Group> 

            <StudioList studios={studiosArray} onClick={setChosen} chosen={chosen}/>
            <StudioMap center={getStudioPosition(chosen)} markers={studiosArray.map((studio) => getStudioPosition(studio))}/>
        </>
    )
}

export default StudioSearch