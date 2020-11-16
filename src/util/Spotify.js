const clientID = 'c88e7dea15a74f6c9dc9572617dc8126';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
    
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    accessUrl: `https://accounts.spotify.com/authorize?client_id=c88e7dea15a74f6c9dc9572617dc8126&response_type=token&scope=playlist-modify-public&redirect_uri=http://localhost:3000/`,


    getAccessToken() {

        const getTokenFromStorage = () => window.localStorage.getItem('accessToken');
        const getExpirationTimeFromStorage = () => window.localStorage.getItem('expirationTime');

        let accessToken = getTokenFromStorage();
        let expirationTime = Number(getExpirationTimeFromStorage());

        let currentDate = new Date();
        let currentTime = currentDate.getTime();

        console.log(`expiration time: ${expirationTime} ${typeof expirationTime}, current time ${currentTime}, expired? ${currentTime < expirationTime}`)

        if(accessToken && currentTime < expirationTime) return accessToken;

        const currentUrl = window.location.href;
        const accessTokenMatch = currentUrl.match(/access_token=([^&]*)/);
        const expirationTimeMatch = currentUrl.match(/expires_in=([^&]*)/);


        if(accessTokenMatch && expirationTimeMatch) {

            //store token
            window.localStorage.setItem('accessToken', currentUrl.match(/access_token=([^&]*)/)[1]);

            //store expirationTime
            const expiresIn = Number(currentUrl.match(/expires_in=([^&]*)/)[1]) * 1000;
            const setExpirationTime = currentDate.getTime() + expiresIn;
            window.localStorage.setItem('expirationTime', `${setExpirationTime}`);

            //clears window
            window.history.pushState('Access Token', null, '/');

            accessToken = getTokenFromStorage();
            return accessToken;
        }

        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        window.location = accessUrl;
    },

    
    search(term) {

        const accessToken = this.getAccessToken();
        console.log('search access token ' + accessToken)

        let searchEndpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;

        console.log(term);

        return fetch(searchEndpoint, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            method: 'GET'
        })
        .then(response => response.json())
        .then(jsonResponse => {

            if(!jsonResponse.tracks) return[];

            return jsonResponse.tracks.items.map(track => {
                return ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    });
            });
        });
    },

    savePlaylist(playlistName, trackURIs) {

        const accessToken = this.getAccessToken();

        if(!playlistName || !trackURIs) return;


        //fetch userID
        fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            method: 'GET'
        })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.id)

        //create new playlist
        .then(userID => {
            const createPlaylistEndpoint = `https://api.spotify.com/v1/users/${userID}/playlists`;
            return fetch(createPlaylistEndpoint, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    name: playlistName
                })
            })
        })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.id)

        //add tracks to the playlist
        .then(playlistID => {

            const addTracksEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

            return fetch(addTracksEndpoint, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    uris: trackURIs
                })
            })
        })
    },

    

}

export default Spotify;








































































// let accessToken = '';
// let expirationTime;
// const clientID = 'c88e7dea15a74f6c9dc9572617dc8126';
// const redirectURI = 'http://localhost:3000/';
// const responseType = 'token';
// const scope = 'playlist-modify-public';
// const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
// const requestUrl = `${authorizationEndpoint}?client_id=${clientID}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectURI}`;

// const Spotify = {

//     getAccessToken() {

//         if(accessToken) return accessToken;

//         let currentUrl = window.location.href;

//         // if(currentUrl.match(/access_token=([^&]*)/) && currentUrl.match(/expires_in=([^&]*)/)) {

//         //     accessToken = currentUrl.match(/access_token=([^&]*)/);
//         //     expirationTime = currentUrl.match(/expires_in=([^&]*)/);

//         //     window.setTimeout(() => accessToken = '', expirationTime * 1000);
//         //     window.history.pushState('Access Token', null, '/');

//         if(currentUrl === redirectURI && accessToken === '') {

//             window.location = requestUrl;
//             accessToken = currentUrl.match('/access_token=([^&]*)/')[1];
//             expirationTime = currentUrl.match('/expires_in=([^&]*)/')[1];
//             window.setTimeout(() => accessToken = '', expirationTime * 1000);
//             window.history.pushState('Access Token', null, '/');

//         } else {
//             // window.location = requestUrl;
//             // accessToken = currentUrl.match('/access_token=([^&]*)/')[1];
//             // expirationTime = currentUrl.match('/expires_in=([^&]*)/')[1];
//             // window.setTimeout(() => accessToken = '', expirationTime * 1000);
//             // window.history.pushState('Access Token', null, '/');
//             accessToken = currentUrl.match(/access_token=([^&]*)/)[1];
//             expirationTime = currentUrl.match(/expires_in=([^&]*)/)[1];

//             window.setTimeout(() => accessToken = '', expirationTime * 1000);
//             window.history.pushState('Access Token', null, '/');
//         }
//         return accessToken;
//     },

//     search(term) {
//         console.log(accessToken);
//         this.getAccessToken();
//         console.log(accessToken);
//         let searchEndpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
//         let trackList;
        
//         const request = () => {
//                 fetch(searchEndpoint, {
//                 headers: {
//                     'Authorization': 'Bearer ' + accessToken
//                 },
//                 method: 'GET'
//             })
//             .then(response => response.json())
//             .then(jsonResponse => {

//                 if(!jsonResponse.tracks) return [];

//                 let tracks = jsonResponse.track.items.map(track => {
//                     return {
//                         id: track.id,
//                         name: track.name,
//                         artist: track.artists[0].name,
//                         album: track.album.name,
//                         uri: track.uri
//                     }
//                 });
//                 trackList = tracks;
//             })
//         }
//         request();
//         return trackList;

//     },

//     savePlaylist(playlistName, trackURIs) {

//         accessToken = this.getAccessToken();
//         if(!playlistName || !trackURIs) return;

//         const headers = {
//             'Authorization': 'Bearer ' + accessToken
//         };

//         const requestID = async () => {
//             await fetch('https://api.spotify.com/v1/me', {
//             headers: headers,
//             method: 'GET'
//         })
//         .then(response => response.json())
//         .then(jsonResponse => jsonResponse.id)
//         };

//         let userID = requestID();

//         const createPlaylistEndpoint = `https://api.spotify.com//v1/users/${userID}/playlists`;
//         const createPlaylist = async () =>{
//             await fetch(createPlaylistEndpoint, {
//                 headers: {
//                     'Authorization': 'Bearer ' + accessToken,
//                     'Content-Type': 'application/json'
//                 },
//                 method: 'POST',
//                 body: {
//                     'name': playlistName
//                 }
//             })
//             .then(response => response.json())
//             .then(jsonResponse => jsonResponse.id)
//         }

//         const playlistID = createPlaylist();
//         const addTracksEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
//         const addTracks = async () => {
//             await fetch(addTracksEndpoint, {
//                 headers: {
//                     'Authorization': 'Bearer ' + accessToken,
//                     'Content-Type': 'application/json'
//                 },
//                 method: 'POST',
//                 body: {
//                     uris: trackURIs
//                 }
//             })
//         }

//         addTracks();

//     },
// }

// export default Spotify;