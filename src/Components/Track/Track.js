import React from 'react'
import './Track.css'

export const Track = props => {

    const renderAction = () => props.isRemoval ? '-' : '+'

    const addTrack = () => {
        props.onAdd(props.track)
    }

    const removeTrack = () => {
        props.onRemove(props.track)
    }

    const handleClick = () => props.isRemoval ? removeTrack() : addTrack();

    return (
        <div className="Track">
            <div className="Track-information">
                <h3>{props.track.name}</h3>
                <p>{`${props.track.artist} | ${props.track.album}`}</p>
            </div>
            <button className="Track-action" onClick={handleClick}>{renderAction()}</button>
        </div>
    )
}