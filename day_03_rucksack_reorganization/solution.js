const input = require('./input');

// preparing data 
const data =  input
.split('\n')
.filter(el => !!el)
.map(str => [str.slice(0, str.length/2), str.slice(str.length/2)]);

// create array with alphas, where index = priority
const alphaUpperCase = Array.from(Array(26)).map((e, i) => i + 65);
const alphabetUpperCase = alphaUpperCase.map((x) => String.fromCharCode(x));
const alphaLowerCase = Array.from(Array(26)).map((e, i) => i + 97);
const alphabetLowerCase = alphaLowerCase.map((x) => String.fromCharCode(x));
const alpahbet = [...alphabetLowerCase, ...alphabetUpperCase];
const priorities = [null, ...alpahbet];

// Part 1 
function findSharedItem(str1, str2) {
  const arr1 = str1.split('');
  const arr2 = str2.split('');
  const item = arr1.find(el => arr2.includes(el)); 
  return item; 
}

const res = data.reduce((prev, cur) => {
  const item = findSharedItem(cur[0], cur[1]);
  const priotity = priorities.findIndex((el) => el === item);
  return prev + priotity;
}, 0);

// Part 2 

// preparing data, no need to split on two parts of string 
const data2 = input
.split('\n')
.filter(el => !!el);

const groups = []; 
let i = 0; 

// array with groups of rucksacks 
while (i < data2.length-1) {
  const group = [data2[i], data2[i+1], data2[i+2]];
  groups.push(group);
  i += 3; 
}

const res2 = groups.reduce((prev, curr) => {
  const common = alpahbet.find((el) => curr[0].includes(el) && curr[1].includes(el) && curr[2].includes(el));
  const priotity = priorities.findIndex((el) => el === common);
  return prev + priotity;
}, 0);




