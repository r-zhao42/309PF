import SummaryCard from "../SummaryCard/SummaryCard"
import {useState} from 'react'

const StudioList = (props) => {
    // const [chosen, setChosen] = useState()
    return (
        <div className="summary-card-list">
            {props.studios.map((studio) => <SummaryCard active={studio===props.chosen} onClick={() => props.onClick(studio)} title={studio.name} link="asdf" subtitles={[studio.address, studio.phone_num]} buttons={["Directions", "Class Schedule"]}/>)}
        </div>
    )
}

export default StudioList