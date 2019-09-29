import React from 'react';
import axios from 'axios';

const SERVICE_URL = 'http://localhost:3000';

class Games extends React.Component {
  async playGame (id) {
    const response = await axios({
      method: 'post',
      baseURL: SERVICE_URL,
      url: `/games/nes/${id}/play`,
    });

    console.log(response);
  }

  render () {
    const { game } = this.props;

    return (
      <div
        className="game"
        data-game-id={game.id}
        onClick={(event) => {
          event.preventDefault();
          this.playGame(game.id);
        }}
      >
        <img src={`${SERVICE_URL}${game.urlToArtwork}`} />
        <span>{game.name}</span>
      </div>
    )
  }
}

export default Games;
