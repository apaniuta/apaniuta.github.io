var game = new GameOfLife({
	canvasId: "field",
});

var startStop = document.getElementById("play_stop");

var start = document.getElementById("start");
start.addEventListener("click", game.start);

var pause = document.getElementById("pause");
pause.addEventListener("click", game.pause);

var oneStep = document.getElementById("one_step");
oneStep.addEventListener("click", game.step);

var random = document.getElementById("random");
random.addEventListener("click", game.random);

var clear = document.getElementById("clear");
clear.addEventListener("click", game.clearField);

var sizeX = document.getElementById("sizeX");
var sizeY = document.getElementById("sizeY");
var cellSize = document.getElementById("cellSize");
var color = document.getElementById("color");
var speed = document.getElementById("speed");
var applyButton = document.getElementById("apply");

applyButton.addEventListener("click", function(e){
	game.setSizeX(sizeX.value);
	game.setSizeY(sizeY.value);
	game.setCellSize(cellSize.value);
	game.setColor(color.value);
	game.setSpeed(speed.value);
});
