import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import '../Button/button.css'
import './SummaryCard.css'
import React from 'react';



const SummaryCard = (props) => {
    return(
        <div key={props.title} onClick={props.onClick} className={props.active ? 'summary-card summary-card-active' : "summary-card"}>
            <h2 className="summary-title">{props.title}</h2>
            
            {props.subtitles && props.subtitles.map((text, i) => <p key={i} className="summary-subtitle">{text}</p>)}

            <div className="summary-card-button-list">
                {props.buttons && props.links && 
                 props.buttons.map((button, i) => <Link style={{width: "100%", paddingLeft: "20px", paddingRight: "20px"}} to={{pathname: props.links[i]}} key={i}><Button style={{width: "100%"}} className="summary-button" variant='orange'>{button}</Button></Link> ) }
            </div>
        </div>
    )
}

export default SummaryCard