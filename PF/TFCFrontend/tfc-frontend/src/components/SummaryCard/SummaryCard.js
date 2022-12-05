import Button from 'react-bootstrap/Button';
import './SummaryCard.css'


const SummaryCard = (props) => {
    return(
        <div onClick={props.onClick} className={props.active ? 'summary-card-active' : "summary-card"}>
            <h2 className="summary-title">{props.title}</h2>
            {props.link && 
                <a href={props.link} className="summary-link">link</a>
            }
            
            {props.subtitles && props.subtitles.map((text) => <p className="summary-subtitle">{text}</p>)}

            <div>
                {props.buttons && props.buttons.map((button) => <Button className="summary-button" variant='outline-orange'>{button}</Button>)}
            </div>
        </div>
    )
}

export default SummaryCard