import React, { Component } from 'react';
import { Consumer } from '../../context.js';
import axios from 'axios';

class Search extends Component {
  state = {
    trackTitle: ''
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  findTrack = async (dispatch, e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://cors-anywhere.herokuapp.com/http://api.musixmatch.com/ws/1.1/track.search?q_track=${
          this.state.trackTitle
        }&page_size=10&page=1&s_track_rating=desc&apikey=${
          process.env.REACT_APP_MM_KEY
        }`
      );
      dispatch({
        type: 'SEARCH_TRACKS',
        payload: res.data.message.body.track_list
      });

      // Clear input
      this.setState({ trackTitle: '' });
    } catch (e) {
      throw new Error(`Could not get tracks!! ${e}`);
    }
  };

  render() {
    return (
      <Consumer>
        {value => {
          const { dispatch } = value;
          return (
            <div className="card card-body mb-4 p-4">
              <h1 className="display-4 text-center">
                <i className="fas fa-music" /> Search For A Song
              </h1>
              <p className="lead text-center">Get the lyrics for any song</p>
              <form onSubmit={this.findTrack.bind(this, dispatch)}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Song title..."
                    name="trackTitle"
                    value={this.state.trackTitle}
                    onChange={this.onChange}
                  />
                </div>
                <button
                  className="btn btn-primary btn-lg btn-block mb-5"
                  type="submit"
                >
                  Get Track Lyrics
                </button>
              </form>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

export default Search;
