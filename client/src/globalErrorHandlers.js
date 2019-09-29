'use strict';

// @see - https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
window.onerror = (message, source, lineno, colno, error) => {
  console.warn('Caught unhandled error!');
  console.error(error);
};

// @see - https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Caught unhandled promise rejectio!');
  console.error(event.reason);
}, false);
