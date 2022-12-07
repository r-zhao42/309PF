import StudioMap from "./StudioMap"
// import StudioList from "./StudioList"
import Form from 'react-bootstrap/Form'
import { useState, useEffect} from 'react';
import './StudioSearch.css'
import SummaryCard from "../SummaryCard/SummaryCard"
import './StudioList.css'
import InfiniteScroll from 'react-infinite-scroll-component';

const componentHeight = 660;

const StudioSearch = () => {

    const [studiosArray, setStudios] = useState([])
    const [chosen, setChosen] = useState()
    const [nextUrl, setNext] = useState()
    const [currLoc, setLoc] = useState()
    

    // Form states
    const [searchName, setSearchName] = useState("")
    const [searchAmenity, setSearchAmenity] = useState("")
    const [searchClass, setSearchClass] = useState("")
    const [searchCoach, setSearchCoach] = useState("")

    // effects
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLoc(position(pos.coords.latitude, pos.coords.longitude))
            })
          } 
    }, [])

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
            setNext(data.next)
            setChosen(data.results[0])
          });
      }, [searchName, searchAmenity, searchClass, searchCoach, currLoc]);

      // helper functions
      const getFetchLink = () => {
        var result = 'http://127.0.0.1:8000/api/studios/list'
        
        const queries = [searchName, searchAmenity, searchClass, searchCoach]
        const params = new URLSearchParams()
        
        if(currLoc) {
            params.append("lat", currLoc.lat)
            params.append("lon", currLoc.lng)
        }

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
            
        } 
        result = result.concat("?" + params.toString())
        return result
    }
    
    const loadMore = () => {
        fetch(nextUrl, {
            method: 'get',
            mode: 'cors',
            headers: new Headers({
                'Authorization': 'Token a32af8a10d8eb61c3cfbfa350ccd3ba3e8e81dcc',
                'Content-type': 'application/json' 
            }),
          }).then((response) => response.json())
            .then((data) => {
              const newStudios = studiosArray.concat(data.results)
              setStudios(newStudios)
              setNext(data.next)
            });
    }

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

    // Form change handlers

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

    // return 

    return (
        <>  
            <div className="studio-search-form">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control className="studio-search-input" type="input" placeholder="Search for a gym name" onChange={handleSearchNameChange}/>
                    <Form.Control className="studio-search-input" type="input" placeholder="Search for a class" onChange={handleSearchClassChange}/>
                    <Form.Control className="studio-search-input" type="input" placeholder="Search for a coaches" onChange={handleSearchCoachChange}/>
                    <Form.Control className="studio-search-input" type="input" placeholder="Search for an amenities" onChange={handleSearchAmenityChange}/>
                </Form.Group> 
            </div>
    
            <div className="studio-search-flex-box" style={{height: componentHeight}}>
            <InfiniteScroll
                className="summary-card-list"
                dataLength={studiosArray.length}
                next={loadMore}
                hasMore={nextUrl ? true : false}
                loader={<h4>Loading...</h4>}
                height={componentHeight}
                scrollThreshold={0.99}
                scrollableTarget="summary-card-list"
                >
                {studiosArray.map((studio) => { if (studio) {
                    return  <SummaryCard active={studio===chosen} 
                    onClick={() => setChosen(studio)} 
                    title={studio.name} 
                    subtitles={[studio.address, studio.phone_num]} 
                    buttons={["Details", "Class Schedule"]}
                    links={["/studio/"+studio.name, "/class-schedule-page"]}
                    />
                }
                 })}
                </InfiniteScroll>
                <StudioMap className="studio-search-flex-item studio-map" center={getStudioPosition(chosen)} markers={studiosArray.map((studio) => getStudioPosition(studio))}/>
            </div>
        </>
    )
}

export default StudioSearch