import React from 'react';

import Game from './Game';

class Games extends React.Component {
  prepareGames () {
    const { games } = this.props;

    const elements = [];

    for (let i = 0; i < games.length; i++) {
      const game = games[i];

      elements.push(
        <li key={game.id} >
          <Game game={game} />
        </li>
      );
    }

    return elements;
  }

  render () {
    return (
      <div>
        <ul>
          {this.prepareGames()}
        </ul>
      </div>
    )
  }
}

export default Games;
