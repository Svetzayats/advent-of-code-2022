const input = require('./input');

const data = input.split('');

// Part 1 
const res1 = getResForLength(4);

// Part 2 
const res2 = getResForLength(14);

function getResForLength(length) {
  const signal = [];
  let index = 0;

  for (index; index < data.length; index++) {
    if (signal.length === length) {
      signal.shift();
    }
    signal.push(data[index]);
    const set = new Set(signal);
    if (set.size === length) {
      break;
    }
  }

  return index + 1;
};
