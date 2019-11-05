var snackbar;
var socket;

function makesnack(msg) {
	snackbar.innerHTML = msg;
	snackbar.className = 'show';
	setTimeout(function() {
		snackbar.className = snackbar.className.replace('show', '');
	}, 3000);
}
var thickness, fillcolor, mycanvas, onlinecountdisplay;
var thicknessbar, thicknessindicator, lock, activecol, colorspot, eraser;

function setup() {
	// socket = io.connect('127.0.0.1:3000');
	socket = io.connect('https://collaborate-on-a-paint.herokuapp.com/');
	socket.on('sentpaint', setpainting);
	socket.on('usercount', setuc);
	thicknessbar = $('#size');
	thicknessindicator = $('#sizeval')[0];
	activecol = $('.col');
	eraser = $('#eraser');
	onlinecountdisplay = $('#onlinecount')[0];
	mycanvas = createCanvas(300, 400);
	mycanvas.parent($('.canvascontainer')[0]);
	background(255);
	fillcolor = color(activecol[0].jscolor.rgb);
	thickness = Number(thicknessbar.val());
	thicknessbar.change(() => {
		thickness = Number(thicknessbar.val());
		thicknessindicator.innerHTML = thickness;
	});
	activecol.click(e => {
		if (eraser.hasClass('fa-eraser')) {
			eraser.addClass('fa-paint-brush');
			eraser.removeClass('fa-eraser');
		}
		fillcolor = color(e.target.jscolor.rgb);
	});
	eraser.click(() => {
		if (eraser.hasClass('fa-eraser')) {
			eraser.addClass('fa-paint-brush');
			eraser.removeClass('fa-eraser');
			fillcolor = color(activecol[0].jscolor.rgb);
		} else {
			eraser.addClass('fa-eraser');
			eraser.removeClass('fa-paint-brush');
			fillcolor = color(255);
		}
	});
	$('.canvascontainer canvas').bind('touchmove', e => {
		e.preventDefault();
	});
	snackbar = $('#snackbar')[0];
}

function draw() {
	if (mouseIsPressed) {
		stroke(fillcolor);
		strokeWeight(thickness);

		let data = {
			mx: mouseX,
			my: mouseY,
			pmx: pmouseX,
			pmy: pmouseY,
			sw: thickness,
			fc: fillcolor.levels
		};
		socket.emit('painting', data);
		line(mouseX, mouseY, pmouseX, pmouseY);
	}
}

function setpainting(data) {
	stroke(data.fc[0], data.fc[1], data.fc[2], data.fc[3]);
	strokeWeight(data.sw);
	line(data.mx, data.my, data.pmx, data.pmy);
}

function setuc(data) {
	onlinecountdisplay.innerHTML = data.uc;
}

const updateColor = picker => {
	if (eraser.hasClass('fa-eraser')) {
		eraser.addClass('fa-paint-brush');
		eraser.removeClass('fa-eraser');
	}
	const col = picker.rgb;
	fillcolor = color(col);
};
