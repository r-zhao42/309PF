import SummaryCard from "../SummaryCard/SummaryCard"
import {useState} from 'react'
import './StudioList.css'

const StudioList = (props) => {
    // TODO: When class search is implemented, change link for "Class Schedule" button
    return (
        <div className="summary-card-list">
            {props.studios.map((studio) => <SummaryCard active={studio===props.chosen} 
                                                onClick={() => props.onClick(studio)} 
                                                title={studio.name} 
                                                subtitles={[studio.address, studio.phone_num]} 
                                                buttons={["Details", "Class Schedule"]}
                                                links={["/studio/"+studio.name, "/class-schedule-page"]}
                                                />)}
        </div>
    )
}

export default StudioList