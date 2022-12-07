import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import TimePicker from 'react-time-picker'


const ClassSearch = ({setCoach, setName, setDate, setStartTime, setEndTime, start, end}) => {

    const getDaysArray = function(start, end) {
        console.log(start)
        console.log(end)
        for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    };
    const handleSelect = (ranges) => {
        console.log(ranges)
        const datesArr = getDaysArray(ranges.selection.startDate, ranges.selection.endDate)
        console.log(datesArr);
        const formattedDates = datesArr.map((date) => date.toISOString().split('T')[0])
        console.log(formattedDates)

        setDate(formattedDates.join(','))
      }

      const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }

    const handleNameChange = (e) => {
        e.preventDefault(); // prevent the default action
        setName(e.target.value); // set name to e.target.value (event)
    };
    const handleCoachChange = (e) => {
        e.preventDefault(); // prevent the default action
        setCoach(e.target.value); // set name to e.target.value (event)
    };

    const handleStartChange = (time) => {
        // const start = date.toLocaleTimeString()
        time ? setStartTime(time.concat(":00")) : setStartTime("")
    }

    const handleEndChange = (time) => {
        // const start = date.toLocaleTimeString()
        time ? setEndTime(time.concat(":00")) : setEndTime("")
    }


    return (
        <Form >
            <Form.Control onChange={handleNameChange} type="text" placeholder="Search for a class name" />
            <Form.Control onChange={handleCoachChange} type="text" placeholder="Search for a coach name" />
            <TimePicker onChange={handleStartChange} disableClock={true} value={start}/>
            <TimePicker onChange={handleEndChange} disableClock={true} value={end}/>
            <Dropdown>
                
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dropdown Button
                </Dropdown.Toggle>

                {/* <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">  */}
                        <DateRangePicker
                            ranges={[selectionRange]}
                            onChange={handleSelect}
                        />
                    {/* </Dropdown.Item>
                </Dropdown.Menu> */}
            </Dropdown>
        </Form>
    )
}

export default ClassSearch