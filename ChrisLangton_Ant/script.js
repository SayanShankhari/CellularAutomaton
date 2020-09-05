var button;
var canvas, context;
let buttonClickCount = 0;
let U = [], X = [];
let A = [];
let draw_flag = false;
var universe;
var intervalId;

function init() {
	button = document.getElementById ("button");
	canvas = document.getElementById ("canvas");
	context = canvas.getContext ("2d");

	canvas.width = 1000;
	canvas.height = 1000;
	canvas.style.width = "1000px";
	canvas.style.height = "1000px";

	canvas.addEventListener ("click", function (event) {handleEvent (event)}, false);

	button.addEventListener ("click", function() {
		if (buttonClickCount == 0) {
			++buttonClickCount;
			this.textContent = "Start";
			draw_flag = true;
		} else if (buttonClickCount == 1) {
			++buttonClickCount;
			this.textContent = "Stop";
			draw_flag = false;

			getUniverseMatrix();

			intervalId = setInterval (function() {
				getNextGenerationuniverse();
				putNextGenerationuniverse();
			}, 1);
		} else {
			buttonClickCount = 0;
			this.textContent = "Put Ants";
			clearInterval (intervalId);
		}
	}, false);
}

function handleEvent (event) {
	if (!draw_flag) {
		return;
	}

	if (event.type == "click") {
		currX = event.clientX - canvas.offsetLeft;
		currY = event.clientY - canvas.offsetTop;

		context.fillStyle = "red";
		context.beginPath();			
		context.fillRect (currX, currY, 1, 1);
		context.closePath();

		A.push ({"x" : currX, "y" : currY, "dx" : 0, "dy" : 1});
	}
}

function getUniverseMatrix() {
	universe = context.getImageData (0, 0, canvas.width, canvas.height);
	var index = 0;

	for (var i = 0; i < universe.height; i++) {
		U.push ([]);
		X.push ([]);

		for (var j = 0; j < universe.width; j++) {
			U [i].push ((universe.data [index] != 0) ? 1 : 0);
			X [i].push (0);
			index += 4;
		}
	}
}

function getNextGenerationuniverse() {
	var i, x, y, dx, dy;

	for (i = 0; i < A.length; i++) {
		x = A[i].x + A[i].dx;
		y = A[i].y + A[i].dy;
		dx = A[i].dx;
		dy = A[i].dy;

		if (x > 0 && x < (canvas.width - 1) && y > 0 && y < (canvas.height - 1)) {
			if (U [y][x] == 1) {
				U[y][x] = 0;
				dx = - A[i].dy;
				dy = + A[i].dx;
			} else if (U [y][x] == 0) {
				U[y][x] = 1;
				dx = + A[i].dy;
				dy = - A[i].dx;
			}

			x += dx;
			y += dy;
			A[i] = {"x" : x, "y" : y, "dx" : dx, "dy" : dy};
		} else {
			A[i] = {"x" : A[i].x, "y" : A[i].y, "dx" : -A[i].dx, "dy" : -A[i].dy};
		}

		copyUniverseToDisplay();
	}
}

function putNextGenerationuniverse() {
	var i, j;
	var index = 0;
	let col = 0;

	for (i = 0; i < universe.height; i++) {
		for (j = 0; j < universe.width; j++) {
			col = (X[i][j] == -1) ? 0 : 255;

			universe.data[index] = (X[i][j] == 0) ? 0 : 255;
			universe.data[index + 1] = (X[i][j] == 0) ? 0 : col;
			universe.data[index + 2] = (X[i][j] == 0) ? 0 : col;
			universe.data[index + 3] = (X[i][j] == 0) ? 0 : 255;

			index +=  4;
		}
	}

	context.putImageData (universe, 0, 0, 0, 0, universe.width, universe.height);
}

function copyUniverseToDisplay() {
	var i, j;

	for (i = 0; i < U.length; i++) {
		for (j = 0; j < U[i].length; j++) {
			X[i][j] = U[i][j];
		}
	}

	for (i = 0; i < A.length; i++) {
		X[A[i].y][A[i].x] = -1;
	}
}