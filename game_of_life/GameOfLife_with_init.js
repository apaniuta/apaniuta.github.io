/*Set your own cell field or get random:
	var randomGame = new GameOfLife({
	canvasId: "field",
	cellSize: 10,
	color: "red",
	randomFieldSize: 15
	});

	var ownGame = new GameOfLife({
	canvasId: "field",
	cellSize: 20,
	color: "blue",
	init: [
				[0,0,0,0,0],
				[0,0,1,0,0],
				[0,0,0,1,0],
				[0,1,1,1,0],
				[0,0,0,0,0],
				]
	});*/



function GameOfLife (params) {
	'use strict';

	var canvasId = params["canvasId"],
			cellSize = params["cellSize"] || 20,
			color = params["color"] || "black",
			initArray = params["ownCellsField"] || [
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,0,1,0],
			[0,1,1,1,0],
			[0,0,0,0,0],
			],
			size = params["randomFieldSize"];

	var xLength = size || initArray[0].length,
			yLength = size || initArray.length;

	var randomArray,
			currentArray = initArray;

	if (size) {
		randomArray = generateRandomArray(size);
		currentArray = randomArray;
	}
	if (size && params["ownCellsField"]) alert('Choose one of params: randomFieldSize or ownCellsField');

	var field = document.getElementById(canvasId),
			ctx = field.getContext('2d');

	field.addEventListener("click", function(event) {
		function getCoords(elem) {
			var box = elem.getBoundingClientRect();
			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};
		}

		var fieldCoords = getCoords(this);
		var cellX = Math.floor((event.pageX - fieldCoords.left) / cellSize);
		var cellY = Math.floor((event.pageY - fieldCoords.top) / cellSize);
		console.log(cellX);
		console.log(cellY);

		if (currentArray[cellY][cellX] == 0) {
			currentArray[cellY][cellX] = 1;
			fill(cellX * cellSize + 1, cellY * cellSize + 1, cellSize - 2);
		} else {
			currentArray[cellY][cellX] = 0;
			ctx.clearRect(cellX * cellSize + 1, cellY * cellSize + 1, cellSize - 2, cellSize - 2);
		}
	});

	function drawField(cellSize) {
		field.width = xLength * cellSize;
		field.height = yLength * cellSize;
	}

	function fill(x, y, cellSize) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, cellSize, cellSize);
	}

	function generateNextArray() {
		var nextArray = [];
		for (var i = 0; i < currentArray.length; i++)
		nextArray[i] = currentArray[i].slice();

		for(var y = 0; y < yLength; y++) {
			for(var x = 0; x < xLength; x++) {

				var topY = (y-1 < 0) ? yLength-1 : y-1,
						bottomY = (y+1 > yLength-1) ? 0 : y+1,
						leftX = (x-1 < 0) ? xLength-1 : x-1,
						rightX = (x+1 > xLength-1) ? 0 : x+1;

				var neighbors = {
					top: currentArray[topY][x],
					bottom: currentArray[bottomY][x],
					left: currentArray[y][leftX],
					right: currentArray[y][rightX],
					topLeft: currentArray[topY][leftX],
					topRight: currentArray[topY][rightX],
					bottomLeft: currentArray[bottomY][leftX],
					bottomRight: currentArray[bottomY][rightX]
				};

				var neighborsSum = 0;
				for (var neighbor in neighbors) {
					neighborsSum = neighborsSum + neighbors[neighbor];
				}

				if (currentArray[y][x] == 1) {
					if (neighborsSum < 2 || neighborsSum > 3) {
					nextArray[y][x] = 0;
					} else if (neighborsSum == 2 || neighborsSum == 3) {
					nextArray[y][x] = 1;
					}
				} else {
					if (neighborsSum == 3) {
					nextArray[y][x] = 1;
					}
				}
			}
		}

		for (var i = 0; i < nextArray.length; i++)
		currentArray[i] = nextArray[i].slice();
		return currentArray;
	}

	function drawArray(array) {
		ctx.clearRect(0, 0, field.width, field.height);
		for(let y = 0; y < yLength; y++) {
			for(let x = 0; x < xLength; x++) {
				ctx.strokeStyle = "#4c4747";
				ctx.lineWidth = 0.3;
				ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
				if (array[y][x] === 1) fill(x * cellSize + 1, y * cellSize + 1, cellSize - 2);
			}
		}
	}

	function generateRandomArray(size) {
		var randArr = [];

		for(let y = 0; y < size; y++) {
			randArr[y] = [];
			for(let x = 0; x < size; x++) {
				randArr[y][x] = Math.round(Math.random());
			}
		}
		
		return randArr;
	}

	function step() {
		var array = generateNextArray();
		drawArray(array);
	}

	if(params["randomFieldSize"]) {
		drawField(cellSize);
		drawArray(randomArray);
	} else {
		drawField(cellSize);
		drawArray(initArray);
	}

	this.step = step;
}
