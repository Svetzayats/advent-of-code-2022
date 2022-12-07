const input = require('./input');

const data = input.split('\n');
const dirs = {};

const currentPath = [];

// parsing data and calculate size of directories 
data.forEach((str) => {
  // if it's list of files and directories, not command 
  if (!str.startsWith('$')) {
    if (str.startsWith('dir')) {
      // create directory in our dirs obj 
      const pathToDir = currentPath.join('/') + '/' + str.split(' ')[1];
      dirs[pathToDir] = 0;
    } else {
      // add size in this directory 
      const path = currentPath.join('/');
      const currentSize = Number(str.split(' ')[0]); 
      dirs[path] = (dirs[path] || 0) + currentSize;

      // add this size also in parent's directories 
      let i = currentPath.length - 1; 
      while (i > 0) {
        const parentPath = currentPath.slice(0, i).join('/');
        dirs[parentPath] = dirs[parentPath] + currentSize;
        i--;
      }
    }
    // if it's command 
  } else if (str.startsWith('$')) {
    let comm = str.replace('$ ', '');
    // we ignore command ls, we just update path if cd command 
    if (comm !== 'ls') {
      comm = comm.replace('cd ', '');
      switch (comm) {
        case '..': 
          currentPath.pop();
          break;
        case '/': 
          currentPath.length = 1;
          currentPath[0] = 'root';
          break;
        default: 
          currentPath.push(comm);
      }
    }
  }
});
// Part 1 
// find all size of directories that less 100000 and summarize them 
const res = Object.values(dirs).filter(size => size < 100000).reduce((prev, size) => prev + size, 0);

// Part 2
const DISK_SPACE_AVAILABLE = 70000000; 
const NEEDED_SPACE = 30000000; 
const rootSize = dirs.root;
const availableSpace = DISK_SPACE_AVAILABLE - rootSize;

const res2 = Object.values(dirs).reduce((prev, value) => {
  if (availableSpace + value >= NEEDED_SPACE && value < prev) {
    return value;
  }
  return prev;
}, rootSize);

