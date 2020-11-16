import React from 'react';
import Spotify from '../../util/Spotify.js'
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import { Playlist } from '../Playlist/Playlist.js';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchResults: window.localStorage.getItem('searchResults') ? JSON.parse(window.localStorage.getItem('searchResults')) : [],
            playlistName: window.localStorage.getItem('playlistName') ? window.localStorage.getItem('playlistName') : 'New Playlist',
            playlistTracks: window.localStorage.getItem('playlistTracks') ? JSON.parse(window.localStorage.getItem('playlistTracks')) : []
        };

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) return;

        let savedTracks = this.state.playlistTracks;
        savedTracks.push(track);
        window.localStorage.setItem('playlistTracks', JSON.stringify(savedTracks));
        this.setState({playlistTracks: savedTracks});
    }

    removeTrack(track) {
        let savedTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
        window.localStorage.setItem('playlistTracks', JSON.stringify(savedTracks));
        this.setState({playlistTracks: savedTracks});
    }

    updatePlaylistName(name) {
        window.localStorage.setItem('playlistName', name);
        this.setState({playlistName: name});
    }

    savePlaylist() {
        const trackURIs = this.state.playlistTracks.map(track => `spotify:track:${track.id}`);
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        window.localStorage.setItem('playlistTracks', JSON.stringify([]));
        this.setState({
            playlistName: 'New Playlist',
            playlistTracks: []
        })
    }

    search(term) {
        Spotify.search(term).then(searchResults => {
            window.localStorage.setItem('searchResults', JSON.stringify(searchResults));
            this.setState({searchResults: searchResults})
        });
    }

    render() {
        
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">

                    <SearchBar onSearch={this.search} />
                    
                    <div className="App-playlist">

                            <SearchResults 
                            searchResults={this.state.searchResults} 
                            onAdd={this.addTrack} 
                            />

                            <Playlist 
                            name={this.state.playlistName} 
                            tracks={this.state.playlistTracks} 
                            onRemove={this.removeTrack}
                            onNameChange={this.updatePlaylistName}
                            onSave={this.savePlaylist}
                            />
                    </div>
                </div>
            </div>
        )
    }
}


export default App;
