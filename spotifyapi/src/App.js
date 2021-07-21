import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import Listbox from "./Listbox";
import Detail from "./Detail";
import {Credentials} from "./Credentials"
import axios from "axios";

const App =() =>{
  const spotify = Credentials();
 
  const data = [
    {value: 1, name: 'A'},
    {value: 2, name: 'B'},
    {value: 3, name: 'C'},
  ]; 

const [token, setToken] = useState("");
const [genres, setGenres] = useState({selectedGenre : "", listOfGenresFromAPI: []});
const [playlist, setPlaylist] = useState({selectedPlaylist: "", listOfPlaylistsFromAPI: []});
const [tracks, setTracks] = useState({selectedTrack: "", listOfTracksFromAPI: []});
const [trackDetail, setTrackDetail] = useState(null);

useEffect(() =>{
  axios("https://accounts.spotify.com/api/token", {
    headers:{
      "Content-Type" : "application/x-www-form-urlencoded",
      "Authorization" : "Basic " + btoa(spotify.ClientId + ":" + spotify.ClientSecret)
    },
    data: "grant_type=client_credentials",
    method: "POST",
  })
  .then(tokenResponse => {
    console.log(tokenResponse.data.access_token);
    setToken(tokenResponse.data.access_token);

    axios("https://api.spotify.com/v1/browse/categories?locale=sv_US",{
      method: "GET",
      headers: { "Authorization" : "Bearer " + tokenResponse.data.access_token}
    })
    .then(genreResponse =>{
      setGenres({
      setGenres : genres.selectedGenre,
      listOfGenresFromAPI: genreResponse.data.categories.items,
      })
    });
  })
},[genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]);

const genreChanged = val => {
  setGenres({
    selectedGenre: val,
    listOfGenresFromAPI: genres.listOfGenresFromAPI
  });

axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`,{
  method:"GET",
  headers: {"Authorization" : "Bearer " + token}
})
.then(playlistResponse => {
  setPlaylist({
    selectedPlaylist: playlist.selectedPlaylist,
    listOfPlaylistsFromAPI: playlistResponse.data.playlists.items
  })
 });

 }
 const playlistChanged = val => {
   setPlaylist({
     selectedPlaylist: val,
     listOfPlaylistsFromAPI: playlist.listOfPlaylistsFromAPI
   });

 }

 const buttonClicked = e => {
   e.preventDefault();
  axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`,{
    method: "GET",
    headers: {
      "Authorization" : "Bearer " + token
    }
  })
  .then(tracksResponse => {
    setTracks({
      selectedTrack: tracks.selectedTrack,
      listOfTracksFromAPI: tracksResponse.data.items
    })
  });
 }


const listboxClicked = val => {
  const currentTracks = [...tracks.listOfTracksFromAPI];

  const trackInfo = currentTracks.filter(t => t.track.id === val);
  setTrackDetail(trackInfo[0].track);
}


  return(
  <form onSubmit={buttonClicked}>
    <div className="container">
    <Dropdown options={genres.listOfGenresFromAPI} selectedValue={genres.selectedGenre} changed={genreChanged}/>
    <Dropdown options={playlist.listOfPlaylistsFromAPI} selectedValue={playlist.selectedPlaylist} changed={playlistChanged}/>
    <button type="submit">
      Search
    </button>
    <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked}/>
    {trackDetail && <Detail {...trackDetail}/>}
  </div>
  </form>
  );
}


export default App;