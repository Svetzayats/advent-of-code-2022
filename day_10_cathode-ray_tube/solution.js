const input = require('./input');

const commands = input.split('\n');

function Tube() {
  this.cycle = 0; 
  this.registry = 1;
  this.reportCycle = 20; 
  this.report = [];

  this.doCycle = function() {
    this.cycle++;
    this.checkCycle();
  }

  this.checkCycle = function() {
    if (this.cycle === this.reportCycle) {
      this.report.push(this.cycle * this.registry);
      this.reportCycle += 40; 
    }
  }

  this.noop = function() {
    this.doCycle();
  }

  this.addx = function(value) {
    this.doCycle();
    this.cycle++;
    
    this.checkCycle();
    this.registry += value; 
    
  }

  this.command = function(command) {
    if (command.startsWith('noop')) {
      this.noop();
    }
    if (command.startsWith('addx')) {
      const value = Number(command.replace('addx ', ''));
      this.addx(value);
    }
  }

  this.getSumOfSignals = function() {
    const sum = this.report.reduce((prev, cur) => prev + cur, 0);
    return sum;
  }

}

const tube = new Tube(); 
commands.forEach(command => {
  tube.command(command); 
});

const res = tube.getSumOfSignals();


function Draw() {
  this.cycle = 0; 
  this.registry = 1;
  this.reportCycle = 40; 
  this.screen = [];
  this.current = []; 

  this.doCycle = function() {
    let symbol = '.';
    if (this.cycle >= (this.registry -1) && this.cycle <= (this.registry+1)) {
      symbol = '#';
    }
    this.current.push(symbol);
    this.cycle++;
  }

  this.checkCycle = function() {
    if (this.cycle === this.reportCycle) {
      this.screen.push(this.current.join(''));
      this.current = [];
      this.cycle = 0; 
    }
  }

  this.noop = function() {
    this.doCycle();
    this.checkCycle();
  }

  this.addx = function(value) {
    this.doCycle();
    this.checkCycle();
    this.doCycle();
    this.checkCycle();
    this.registry += value; 
    
  }

  this.command = function(command) {
    if (command.startsWith('noop')) {
      this.noop();
    }
    if (command.startsWith('addx')) {
      const value = Number(command.replace('addx ', ''));
      this.addx(value);
    }
  }

  this.getScreen = function() {
    this.screen.forEach((str) => {
      console.log(str + '\n');
    });
  }
}

const draw = new Draw(); 
commands.forEach(command => {
  draw.command(command); 
});

draw.getScreen();

