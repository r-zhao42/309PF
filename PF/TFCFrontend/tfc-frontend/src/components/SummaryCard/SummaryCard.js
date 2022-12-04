import Button from 'react-bootstrap/Button';
import './SummaryCard.js'


const SummaryCard = (props) => {
    return(
        <div className='summaryCard'>
            <h2>{props.title}</h2>
            {props.link &&
                <a href="#gym-details">{props.link}</a>
            }
            
            {props.subtitles.map((text) => <p>{text}</p>)}

            <div>
                {props.buttons.map((button) => <Button variant='outline-primary'>{button}</Button>)}
            </div>
        </div>
    )
}

export default SummaryCard