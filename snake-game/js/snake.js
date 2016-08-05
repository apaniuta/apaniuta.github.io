var gameSnake = (function () {
	'use strict';
	//Объявляем переменные
	//Создаём поле
	var canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d');
	//Объявляем основные переменные
	var canvSize = null,
			cellSize = null,
			font = null,
			grid = null,
			w = null,
			h = w,
			speed = null,
			delay = null,
			score = 0,
			highScore = score,
			dir = null,
			gameLoop = null,
			snakeLength = 8,
			currSnake = null,
			food = null,
			boundaries = true,
			withBlocks = false;
	//Считаем задержку
	function setDelay() {
		delay = 5000 / speed;
	}
	//Задаём масштаб
	function scale() {
		canvSize = (innerWidth < innerHeight ? innerWidth : innerHeight) * 0.8;
		cellSize = canvSize / 25; //Делим только на нечетные!!! Иначе центральныйквадратный блок неправильно рисуется.
		font = cellSize / 1.5;
		grid = canvSize / cellSize;
		w = canvSize;
		h = w;
		canvas.width = w;
		canvas.height = h;
	}
	//Snake
	//Инициализируем змейку
	function initSnake() {
		currSnake = [];
		for (var i = snakeLength - 1; i >= 0; i--) {
			currSnake.push({x: i + 1, y: 1});
		}
	}
	//Генерируем следующую змейку
	function nextSnake() {
		var head = {
			x: currSnake[0].x, 
			y: currSnake[0].y
		};
		if (dir === 'right') {
			head.x++;
		} else if (dir === 'left') {
			head.x--;
		} else if (dir === 'up') {
			head.y--;
		} else if (dir === 'down') {
			head.y++;
		}
		for (var i = 0; i < currSnake.length; i++) {
			if (checkCollision (head, currSnake[i])) {
				gameOver();
				return;
			}
		}
		//without boundaries
		//Поле с границами или без
		if (boundaries) {
			if (head.x === grid || head.y === grid || head.x < 0 || head.y < 0) {
				gameOver();
				return;
			}
		} else {
			head.x = (head.x + grid) % grid;
			head.y = (head.y + grid) % grid;
			//Еще одна реализация поля без границ
			/*head.x = (head.x < 0) ? grid - 1 : head.x;
			head.x = (head.x === grid) ? 0 : head.x;
			head.y = (head.y < 0) ? grid - 1 : head.y;
			head.y = (head.y === grid) ? 0 : head.y;*/
		}
		//Если змейка ударяется в преграду заканчиваем игру
		if (withBlocks) {
			var blocksLength = blocks.length;
			for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var i = 0; i < blockLength; i++) {
					if (checkCollision (head, blocks[a][i])) {
						gameOver();
						return;
					}
				}
			}
			//SquareBlocks
			/*for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var j = 0; j < blockLength; j++) {
					for (var i = 0; i < blockLength; i++) {
						if (checkCollision (head, blocks[a][j][i])) {
							gameOver();
							return;
						}
					}
				}
			}*/
		}
		//Добавляем в начало массива новую голову
		currSnake.unshift(head);
		if (!checkCollision (head, food)) {
			//Если нет коллизии с едой удаляем последний элемент массива(хвост)
			currSnake.pop();
		} else {
			//Если змейка кушает еду, то генерируем новую и увеличиваем скорость игры
			createFood();
			if (delay >= 50) {
				speed += 2;
				setDelay();
				score++;
				if (score > highScore) {
					highScore = score;
				}
			}
			interval();
		}
	}
	//Рисуем змейку
	function drawSnake() {
		//Меняем цвет змейки от головы до хвоста
		var color = 0;
		for (var i = 0; i < currSnake.length; i++) {
			var cell = currSnake[i];
			if (color < 255) {
				color += 5;
			}
			ctx.fillStyle = 'rgba(30,' + color + ',255,1)';
			ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
			ctx.strokeStyle = 'white';
			ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
		}
	}

	//Food
	//Генерируем еду
	function createFood() {
		var rndX = Math.floor(Math.random() * grid);
		var rndY = Math.floor(Math.random() * grid);
		food = {
			x: rndX, 
			y: rndY
		};
		//Если еда появляется в теле змейки генерироруем новую еду
		for (var i = 0; i < currSnake.length; i++) {
			if (checkCollision (food, currSnake[i])) {
				createFood();
			}
		}
		//Если еда появляется в теле преграды генерируем новую еду
		if (withBlocks) {
			var blocksLength = blocks.length;
			for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var i = 0; i < blockLength; i++) {
					if (checkCollision (food, blocks[a][i])) {
						createFood();
					}
				}
			}
		}
		//SquareBlocks
		/*if (withBlocks) {
			var blocksLength = blocks.length;
			for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var j = 0; j < blockLength; j++) {
					for (var i = 0; i < blockLength; i++) {
						if (checkCollision (food, blocks[a][j][i])) {
							createFood();
						}
					}
				}
			}
		}*/
	}
	//Рисуем еду
	function drawFood() {
		ctx.fillStyle = 'rgba(255,0,0,1)';
		ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
		ctx.strokeStyle = 'white';
		ctx.strokeRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
	}
	//Blocks
	//Конструктор для квадратных преград
	/*function SquareBlock(x, y, size) {
		var block = [];
		for (var j = 0; j < size; j++) {
			block[j] = [];
			for (var i = 0; i < size; i++) {
				block[j][i] = {
					x: x + i,
					y: y + j
				};
			}
		}
		return block;
	}*/

	//Конструктор горизональных преград
	function Xblock(x, y, length) {
		var block = [];
		for (var i = 0; i < length; i++) {
			block[i] = {
				x: x + i,
				y: y
			};
		}
		return block;
	}
	//Конструктор вертикальных преград
	function Yblock(x, y, length) {
		var block = [];
		for (var i = 0; i < length; i++) {
			block[i] = {
				x: x,
				y: y + i
			};
		}
		return block;
	}
	//Создаём преграды
	var blocks = [],
			//SquareBlocks
			//blockSize = 2,
			xBlockLength = 3,
			yBlockLength = xBlockLength;
	function createBlocks() {
		if (withBlocks) {
			//SquareBlocks
			/*blocks.push(new SquareBlock(2, 2, blockSize));
			blocks.push(new SquareBlock(grid - 4, 2, blockSize));
			blocks.push(new SquareBlock(2, grid - 4, blockSize));
			blocks.push(new SquareBlock(grid - 4, grid - 4, blockSize));
			blocks.push(new SquareBlock((grid / 2) - 1, (grid / 2) - 1, blockSize));*/
			//Блоки буквой "Г" по бокам
			blocks.push(new Xblock(2, 2, xBlockLength));
			blocks.push(new Yblock(2, 2, yBlockLength));
			blocks.push(new Xblock(grid - 5, 2, xBlockLength));
			blocks.push(new Yblock(grid - 3, 2, yBlockLength));
			blocks.push(new Xblock(2, grid - 3, xBlockLength));
			blocks.push(new Yblock(2, grid - 5, yBlockLength));
			blocks.push(new Xblock(grid - 5, grid - 3, xBlockLength));
			blocks.push(new Yblock(grid - 3, grid - 5, yBlockLength));
			//Квадратный блок 3х3 в центре
			blocks.push(new Xblock((grid / 2) - 1.5, (grid / 2) - 1.5, xBlockLength));
			blocks.push(new Xblock((grid / 2) - 1.5, (grid / 2) - 0.5, xBlockLength));
			blocks.push(new Xblock((grid / 2) - 1.5, (grid / 2) + 0.5, xBlockLength));
		}
	}
	//Рисуем преграды
	function drawBlocks(blocks) {
		var blocksLength = blocks.length;
		for (var a = 0; a < blocksLength; a++) {
			var blockLength = blocks[a].length;
			for (var i = 0; i < blockLength; i++) {
				var cell = blocks[a][i];
				ctx.fillStyle = 'black';
				ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
				ctx.strokeStyle = 'white';
				ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
			}
			//SquareBlocks
			/*for (var j = 0; j < blockLength; j++) {
				for (var i = 0; i < blockLength; i++) {
					var cell = blocks[a][j][i];
					ctx.fillStyle = 'black';
					ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
					ctx.strokeStyle = 'white';
					ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
				}
			}*/
		}
	}
	//Drawing
	//Перерисовываем поле, чтобы стереть старый хвост
	function drawCanvas() {
		ctx.fillStyle = 'rgba(0,160,0,1)';
		ctx.fillRect(0, 0, w, h);
	}
	//Рисуем счет
	function drawScore() {
		var scoreText = "Score: " + score,
				highScoreText = "High: " + highScore;
		ctx.fillStyle = 'rgba(255,255,0,1)';
		ctx.font = "bold " + font + "px Arial";
		ctx.globalAlpha = 0.8;
		ctx.fillText(scoreText, w - font * 5, h - font / 2);
		ctx.fillText(highScoreText, w - font * 9, h - font / 2);
		ctx.globalAlpha = 1;
	}
	//Рисуем поле, змейку, блоки, еду и счет
	function draw() {
		drawCanvas();
		drawSnake();
		if (withBlocks) {
			drawBlocks(blocks);
		}
		drawFood();
		drawScore();
	}
	//Управление змейкой клавишами
	function keyBindings(e) {
		var key = e.keyCode,
				dirDelay = delay/2;
		if (key === 37 && dir !== 'right') {
			//Задержка от одновременного нажатия 2ух кнопок
			setTimeout(function (){
				dir = 'left';
			}, dirDelay);
			
		} else if (key === 38 && dir !== 'down') {
			setTimeout(function (){
				dir = 'up';
			}, dirDelay);
			
		} else if (key === 39 && dir !== 'left') {
			setTimeout(function (){
				dir = 'right';
			}, dirDelay);
			
		} else if (key === 40 && dir !== 'up') {
			setTimeout(function (){
				dir = 'down';
			}, dirDelay);
			
		}
	}
	//Проверяем столкновение
	function checkCollision (obj1, obj2) {
		if (obj1.x === obj2.x && obj1.y ===obj2.y) {
			return true;
		} else {
			return false;
		}
	}
	//Создаём интервал
	function interval() {
		if (gameLoop) {
			clearInterval(gameLoop);
		}
		gameLoop = setInterval(function () {
			nextSnake();
			draw();
		}, delay);
	}
	//Описываем, когда заканчивается игра
	/*function gameOver() {
		dir = 'right';
		speed = speed || 45;
		setDelay();
		score = 0;
		initSnake();
		createFood();
		draw();
		interval();
	}*/
	//Инициализация игры
	function init() {
		dir = 'right';
		speed = speed || 45;
		setDelay();
		score = 0;
		scale();
		initSnake();
		createBlocks();
		createFood();
		draw();
		interval();
		document.addEventListener('keydown', function (e) {
			keyBindings(e);
		});
	}
	//Методы, которые видны наружу
	return {
		//Инициализация
		init: init,
		//Установка длины змейки (по умолчанию: 8)
		snakeLength: function (value) {
			if (value) {
				init();
				snakeLength = (value < grid)? value: grid - 1;
			} else {
				return snakeLength;
			}
		},
		//Установка границ поля (по умолчанию: с границами)
		setBoundaries: function (value) {
			if (value === 'yes') {
				boundaries = true;
			} else if (value === 'no') {
				boundaries = false;
			} else {
				throw new Error('Введите "yes" или "no"');
			}
		},

		//Установка препятствий (по умолчанию: без препятствий)
		setBlocks: function (value) {
			if (value === 'yes') {
				withBlocks = true;
			} else if (value === 'no') {
				withBlocks = false;
			} else {
				throw new Error('Введите "yes" или "no"');
			}
		},
		//Установка скорости игры (по умолчанию: средняя)
		setGameSpeed: function (value) {
			if (value === 'slow') {
				speed = 25;
			} else if (value === 'medium') {
				speed = 45;
			} else if (value === 'fast') {
				speed = 70;
			} else {
				throw new Error('Скорость может быть "fast", "medium" или "slow"');
			}
		}
	}
})();