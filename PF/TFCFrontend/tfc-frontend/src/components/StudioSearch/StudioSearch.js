import StudioMap from "./StudioMap"
import StudioList from "./StudioList"
import Form from 'react-bootstrap/Form'
import { useState, useEffect} from 'react';
import './StudioSearch.css'



const StudioSearch = () => {

    const [studiosArray, setStudios] = useState([])
    const [chosen, setChosen] = useState()
    const [searchName, setSearchName] = useState("")
    const [searchAmenity, setSearchAmenity] = useState("")
    const [searchClass, setSearchClass] = useState("")
    const [searchCoach, setSearchCoach] = useState("")
    
    const getFetchLink = () => {
        var result = 'http://127.0.0.1:8000/api/studios/list'
        
        const queries = [searchName, searchAmenity, searchClass, searchCoach]
        const params = new URLSearchParams()
        if (queries.some((query) => query != "")) {

            if(searchName != ""){
                params.append("name", searchName)
            }

            if(searchAmenity != ""){
                params.append("amenities", searchAmenity)
            }

            if(searchClass != ""){
                params.append("classes", searchClass)
            }

            if(searchCoach != ""){
                params.append("coaches", searchCoach)
            }
            result = result.concat("?" + params.toString())
        } else {
            result = result.concat('/')
        }
        console.log(result)
        return result
    }

    useEffect(() => {
        fetch(getFetchLink(), {
          method: 'get',
          mode: 'cors',
          headers: new Headers({
              'Authorization': 'Token a32af8a10d8eb61c3cfbfa350ccd3ba3e8e81dcc',
              'Content-type': 'application/json' 
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

    const handleSearchNameChange = (e) => {
        e.preventDefault(); // prevent the default action
        setSearchName(e.target.value); // set name to e.target.value (event)
    };

    const handleSearchAmenityChange = (e) => {
        e.preventDefault(); // prevent the default action
        setSearchAmenity(e.target.value); // set name to e.target.value (event)
    };
    const handleSearchCoachChange = (e) => {
        e.preventDefault(); // prevent the default action
        setSearchCoach(e.target.value); // set name to e.target.value (event)
    };

    const handleSearchClassChange = (e) => {
        e.preventDefault(); // prevent the default action
        setSearchClass(e.target.value); // set name to e.target.value (event)
    };

    return (
        <>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="input" placeholder="Search for a gym name" onChange={handleSearchNameChange}/>
                <Form.Control type="input" placeholder="Search for a class" onChange={handleSearchClassChange}/>
                <Form.Control type="input" placeholder="Search for a coaches" onChange={handleSearchCoachChange}/>
                <Form.Control type="input" placeholder="Search for a amenities" onChange={handleSearchAmenityChange}/>
            </Form.Group> 
            <div className="studio-search-flex-box">
                <StudioList className="studio-search-flex-item studio-list" studios={studiosArray} onClick={setChosen} chosen={chosen}/>
                <StudioMap className="studio-search-flex-item studio-map" center={getStudioPosition(chosen)} markers={studiosArray.map((studio) => getStudioPosition(studio))}/>
            </div>
        </>
    )
}

export default StudioSearch