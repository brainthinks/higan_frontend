import React from "react";
import axios from 'axios';

import Games from './Games';

const SERVICE_URL = 'http://localhost:3000';

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      games: [],
      gamesFetched: false,
    };
  }

  componentDidMount () {
    this.fetchGames();
  }

  async fetchGames () {
    const response = await axios({
      method: 'get',
      baseURL: SERVICE_URL,
      url: '/games/nes',
    });

    this.setState({
      games: response.data,
      gamesFetched: true,
    });
  }

  prepareGames () {
    const {
      games,
      gamesFetched,
    } = this.state;

    if (!gamesFetched) {
      return (
        <span>Loading games...</span>
      );
    }

    return (
      <Games
        games={games}
      />
    )
  }

  render () {
    return (
      <div>
        <h1>NES Games</h1>
        <button onClick={() => this.fetchGames()} >Reload Games</button>
        {this.prepareGames()}
      </div>
    )
  }
}

export default App;
