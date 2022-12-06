const input = require('./input');

// preparing data: we need split stack and movements 
let [stacks, commands] = input.split('\n\n');

// create array of commands 
// in result each command is array with 3 numbers (move, from, to)
commands = commands.split('\n').map(command => {
  const arr = command.split(' ');
  const res = [];
  arr.forEach(el => {
    const n = Number(el); 
    if (n) {
      res.push(n);
    }
  });
  return res;
});

// define our stacks 
stacks = stacks.split('\n').filter(el => !!el);

// create stack object, where key is number of stack (last string)
let stack = stacks[stacks.length-1].split('   ').map((el) => el.trim()).reduce((prev, cur) => {
  return {
    ...prev, 
    [cur]: []
  }
}, {});

// 
const containers = [];
for (let i = 0; i < stacks.length -1; i++) {
  const arr = stacks[i].split('');
  // an array with crate or spaces - one column of row
  let crate;
  // array of crates - all containers from row
  let container = [];
  // divide array on parts of 4 element (each column consist from 3 symbols + space separator)
  arr.forEach((el, index) => {
    if (index % 4 === 0) {
      if (crate) {
        container.push(crate);
      }
      crate = [];
    }
    crate.push(el);
  });
  // add last crate
  if (crate.length) {
    container.push(crate);
  }
  // save crates for row 
  containers.push(container);
}

// fill stack with our containers 
// start from end for correct order  
for (let i = containers.length -1; i > -1; i--) {
  // all values for this row 
  const el = containers[i];
  el.forEach((item, index) => {
    const str = item.join('').trim();
    // add only not empty carves in stack - define key with place in row 
    if (str) {
      const res = str[str.search(/\w/)];
      stack[index + 1].push(res);
    }
  });
}

// turn stack into string for reusing 
stack = JSON.stringify(stack);

// Part 1 
const stack1 = JSON.parse(stack);
commands.forEach(([move, from, to]) => {
  for (let i=0; i < move; i++) {
    const crate = stack1[from].pop();
    if (crate) {
      stack1[to].push(crate);
    }
  }
});

const res1 = Object.values(stack1).reduce((prev, el) => {
  return prev + (el[el.length-1] || '');
},'');

// Part 2 
const stack2 = JSON.parse(stack);
commands.forEach(([move, from, to]) => {
  const crates = stack2[from].splice(stack2[from].length - move);
  stack2[to].push(...crates);
});

const res2 = Object.values(stack2).reduce((prev, el) => {
  return prev + (el[el.length-1] || '');
},'');
