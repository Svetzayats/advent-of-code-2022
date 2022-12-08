const input = require('./input');

const data = input.split('\n').map(str => str.split('').map(el => Number(el)));

function getVisibleTrees(matrix) {
  const lastRowIndex = matrix.length - 1;
  const lastColIndex = matrix[0].length -1;

  const isVisible = (coords) => {
    const [row, col] = coords;
    if (row === 0 || row === lastRowIndex || col === 0 || col === lastColIndex) {
      return true;
    } 

    const current = matrix[row][col];

    // trees on the left 
    const left = matrix[row].slice(0, col);
    // trees on the right 
    const right = matrix[row].slice(col+1);
    const column = matrix.map(r => r[col]);
    // trees from above 
    const top = column.slice(0, row);
    // trees from below
    const bottom = column.slice(row+1);

    // if from one side tree is bigger than others from that side, tree is visible 
    return left.every(tree => tree < current) || right.every(tree => tree < current) ||
    top.every(tree => tree < current) || bottom.every(tree => tree < current);
  }

  // calculate quantity of visible trees 
  const res = matrix.reduce((prev, row, rowIndex) => {
    const visibleTreesInRow = row.reduce((pr, tree, colIndex) => {
      return pr + (isVisible([rowIndex, colIndex]) ? 1 : 0);
    }, 0);

    return prev + visibleTreesInRow;
  }, 0);

  return res;
}

const res = getVisibleTrees(data);
console.log(res);

// Part 2 
function getScore(arr, value) {
    if (!arr.length) return 1;

    let i = 0;
    while (i < arr.length) {
      // stop counting if we see tree with same or higher height or it's last element
      if (arr[i] === value || arr[i] > value || i === arr.length - 1) {
        break;
      }

      i++;
    }
    // add 1 because i - index 
    return i + 1;
}

function getScenicScore(matrix) {
    const scenicScore = (coords) => {
    const [row, col] = coords;
    const current = matrix[row][col];

    // trees on the left, do reverse for right order of trees
    const left = matrix[row].slice(0, col).reverse();
    // trees on the right 
    const right = matrix[row].slice(col+1);
    const column = matrix.map(r => r[col]);
    // trees from above, do reverse for right order of trees
    const top = column.slice(0, row).reverse();
    // trees from below
    const bottom = column.slice(row+1);

    const leftScore = getScore(left, current);
    const rightScore = getScore(right, current);
    const topScore = getScore(top, current);
    const bottomScore = getScore(bottom, current);

    return leftScore * rightScore * topScore * bottomScore;
  }

  // calculate scores for each tree 
  const res = matrix.map((row, rowIndex) => row.map((tree, treeIndex) => scenicScore([rowIndex, treeIndex])));
  return res;
}

// find the top score from scores of trees 
const res2 = getScenicScore(data).reduce((prevRowMax, row) => {
  const rowMax = row.reduce((prev, cur) => {
    return prev < cur ? cur : prev;
  }, 0);
  return prevRowMax < rowMax ? rowMax : prevRowMax;
}, 0);

console.log(res2);



