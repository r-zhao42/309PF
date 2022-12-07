import Button from 'react-bootstrap/Button';
import './ClassSchedule.css'
import { useEffect, useState } from "react"

const StudioClassSchedule = (props) => {
    const [studio, setStudio] = useState()
    const [classArray, setClasses] = useState()

    const [searchName, setSearchName] = useState("")
    const [searchDates, setSearchDates] = useState("")
    const [searchCoaches, setSearchCoaches] = useState("")
    const [searchStart, setSearchStart] = useState("")
    const [searchEnd, setSearchEnd] = useState("")

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
                  console.log(data.results)
                  setClasses(data.results)
                });
        }
        
      }, [studio]);

    return (
        <>

            {studio &&
                <>
                    <h1>{studio.name}</h1>
                    <div className='class-table'>
                    {classArray &&
                        classArray.map((c)=> 
                        <div className="class-row">
                            <div className='class-row-text'>                            
                                <h6>{c.parent_class.name}</h6>
                                <div className='class-row-info'>
                                    <p>Date: {}</p>
                                    <p>Time: {}</p>
                                    <p>Coach: {}</p>
                                    <p>Spots Left: {}</p>

                                </div>
                            </div>

                            <div className='class-row-buttons'> 
                                <Button variant="primary">Enroll</Button>
                                <Button variant="primary">Enroll All</Button>
                            </div>
                        </div>
                        )
                    }
                    </div>
                </>
            }

        </>
    )
}

export default StudioClassSchedule