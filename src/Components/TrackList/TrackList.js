import React from 'react'
import './TrackList.css'
import { Track } from '../Track/Track.js'

export const TrackList = props => {

    const tracksMapCallback = track => {
        return (
            <Track
            key={track.id}
            track={track}
            isRemoval={props.isRemoval}
            onAdd={props.onAdd}
            onRemove={props.onRemove}
            />
        )
    }

    return (
        <div className="TrackList">
            {props.tracks.map(tracksMapCallback)}
        </div>
    )
}