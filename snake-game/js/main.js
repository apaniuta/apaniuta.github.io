//gameSnake.snakeLength(10); //Установка длины змейки (по умолчанию: 8)
//gameSnake.setBoundaries('no'); //Установка границ поля (по умолчанию: без границ)
//gameSnake.setBlocks('yes'); //Установка препятствий (по умолчанию: с препятствиями)
//gameSnake.setGameSpeed('slow'); //Установка скорости игры (по умолчанию: средняя)
gameSnake.init(); //Инициализация
//gameSnake.start();
var snake = document.querySelector('.snake'),
		overlay = document.querySelector('.overlay'),
		mainMenu = document.querySelector('.main-menu'),
		gameOptions = document.querySelector('.game-options'),
		newGame = document.querySelector('.new-game'),
		gameOptions = document.querySelector('.game-options'),
		optionsValues = document.querySelector('.options-values'),
		back = document.querySelector('.back'),
		yesBound = document.querySelector('.boundaries .yes'),
		noBound = document.querySelector('.boundaries .no'),
		yesBlocks = document.querySelector('.blocks .yes'),
		noBlocks = document.querySelector('.blocks .no'),
		speedSlow = document.querySelector('.slow'),
		speedMedium = document.querySelector('.medium'),
		speedFast = document.querySelector('.fast'),
		pauseMenu = document.querySelector('.pause-menu'),
		resume = document.querySelector('.resume'),
		backToMenuFromPause = document.querySelectorAll('.back-to-menu')[0],
		reMenu = document.querySelector('.re-menu'),
		playAgain = document.querySelector('.play-again'),
		backToMenuFromGameover = document.querySelectorAll('.back-to-menu')[1],
		highScoreValue = document.querySelector('.high-score-value'),
		gameStatus = document.querySelector('.game-status'),
		controlBtns = document.querySelector('.control-btns');

//Проверка статуса игры
function checkStatus() {
	var interval;
	interval = setInterval(function() {
		if (gameStatus.innerHTML === 'paused') {
			clearInterval(interval);
			pauseMenu.classList.toggle('hidden');
			overlay.classList.toggle('hidden');
		}
		if (gameStatus.innerHTML === 'gameOver') {
			highScoreValue.innerHTML = gameSnake.getHighScore();
			clearInterval(interval);
			reMenu.classList.toggle('hidden');
			overlay.classList.toggle('hidden');
		}
	}, 10);
}

snake.addEventListener('mousedown', function (e) {
	e.preventDefault();
});

newGame.addEventListener('click', function () {
	overlay.classList.toggle('hidden');
	mainMenu.classList.toggle('hidden');
	gameSnake.start();
	checkStatus();
});

gameOptions.addEventListener('click', function () {
	mainMenu.classList.toggle('hidden');
	optionsValues.classList.toggle('hidden');
});

back.addEventListener('click', function () {
	mainMenu.classList.toggle('hidden');
	optionsValues.classList.toggle('hidden');
});

yesBound.addEventListener('click', function (e) {
	gameSnake.setBoundaries('yes');
	yesBound.classList.add('focused');
	noBound.classList.remove('focused');
});

noBound.addEventListener('click', function (e) {
	gameSnake.setBoundaries('no');
	noBound.classList.add('focused');
	yesBound.classList.remove('focused');
});

yesBlocks.addEventListener('click', function () {
	gameSnake.setBlocks('yes');
	yesBlocks.classList.add('focused');
	noBlocks.classList.remove('focused');
});

noBlocks.addEventListener('click', function () {
	gameSnake.setBlocks('no');
	noBlocks.classList.add('focused');
	yesBlocks.classList.remove('focused');
});

speedSlow.addEventListener('click', function () {
	gameSnake.setGameSpeed('slow');
	speedSlow.classList.add('focused');
	speedMedium.classList.remove('focused');
	speedFast.classList.remove('focused');
});

speedMedium.addEventListener('click', function () {
	gameSnake.setGameSpeed('medium');
	speedSlow.classList.remove('focused');
	speedMedium.classList.add('focused');
	speedFast.classList.remove('focused');
});

speedFast.addEventListener('click', function () {
	gameSnake.setGameSpeed('fast');
	speedSlow.classList.remove('focused');
	speedMedium.classList.remove('focused');
	speedFast.classList.add('focused');
});

resume.addEventListener('click', function () {
	overlay.classList.toggle('hidden');
	pauseMenu.classList.toggle('hidden');
	gameSnake.resume();
	checkStatus();
});

backToMenuFromPause.addEventListener('click', function () {
	pauseMenu.classList.toggle('hidden');
	mainMenu.classList.toggle('hidden');
});

playAgain.addEventListener('click', function () {
	overlay.classList.toggle('hidden');
	reMenu.classList.toggle('hidden');
	gameSnake.start();
	checkStatus();
});

backToMenuFromGameover.addEventListener('click', function () {
	reMenu.classList.toggle('hidden');
	mainMenu.classList.toggle('hidden');
});
//Проверяем девайс, если мобильный или планшет добавляем кнопки для управления
//!Нужно подключить библиотеку device.js!
if (device.mobile() || device.tablet()) {
	controlBtns.classList.remove('hidden');
}
//Масштабируем игру
snake.style.height = snake.clientWidth + 'px';
document.body.style.fontSize = snake.clientWidth / 31 + 'px';
window.addEventListener('resize', function () {
	snake.style.height = snake.clientWidth + 'px';
	document.body.style.fontSize = snake.clientWidth / 31 + 'px';
});