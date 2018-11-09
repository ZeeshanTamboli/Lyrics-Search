import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import axios from 'axios';
import Moment from 'react-moment';

export class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {}
  };

  async componentDidMount() {
    try {
      // HTTP Request to get lyrics
      const lyricsRes = await axios.get(
        `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${
          this.props.match.params.id
        }&apikey=${process.env.REACT_APP_MM_KEY}`
      );
      this.setState({ lyrics: lyricsRes.data.message.body.lyrics });

      // HTTP request to get the track info
      const trackRes = await axios.get(
        `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.get?track_id=${
          this.props.match.params.id
        }&apikey=${process.env.REACT_APP_MM_KEY}`
      );
      this.setState({ track: trackRes.data.message.body.track });
    } catch (e) {
      throw new Error(`Could not get lyrics!! ${e}`);
    }
  }

  render() {
    const { lyrics, track } = this.state;

    if (
      track === undefined ||
      lyrics === undefined ||
      Object.keys(track).length === 0 ||
      Object.keys(lyrics).length === 0
    ) {
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <div className="card">
            <h5 className="card-header">
              {track.track_name} by{' '}
              <span className="text-secondary">{track.artist_name}</span>
            </h5>
            <div className="card-body">
              <p className="card-text">{lyrics.lyrics_body}</p>
            </div>
          </div>

          <ul className="list-group mt-3">
            <li className="list-group-item">
              <strong>Album ID</strong>: {track.album_id}
            </li>
            <li className="list-group-item">
              <strong>Song Genre</strong>:{' '}
              {
                track.primary_genres.music_genre_list[0].music_genre
                  .music_genre_name
              }
            </li>
            <li className="list-group-item">
              <strong>Explicit Words</strong>:{' '}
              {track.explicit === 0 ? 'No' : 'Yes'}
            </li>
            <li className="list-group-item">
              <strong>Release Date</strong>:{' '}
              <Moment format="MM/DD/YYYY">{track.first_release_date}</Moment>
            </li>
          </ul>
        </React.Fragment>
      );
    }
  }
}

export default Lyrics;
