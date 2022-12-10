const input = require('./input');

// parsing input to array of commands, where command is array with direction and number of steps 
const commands = input.split('\n').map(str => str.split(' ').map((el, index) => {
  if (index) return Number(el);
  return el;
}));

/**
 * Part 1 
 * Solution with matrix and places 
 * It's similar to map, that is opened on each step
 * We create places while moving our head and tail 
 * and mark as visited places, where tail have been 
 */
function Place(row, col) {
  this.row = row;
  this.col = col;
  this.visited = false;

  this.setVisited = function(visited) {
    this.visited = visited;
  }
}

function Matrix(knot) {
  this.head = null;
  this.tail = null;
  this.map = [];
  this.length = knot;

  this.start = function() {
    const place = new Place(0, 0);
    place.setVisited(true);
    this.map[0] = [place];
    this.head = place;
    this.tail = place;
  }

  this.getPlace = function(row, col) {
    return this.map[row]?.find(place => place.col === col);
  }

  this.addPlace = function(place) {
    const row = place.row;

    this.map[row] = this.map[row] || [];
    this.map[row].push(place);
    return place;

  }
  
  this.makeStepHead = function(direction, steps) {
    let row = this.head.row;
    let col = this.head.col;

    switch (direction) {
      case 'U':
        row -= steps;
        break;
      case 'D': 
        row += steps;
        break;
      case 'L':
        col -= steps;
        break;
      case 'R': 
        col += steps;
        break;
    }

    this.head = new Place(row, col);
  }

  this.makeStepTail = function() {
    const rowHead = this.head.row;
    const colHead = this.head.col;
    const rowTail = this.tail.row;
    const colTail = this.tail.col;

    let newRowTail = rowTail;
    let newColTail = colTail;
    // collect visited by tail places 
    const tailPlaces = [];

    // add places while tail isn't close enough to head 
    do {
      if (rowHead === newRowTail) {
        if ((colHead - newColTail) < 0) {
          newColTail--;
        } else {
          newColTail++;
        }
      } else if (colHead === newColTail) {
        if ((rowHead - newRowTail) < 0) {
          newRowTail--;
        } else {
          newRowTail++;
        }
      } else {
        newRowTail = rowHead < newRowTail ? newRowTail - 1 : newRowTail + 1; 
        newColTail = colHead < newColTail ? newColTail - 1 : newColTail + 1; 
      }

      tailPlaces.push(new Place(newRowTail, newColTail));

    } while (!this.isTailAndHeadCloseEnough(this.head, tailPlaces[tailPlaces.length - 1])); 

    // add tail places to our matrix and mark them as visited 
    tailPlaces.forEach((place) => {
      if (this.getPlace(place.row, place.col)) {
        place.setVisited(true);
      } else {
        this.addPlace(place);
        place.setVisited(true);
      }
    });

    // update tail 
    this.tail = tailPlaces[tailPlaces.length - 1];
  }

  this.moveHead = function(direction, steps) {
    this.makeStepHead(direction, steps); 
    if (!this.isTailAndHeadCloseEnough(this.head, this.tail)) {
      this.makeStepTail();
    }
  }

  this.isTailAndHeadCloseEnough = function(head, tail) {
    return Math.abs(head.row - tail.row) <= this.length && Math.abs(head.col - tail.col) <= this.length;
  }

  this.getNumberOfVisited = function() {
    const res = Object.keys(this.map)
    .reduce((prev, key, rowIndex) => {
      const rowVisited = this.map[key].reduce((prev, place) => {
        if (place.visited) {
          return prev + 1;
        } 
        return prev;
      }, 0);
      return prev + rowVisited;
    }, 0);

    return res;
  }
}

const matrix = new Matrix(1);

matrix.start(); 

commands.forEach(([direction, steps], index) => {
  matrix.moveHead(direction, steps);
}); 

const res1 = matrix.getNumberOfVisited();


/** 
 * Part 2 
 * Solution with linked list for head + whole tail 
 * All motions and principe remind me about snake game, so naming corresponds
*/

function SnakeNode(row, col, next) {
  this.row = row;
  this.col = col;
  this.next = next || null;
}

function Snake(length) {
  // our linked list 
  this.head = new SnakeNode(0, 0, new SnakeNode(0, 0, null));
  // number of 
  this.maxLength = length - 1;
  this.length = 0; 

  // store for visited places - object, where key is string row_col
  // it's object for avoiding duplication of visited string 
  this.visited = {
    // right away add start point, because it's definitely visited and it looks funny :) 
    '0_0': true,
  }; 

  this.isNeedMove = function(head, tail) {
    return !(Math.abs(head.row - tail.row) <= 1 && Math.abs(head.col - tail.col) <= 1);
  }

  this.defineCoordsForEnd = function(start, end) {
    let newRow = end.row;
    let newCol = end.col;

    if (start.row === end.row) {
      if ((start.col - end.col) < 0) {
        newCol--;
      } else {
        newCol++;
      }
    } else if (start.col === end.col) {
      if ((start.row - end.row) < 0) {
        newRow--;
      } else {
        newRow++;
      }
    } else {
      newRow = start.row < end.row ? newRow - 1 : newRow + 1; 
      newCol = start.col < end.col ? newCol - 1 : newCol + 1; 
    }

    return [newRow, newCol];
  }

  // move all nodes of list except head 
  this.moveTail = function(start, end) {
    if (this.isNeedMove(start, end)) {
      // if it's not end node, we need move next nodes
      if (end.next) {
        const [row, col] = this.defineCoordsForEnd(start, end);
        end.row = row;
        end.col = col;
        this.moveTail(end, end.next); 
      } else {
        // if it's end, we need to define: should we move it or can add new node
        if (this.length < this.maxLength) {
          // add new transit node and increase length
          const [row, col] = this.defineCoordsForEnd(start, end);
          const transit = new SnakeNode(row, col, end);
          start.next = transit;
          this.length = this.length + 1; 
        } else {
          // update end of tale and add place in visited 
          const [row, col] = this.defineCoordsForEnd(start, end);
          end.row = row;
          end.col = col;

          // mark place as visited
          const visited = `${row}_${col}`;
          this.visited[visited] = true;
        }
      }
    }
  }

  this.getVisited = function() {
    return Object.keys(this.visited).length;
  }

  this.moveU = function() {
    this.head.row = this.head.row - 1;
    this.moveTail(this.head, this.head.next);
    
  }

  this.moveD = function() {
    this.head.row = this.head.row + 1; 
    this.moveTail(this.head, this.head.next);

  }

  this.moveR = function() {
    this.head.col = this.head.col + 1; 
    this.moveTail(this.head, this.head.next);
  }

  this.moveL = function() {
    this.head.col = this.head.col - 1; 
    this.moveTail(this.head, this.head.next);
  }
}

const snake = new Snake(9);

commands.forEach(([direction, steps], index) => {
  for (let i=0; i < steps; i++) {
    const move = 'move' + direction;
    snake[move](); 
  }
});

const res2 = snake.getVisited();





