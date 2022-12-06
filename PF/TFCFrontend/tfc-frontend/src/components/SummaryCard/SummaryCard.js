import Button from 'react-bootstrap/Button';
import '../Button/button.css'
import './SummaryCard.css'


const SummaryCard = (props) => {
    return(
        <div onClick={props.onClick} className={props.active ? 'summary-card active' : "summary-card"}>
            <h2 className="summary-title">{props.title}</h2>
            {props.link && 
                <a href={props.link} className="summary-link">link</a>
            }
            
            {props.subtitles && props.subtitles.map((text) => <p className="summary-subtitle">{text}</p>)}

            <div className="summary-card-button-list">
                {props.buttons && props.links && 
                 props.buttons.map((button, i) => <Button href={props.links[i]} className="summary-button" variant='orange'>{button}</Button>)}
            </div>
        </div>
    )
}

export default SummaryCard