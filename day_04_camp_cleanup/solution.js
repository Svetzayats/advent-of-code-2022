const input = require('./input');

// preparing data, where for 2 elves - one array with array of their start and end section assignment  
const data = input
.split('\n')
.filter(el => !!el)
.map(str => str.split(',').map((el) => el.split('-').map(el => Number(el))));

// Part 1 - full overlap 
const res1 = data.reduce((prev, cur) => {
  const [first, second] = cur; 
  const [firstLeft, firstRight] = first;
  const [secondLeft, secondRight] = second;

  if (firstLeft <= secondLeft && firstRight >= secondRight) return prev + 1;
  if (firstLeft >= secondLeft && firstRight <= secondRight) return prev + 1;

  return prev; 
}, 0);

// Part 2 - any overlaps 
const res2 = data.reduce((prev, cur) => {
  const [first, second] = cur; 
  const [firstLeft, firstRight] = first;
  const [secondLeft, secondRight] = second;

  if (firstRight < secondLeft) return prev; 
  if (firstLeft > secondRight) return prev; 

  return prev + 1;
}, 0);

