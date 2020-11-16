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
            searchResults: window.localStorage.getItem('searchResults') ? window.localStorage.getItem('searchResults').json() : [],
            playlistName: 'New Playlist',
            playlistTracks: []
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
        this.setState({playlistTracks: savedTracks});
    }

    removeTrack(track) {
        let savedTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
        this.setState({playlistTracks: savedTracks});
    }

    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }

    savePlaylist() {
        const trackURIs = this.state.playlistTracks.map(track => `spotify:track:${track.id}`);
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        this.setState({
            playlistName: 'New Playlist',
            playlistTracks: []
        })
    }

    search(term) {
        Spotify.search(term).then(searchResults => {
            const resultsJson = {searchResults: searchResults};
            window.localStorage.setItem('searchResults', JSON.stringify(resultsJson));
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
