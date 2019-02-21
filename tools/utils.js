function creatProxy() {
  const eventNames = Array.prototype.slice.call(arguments);
  const cb = eventNames.pop();
  const events = [];
  eventNames.forEach(name => {
    events.push([name]);
  });
  const total = events.length;
  let count = 0;
  const emit = () => {
    Promise.all(events.map(event => {
      return event[1]
    }))
      .then(args => {
        cb(...args);
      });
  };
  return function add(eventName, event) {
    console.log('-=-=add event=-=-', eventName);
    for (let i = 0; i < total; i++) {
      if (events[i][0] === eventName) {
        if (events[i][1]) {
          throw new Error(`event ${eventName} has emitted`);
        };
        count++;
        events[i].push(event);
        if (total === count) emit();
        break;
      };
    };
  };
};

module.exports = {
  creatProxy,
};