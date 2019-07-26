var snackbar;
var socket;

function makesnack(msg) {
  snackbar.innerHTML = msg;
  snackbar.className = 'show';
  setTimeout(function() {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
}
var thickness, fillcolor, mycanvas;
var thicknessbar, thicknessindicator, lock, activecol, colorspots, eraser;

function setup() {
  socket = io.connect('http://localhost:3000');
  socket.on('sentpaint', setpainting);
  socket.on('changecol', setcolor);
  socket.on('changestrk', setstroke);
  thicknessbar = $('#size');
  thicknessindicator = $('#sizeval')[0];
  activecol = $('#selected-col');
  colorspots = $('.col');
  eraser = $('#eraser');
  mycanvas = createCanvas(1000, 400);
  mycanvas.parent($('.canvascontainer')[0]);
  background(255);
  fillcolor = color($('#col-1').val());
  thickness = Number(thicknessbar.val());
  thicknessbar.change(() => {
    thickness = Number(thicknessbar.val())
    socket.emit('changestroke', {
      sw: thickness
    });
    thicknessindicator.innerHTML = thickness;
  });
  colorspots.change((e) => {
    fillcolor = color(e.target.value);
    socket.emit('changepaint', {
      fc: e.target.value
    });
    activecol.css('backgroundColor', e.target.value);
  });
  colorspots.click((e) => {
    fillcolor = color(e.target.value);
    socket.emit('changepaint', {
      fc: e.target.value
    });
    activecol.css('backgroundColor', e.target.value);
  });
  eraser.click(() => {
    fillcolor = color(255);
    socket.emit('changepaint', {
      fc: 255
    });
  });
  $('.canvascontainer canvas').bind('touchmove', (e) => {
    e.preventDefault();
  });
  snackbar = $('#snackbar')[0];
  makesnack('Firebase is Ready');
}

function draw() {
  if(mouseIsPressed) {
    stroke(fillcolor);
    strokeWeight(thickness);
    let data = {
      mx: mouseX,
      my: mouseY,
      pmx: pmouseX,
      pmy: pmouseY,
    }
    socket.emit('painting', data);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function setpainting(data) {
  stroke(fillcolor);
  strokeWeight(thickness);
  line(data.mx, data.my, data.pmx, data.pmy);
}

function setcolor(data) {
  fillcolor = color(data.fc);
  activecol.css('backgroundColor', data.fc);
}

function setstroke(data) {
  thickness = data.sw;
  thicknessbar[0].value = thickness;
  thicknessindicator.innerHTML = thickness;
}

function resetpainting() {
  if(confirm('This will clear your whole painting')) {
    background(255);
  }
}