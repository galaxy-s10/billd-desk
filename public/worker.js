self.addEventListener('message', function (e) {
  if (e.data.type === 'request-start-msr-loop') {
    if (e.data.delay > 0) {
      const timer = setInterval(function () {
        self.postMessage({
          type: 'response-msr-looping',
          timer,
        });
      }, e.data.delay);
      self.postMessage({
        type: 'response-start-msr-loop',
        timer,
      });
    }
  } else if (e.data.type === 'request-start-loop') {
    if (e.data.delay > 0) {
      const timer = setInterval(function () {
        self.postMessage({
          type: 'response-looping',
          timer,
        });
      }, e.data.delay);
      self.postMessage({
        type: 'response-start-loop',
        timer,
      });
    }
  } else if (e.data.type === 'request-clear-loop') {
    clearInterval(e.data.timer);
  }
});
