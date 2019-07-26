var thickness, fillcolor, mycanvas;
var thicknessbar, thicknessindicator, lock, activecol, colorspots, eraser;

function setup() {
  thicknessbar = $('#size');
  thicknessindicator = $('#sizeval')[0];
  activecol = $('#selected-col');
  colorspots = $('.col');
  eraser = $('#eraser');
  mycanvas = createCanvas(300, 400);
  mycanvas.parent($('.canvascontainer')[0]);
  background(255);
  fillcolor = color($('#col-1').val());
  thickness = Number(thicknessbar.val());
  thicknessbar.change(() => {
    thickness = Number(thicknessbar.val())
    thicknessindicator.innerHTML = thickness;
  });
  colorspots.change((e) => {
    fillcolor = color(e.target.value);
    activecol.css('backgroundColor', e.target.value);
  });
  colorspots.click((e) => {
    fillcolor = color(e.target.value);
    activecol.css('backgroundColor', e.target.value);
  });
  eraser.click(() => {
    fillcolor = 255;
  });
  $('.canvascontainer canvas').bind('touchmove', (e) => {
    console.log('scrolling');
    e.preventDefault();
  })
}

function draw() {
  if(mouseIsPressed) {
    stroke(fillcolor);
    strokeWeight(thickness);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function resetpainting() {
  if(confirm('This will clear your whole painting')) {
    background(255);
  }
}