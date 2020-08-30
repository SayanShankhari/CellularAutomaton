var button;
var canvas, context;
var flag = false, dot_flag = false;
var prevX = 0, currX = 0, prevY = 0, currY = 0;
let buttonClickCount = 0;
let U = [], X = [];
var y = 1;
let draw_flag = false;
var population;
var intervalId;

function init() {
	button = document.getElementById ("button");
	canvas = document.getElementById ("canvas");
	context = canvas.getContext ("2d");

	canvas.width = 1000;
	canvas.height = 1000;
	canvas.style.width = "1000px";
	canvas.style.height = "1000px";

	canvas.addEventListener ("mousemove", function (event) {handleEvent (event)}, false);
	canvas.addEventListener ("mousedown", function (event) {handleEvent (event)}, false);
	canvas.addEventListener ("mouseup", function (event) {handleEvent (event)}, false);
	canvas.addEventListener ("mouseout", function (event) {handleEvent (event)}, false);

	button.addEventListener ("click", function() {
		if (buttonClickCount == 0) {
			++buttonClickCount;
			this.textContent = "Start";
			draw_flag = true;
		} else if (buttonClickCount == 1) {
			++buttonClickCount;
			this.textContent = "Stop";
			draw_flag = false;

			getPopulationMatrix();

			intervalId = setInterval (function() {
				getNextGenerationPopulation();
				putNextGenerationPopulation();
			}, 100);
		} else {
			buttonClickCount = 0;
			this.textContent = "Pre-populate";
			clearInterval (intervalId);
		}
	}, false);
}

function handleEvent (event) {
	if (!draw_flag) {
		return;
	}

	if (event.type == "mousedown") {
		prevX = currX;
		prevY = currY;
		currX = event.clientX - canvas.offsetLeft;
		currY = event.clientY - canvas.offsetTop;

		flag = true;
		dot_flag = true;

		if (dot_flag) {
			context.fillStyle = "white";
			context.beginPath();			
			context.fillRect (currX, currY, 1, 1);
			context.closePath();

			dot_flag = false;
		}
	} else if (event.type == "mouseup" || event.type == "mouseout") {
		flag = false;
	} else if (event.type == "mousemove") {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = event.clientX - canvas.offsetLeft;
			currY = event.clientY - canvas.offsetTop;

			context.strokeStyle = "white";
			context.lineWidth = 1;
			context.beginPath();
			context.moveTo (prevX, prevY);
			context.lineTo (currX, currY);
			context.stroke();
			context.closePath();
		}
	}
}

function getPopulationMatrix() {
	population = context.getImageData (0, 0, canvas.width, canvas.height);
	var index = 0;

	for (var i = 0; i < population.height; i++) {
		U.push ([]);
		X.push ([]);

		for (var j = 0; j < population.width; j++) {
			U [i].push ((population.data [index] != 0) ? 1 : 0);
			X [i].push (0);
			index += 4;
		}
	}
}

function getNextGenerationPopulation() {
	var i, j, count;

	for (i = 1; i < population.height - 1; i++) {
		for (j = 1; j < population.width - 1; j++) {
			count = getAliveNeighbourCount (i, j);

			if (U [i][j] == 1 && count < 2) { // death by under-population
				X [i][j] = 0;
			} else if (U [i][j] == 1 && (count == 2) || (count == 3)) { // sustain
				X [i][j] = 1;
			} else if (U [i][j] == 1 && count > 3) { // death by over-population
				X [i][j] = 0;
			} else if (U [i][j] == 0 && count == 3) { // birth
				X [i][j] = 1;
			}
		}
	}

	U = X;
}

function putNextGenerationPopulation() {
	var i, j;
	var index = 0;

	for (i = 0; i < population.height; i++) {
		for (j = 0; j < population.width; j++) {
			population.data [index] = (U [i][j] == 0) ? 0 : 255;
			population.data [index + 1] = (U [i][j] == 0) ? 0 : 255;
			population.data [index + 2] = (U [i][j] == 0) ? 0 : 255;
			population.data [index + 3] = (U [i][j] == 0) ? 0 : 255;

			index +=  4;
		}
	}

	context.putImageData (population, 0, 0, 0, 0, population.width, population.height);
}

function getAliveNeighbourCount (r, c) {
	let count = 0;

	count += (U [r - 1][c - 1] == 0) ? 0 : 1;
	count += (U [r - 1][c] == 0) ? 0 : 1;
	count += (U [r - 1][c + 1] == 0) ? 0 : 1;
	count += (U [r][c - 1] == 0) ? 0 : 1;
	count += (U [r][c + 1] == 0) ? 0 : 1;
	count += (U [r + 1][c - 1] == 0) ? 0 : 1;
	count += (U [r + 1][c] == 0) ? 0 : 1;
	count += (U [r + 1][c + 1] == 0) ? 0 : 1;

	return count;
}