import './ClassSchedule.css'
import { useEffect, useState } from "react"
import ClassScheduleRow from './ClassScheduleRow';
import Button from 'react-bootstrap/Button';
import React from 'react';
import ClassSearchControl from './ClassSearchControl';
import '../NavBar/NavBar'


const StudioClassSchedule = (props) => {
    const [studio, setStudio] = useState()
    const [classArray, setClasses] = useState()

    const [searchName, setSearchName] = useState("")
    const [searchCoaches, setSearchCoaches] = useState("")
    const [searchStart, setSearchStart] = useState("")
    const [searchEnd, setSearchEnd] = useState("")

    const[searchDateRange, setRange] = useState([null, null])

    const [nextURL, setNext] = useState()
    const [prevURL, setPrev] = useState()

    useEffect(() => {
        setStudio(props.studio)
    }, [props])

    useEffect(() => {
        const getFetchLink = () => {
            


            const queries = [searchName, searchDateRange[0], searchDateRange[1], searchCoaches, searchStart, searchEnd]
            const params = new URLSearchParams()
            var url = "http://127.0.0.1:8000/api/studios/".concat(studio.name).concat("/classes/list/")

            if (queries.some((query) => query != "")) {
                if (searchDateRange[0]) {
                    const startDate = new Date(searchDateRange[0]).toLocaleDateString('fr-CA')
                    params.append("start_date", startDate)
                }
                if (searchDateRange[1]) {
                    const endDate = new Date(searchDateRange[1]).toLocaleDateString('fr-CA')
                    params.append("end_date", endDate) 
                }
                

                if(searchName != ""){
                    params.append("name", searchName)
                }
    
                if(searchCoaches != ""){
                    console.log("hit2")
                    params.append("coach", searchCoaches)
                }
    
    
                if(searchEnd != ""){
                    params.append("end_time", searchEnd)
                }

                if(searchStart != ""){
                    params.append("start_time", searchStart)
                }

                url = url.concat("?" + params.toString())
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
                  setClasses(data.results)
                  setNext(data.next)
                  setPrev(data.previous)
                });
        }
        
      }, [studio, searchName, searchDateRange, searchCoaches, searchStart, searchEnd]);

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
                    <div className='class-schedule'>
                        <ClassSearchControl
                            setCoach={setSearchCoaches} 
                            setName={setSearchName} 
                            setDate={setRange} 
                            setStartTime={setSearchStart} 
                            setEndTime={setSearchEnd}
                            start={searchStart}
                            end={searchEnd}
                            dateRange={searchDateRange}
                            className="class-schedule-control"
                            />
                            <div className="class-schedule-list">
                                <div className='class-table'>
                                    <table>
                                    {classArray &&
                                        classArray.map((c, i)=> <ClassScheduleRow key={i} classInfo={c} />)
                                    }
                                    </table>
                                    
                                </div>
                                    {prevURL ? <Button variant="orange" onClick={handlePrev}>prev</Button> : <Button variant="disabled" disabled>prev</Button>}
                                    {nextURL ? <Button variant="orange" onClick={handleNext}>next</Button> : <Button variant="disabled" disabled>next</Button>}

                            </div>
                    </div>
                    
                </>
            }

        </>
    )
}

export default StudioClassSchedule