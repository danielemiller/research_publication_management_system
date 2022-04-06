import React from 'react'

import './statuscard.css'

const StatusCard = props => {
    return (
        <div className='status-card'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info">
                <h4>{props.description}</h4>
                <span>{`${props.header}: ${props.status}`}</span>
                <span>{`${props.header}: ${props.year}`}</span>
                <span>{`${props.header}: ${props.isFirstAuthor}`}</span>
                <span>{`${props.header}: ${props.isSubmited}`}</span>
                <span>{`${props.header}: ${props.decision}`}</span>
                <span>{`${props.header}: ${props.citation}`}</span>
            </div>
        </div>
    )
}

export default StatusCard
