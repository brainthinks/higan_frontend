import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

async function main () {
  ReactDOM.render(<App />, document.getElementById('root'));
}

main()
  .then(() => {
    console.log('Successfully started the Higan Frontend Client app')
  })
  .catch((error) => {
    console.error(error);
    console.error('Failed to start the Higan Frontend Client app');
  })
