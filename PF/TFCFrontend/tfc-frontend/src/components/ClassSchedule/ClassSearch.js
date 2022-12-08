import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import React from 'react';
import Form from 'react-bootstrap/Form';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField';

import { useState } from 'react';


const ClassSearch = ({setCoach, setName, setDate, setStartTime, setEndTime, dateRange}) => {

    const handleDateChange = (newRange) => {
        console.log("rang;ajskdhflkajsdhflkjsadhfe")
        console.log(newRange)

        setDate(newRange.selection)
      }

    const handleNameChange = (e) => {
        e.preventDefault(); // prevent the default action
        setName(e.target.value); // set name to e.target.value (event)
    };
    const handleCoachChange = (e) => {
        e.preventDefault(); // prevent the default action
        setCoach(e.target.value); // set name to e.target.value (event)
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
        setStartTime(startTime)
        setEndTime(endTime)
    };

    return (
        <Form >
            <Form.Control onChange={handleNameChange} type="text" placeholder="Search for a class name" />
            <Form.Control onChange={handleCoachChange} type="text" placeholder="Search for a coach name" />
            <p>{timeRange[0]} - {timeRange[1]}</p>
            <Slider
                value={range}
                onChange={handleTimeChange}
                min={0}
                max={1439}
                step={15}
                disableSwap
                />
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDateRangePicker
                    // displayStaticWrapperAs="desktop"
                    value={dateRange}
                    onChange={handleDateChange}
                    // renderInput={(startProps, endProps) => (
                    // <React.Fragment>
                    //     <TextField {...startProps} />
                    //     <Box sx={{ mx: 2 }}> to </Box>
                    //     <TextField {...endProps} />
                    // </React.Fragment>
                    // )}
                />
            </LocalizationProvider> */}

            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Start Date"
                preventDefault
                value={dateRange[0]}
                onChange={(newValue) => {
                setDate([newValue, dateRange[1]]);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
                label="End Date"
                value={dateRange[1]}
                onChange={(newValue) => {
                setDate([dateRange[0], newValue]);
                }}
                renderInput={(params) => <TextField {...params} />}
                disablePast={true}
            />
            </LocalizationProvider>
        </Form>
    )
}

export default ClassSearch