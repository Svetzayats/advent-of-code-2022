const input = require('./input');

// preparing data: turn string to array filled array with numbers of calories 
const data = input.split('\n  \n  ').map(str => str.split('\n').map(el => Number(el.trim())));

// part one solution 
const resForOneElf = data.reduce((prev, current) => {
  const calories = current.reduce((pr, cur) => pr + cur, 0);
  if (calories > prev) {
    return calories;
  } else {
    return prev;
  }
}, 0);

console.log(resForOneElf);

// part two solution 
const resForThreeElves = data.reduce((prev, current) => {
  const calories = current.reduce((pr, cur) => pr + cur, 0);
  const index = prev.findIndex((cur) => cur < calories);
  if (index !== -1) {
    prev.splice(index, 1, calories);
    prev.sort();
  }
  return prev;
}, [0, 0, 0]);

console.log(resForThreeElves);