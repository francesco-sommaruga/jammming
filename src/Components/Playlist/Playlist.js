import React from 'react'
import './Playlist.css'
import { TrackList } from '../TrackList/TrackList.js'

export const Playlist = props => {

    const handleNameChange = (e) => {
        props.onNameChange(e.target.value);
    }

    return (
        <div className="Playlist">

            <input 
            value={props.name}
            onChange={handleNameChange}
            />

            <TrackList 
            tracks={props.tracks}
            isRemoval={true}
            onRemove={props.onRemove}
            />
            
            <button
            className="Playlist-save" 
            onClick={props.onSave}
            >SAVE TO SPOTIFY</button>
        </div>
    )
}