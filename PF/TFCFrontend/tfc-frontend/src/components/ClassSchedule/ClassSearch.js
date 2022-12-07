import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';


const ClassSearch = ({setCoach, setName, setDate, setStartTime, setEndTime}) => {
    const handleSelect = (ranges) => {
        console.log(ranges);
        // {
        //   selection: {
        //     startDate: [native Date Object],
        //     endDate: [native Date Object],
        //   }
        // }
      }

      const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }
    return (
        <Form >
            <Form.Control type="text" placeholder="Search for a class name" />
            <Form.Control type="text" placeholder="Search for a coach name" />
            <Form.Control type="text" placeholder="Search for a time" />
            <Dropdown>
                
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1"> 
                        <DateRangePicker
                            ranges={[selectionRange]}
                            onChange={handleSelect}
                        />
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Form>
    )
}

export default ClassSearch