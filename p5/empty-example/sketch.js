function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function hueristic(a, b) {
  var d = dist(a.i, a.j,b.i,b.j);
  //var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}



var cols = 100;
var rows = 100;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var blocks = [];
var start;
var end;
var w, h;
var path = [];

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.blockNeighbors = 0;
  this.previous = undefined;

  this.show = function(col) {
    fill(col);
    noStroke();
    rect(this.i * w, this.j * h, w , h);
  }

  this.addNeighbors = function(grid,blocks) {
    var i = this.i;
    var j = this.j;
    this.blockNeighbors = 0;
    this.neighbors = [];
    /*
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    */

    for(var x = -1; x < 2; x++){

      for(var y = -1; y < 2; y++){

        if(this.i + x > -1 && this.i + x < cols){

          if(this.j + y > -1 && this.j + y < rows){

            if(!blocks.includes(grid[this.i + x][this.j+y])){
              this.neighbors.push(grid[this.i + x][this.j+y]);
            }else{
            	this.blockNeighbors += 1;
            }

          }else{
          	this.blockNeighbors -= 0.5;
          }
        }else{
        	this.blockNeighbors -= 0.5;
        }
      }
    }
  }
}

function fillGridWithRandomSpots(grid, density, smoothing){
  var returnArray = [];

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if(Math.random() < density){
        returnArray.push(grid[i][j]);
      }
    }
  }

  for (var i = 0; i < returnArray.length; i++) {
    
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid,returnArray);
    }
  }
 

  for(var x = 0; x < smoothing; x++){

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if(returnArray.includes(grid[i][j])){

      	if(grid[i][j].blockNeighbors + Math.random() < 6){
      		removeFromArray(returnArray,grid[i][j]);
      	}
      }else{
      	if(grid[i][j].blockNeighbors + Math.random() > 4){
      		returnArray.push(grid[i][j]);
      	}
      }
    }
  }

  }

  return returnArray;
}

function setup() {
  // put setup code here
  createCanvas(600, 600);
  console.log('A*');

  w = width / cols;
  h = height / rows;

  for (i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  blocks = fillGridWithRandomSpots(grid, 0.5, 10);


  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid,blocks);
    }
  }



  start = grid[0][0];
  end = grid[cols - 1][rows - 1];

  openSet.push(start);

  console.log(grid);
}

function draw() {
  if (openSet.length > 0) {
    //keep going
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    if (current === end) {

      noLoop();
      console.log("Done!");
    }
    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        var tempG = current.g + 1;

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h = hueristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h * 2;
        neighbor.previous = current;

      }
    }
  }
  background(255);



  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  for (var i = 0; i < blocks.length; i++) {
    blocks[i].show(color(0, 0, 0));
  }

  //find path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }



}
