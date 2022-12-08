import React from 'react';
import Form from 'react-bootstrap/Form';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField';
import './ClassSchedule.css'

import { useState } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#ce5311',
        darker: '#b74a10',
      },
    },
  });


const ClassSearchControl = ({setCoach, setName, setDate, setStartTime, setEndTime, dateRange}) => {

    
    const handleNameChange = (e) => {
        e.preventDefault(); 
        setName(e.target.value);
    };
    const handleCoachChange = (e) => {
        e.preventDefault(); 
        setCoach(e.target.value); 
    };
    const [range, setRange] = useState([0, 1440])
    const [timeRange, setTimeRange] = useState(["00:00:00", "23:59:59"])

    function padToTwoDigits(num) {
        return num.toString().padStart(2, '0');
      }

    const handleTimeChange = (event, newValue) => {
        setRange(newValue)

        const start = parseInt(newValue[0])
        const startHr = parseInt(start/60)
        const startMin = parseInt(newValue[0]) - startHr * 60
        const startTime = `${startHr}:${padToTwoDigits(startMin)}:00`

        const end = parseInt(newValue[1])
        const endHr = parseInt(end/60)
        const endMin = parseInt(newValue[1]) - endHr * 60
        const endTime = `${endHr}:${padToTwoDigits(endMin)}:00`

        setTimeRange([startTime, endTime])

    };

    const handleTimeCommitted = (event, newValue) => {
        setRange(newValue)

        const start = parseInt(newValue[0])
        const startHr = parseInt(start/60)
        const startMin = parseInt(newValue[0]) - startHr * 60
        const startTime = `${startHr}:${padToTwoDigits(startMin)}:00`

        const end = parseInt(newValue[1])
        const endHr = parseInt(end/60)
        const endMin = parseInt(newValue[1]) - endHr * 60
        const endTime = `${endHr}:${padToTwoDigits(endMin)}:00`

        setTimeRange([startTime, endTime])
        setStartTime(startTime)
        setEndTime(endTime)

    }

    return (
        <div className='class-search-control'>
            <h4>Filter Classes</h4>
            <Form >
                <Form.Control className='class-control-input' onChange={handleNameChange} type="text" placeholder="Search for a class name" />
                <Form.Control className='class-control-input' onChange={handleCoachChange} type="text" placeholder="Search for a coach name" />
                <ThemeProvider theme={theme}>
                    <div className="time-range-picker">
                        <div className="time-range-display">
                            <p>Class Starts At:</p>
                            <p>{timeRange[0]} - {timeRange[1]}</p>
                        </div>
                            <Slider
                                value={range}
                                onChange={handleTimeChange}
                                onChangeCommitted={handleTimeCommitted}
                                min={0}
                                max={1439}
                                step={15}
                                disableSwap
                                color="primary"
                                className="time-range-slider"
                            />
                    </div>
                
                
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            className='class-control-datepicker'
                            label="Start Date"
                            preventDefault
                            value={dateRange[0]}
                            onChange={(newValue) => {
                            setDate([newValue, dateRange[1]]);
                            }}
                            renderInput={(params) => <TextField {...params} 
                            color="primary"/>}
                        />
                        <DatePicker
                            className='class-control-datepicker'
                            label="End Date"
                            value={dateRange[1]}
                            onChange={(newValue) => {
                            setDate([dateRange[0], newValue]);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            disablePast={true}
                            color="primary"
                        />
                    
                    </LocalizationProvider>
                </ThemeProvider>
            </Form>
        </div>
    )
}

export default ClassSearchControl