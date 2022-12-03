const input = require('./input');

let data = input.split('\n').filter(el => !!el).map(el => el.split(' '));

// Part 1 

const points = {
  A: 1, 
  B: 2, 
  C: 3
}; 

function getScoreForGame(mine, other) {
  const diff = points[mine] - points[other]; 
  if (!diff) return 3; 

  // cases: paper and scissors, rock and paper 
  if (Math.abs(diff) === 1) {
    return diff > 0 ? 6 : 0; 
  }

  // case with rock and scissors 
  return diff < 0 ? 6: 0;   
}

const res = data.reduce((prev, cur) => {
  const gameScore = getScoreForGame(cur[1], cur[0]); 
  const sum = prev + points[cur[1]] + gameScore;
  return sum;
}, 0); 

// Part 2 

const resPoints = {
  X: 0, 
  Y: 3, 
  Z: 6,
}

function getResponse(other, res) {
  if (resPoints[res] === 3) return other; 

  if (resPoints[res] === 0) {
    if (other === 'A') return 'C'; 
    if (other === 'B') return 'A'; 
    if (other === 'C') return 'B';
  }

  if (resPoints[res] === 6) {
    if (other === 'A') return 'B'; 
    if (other === 'B') return 'C'; 
    if (other === 'C') return 'A';
  }
}

const res2 = data.reduce((prev, cur) => {
  return prev + resPoints[cur[1]] + points[getResponse(cur[0], cur[1])];
}, 0);

