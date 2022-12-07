import './ClassSchedule.css'
import { useEffect, useState } from "react"
import ClassScheduleRow from './ClassScheduleRow';
import Button from 'react-bootstrap/Button';
import React from 'react';
import ClassSearch from './ClassSearch';


const StudioClassSchedule = (props) => {
    const [studio, setStudio] = useState()
    const [classArray, setClasses] = useState()

    const [searchName, setSearchName] = useState("")
    const [searchDates, setSearchDates] = useState("")
    const [searchCoaches, setSearchCoaches] = useState("")
    const [searchStart, setSearchStart] = useState("")
    const [searchEnd, setSearchEnd] = useState("")

    const [nextURL, setNext] = useState()
    const [prevURL, setPrev] = useState()

    useEffect(() => {
        setStudio(props.studio)
    }, [props])

    useEffect(() => {
        const getFetchLink = () => {
            const queries = [searchName, searchDates, searchCoaches, searchStart, searchEnd]
            const params = new URLSearchParams()
            console.log(studio)
            const url = "http://127.0.0.1:8000/api/studios/".concat(studio.name).concat("/classes/list/")

            if (queries.some((query) => query != "")) {

                if(searchName != ""){
                    params.append("name", searchName)
                }
    
                if(searchCoaches != ""){
                    params.append("classes", searchCoaches)
                }

                if(searchDates != ""){
                    params.append("classes", searchDates)
                }
    
    
                if(searchEnd != ""){
                    params.append("coaches", searchEnd)
                }

                if(searchStart != ""){
                    params.append("coaches", searchStart)
                }

                url.concat("?" + params.toString())
            }  else {
                url.concat("/")
            }
            console.log(url)
            return url
        }

        if (studio) {
            fetch(getFetchLink(), {
                method: 'get',
                mode: 'cors',
                headers: new Headers({
                    'Authorization': 'Token a32af8a10d8eb61c3cfbfa350ccd3ba3e8e81dcc',
                    'Content-type': 'application/json' 
                }),
              }).then((response) => response.json())
                .then((data) => {
                  // TODO 
                  console.log(data)
                  setClasses(data.results)
                  setNext(data.next)
                  setPrev(data.previous)
                });
        }
        
      }, [studio]);

    const fetchMore = (target) => {
        var fetchUrl = ""
        if (target==="next" && nextURL) {
            fetchUrl = nextURL
        } else if(target==="prev") {
            fetchUrl = prevURL
        }
        console.log(fetchUrl)

        fetch(fetchUrl, {
            method: 'get',
            mode: 'cors',
            headers: new Headers({
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-type': 'application/json' 
            }),
          }).then((response) => response.json())
            .then((data) => {
              // TODO 
              console.log(data)
              setClasses(data.results)
              setNext(data.next)
              setPrev(data.previous)
            });
    }

    const handleNext = (e) => {
        e.preventDefault();
        console.log(nextURL)
        fetchMore("next")
    }

    const handlePrev = (e) => {
        e.preventDefault();
        console.log(nextURL)
        fetchMore("prev")
    }

    return (
        <>

            {studio &&
                <>
                    <h1>Class Schedule</h1>

                    <ClassSearch 
                        setCoach={setSearchCoaches} 
                        setName={setSearchName} 
                        setDate={setSearchDates} 
                        setStartTime={setSearchStart} 
                        setEndTime={setSearchEnd}/>
                    <div className='class-table'>
                    {classArray &&
                        classArray.map((c, i)=> <ClassScheduleRow key={i} classInfo={c} />)
                    }
                    {nextURL && <Button variant="primary" onClick={handleNext}>next</Button>}
                    {prevURL && <Button variant="primary" onClick={handlePrev}>prev</Button>}
                    </div>
                </>
            }

        </>
    )
}

export default StudioClassSchedule