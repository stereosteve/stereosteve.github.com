// The amount of symbol we want to place;
var count = 100;
var isWebkit = 'webkitRequestAnimationFrame' in window;

var colours = ["feff98", "79e3a7", "e8b2ea",
               "84b299", "ffffff", "e7e7e7", "c9c9c9"];

function randColor() {
  var hex = '#' + colours[Math.floor(colours.length * Math.random())]
  var c = new Color(hex)
  // c.alpha = Math.random() * 5
  return c
}


for (var i = 0; i < count; i++) {
  var center = Point.random() * view.size;

  var size = (i + 1) / count * 30

  path = new Path.Rectangle({
    point: center,
    size: size,
    fillColor: randColor(),
  });

  // drop shadow on webkit only
  // if (isWebkit) {
  //   path.shadowColor = new Color(255,255,255,0.9)
  //   path.shadowBlur = 60
  // }

  path.data.vector = new Point({
    angle: Math.random() * 360,
    length : (i / count) * Math.random() / 5
  });
  path.data.rotate = (Math.random() - .5) * 5
  path.data.size = size
}


var vector = new Point({
  angle: 45,
  length: 0
});

var mouseVector = vector.clone();

function onMouseMove(event) {
  mouseVector = (view.center - event.point) / 50;
}

var hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 20
};

function onMouseDown(event) {
  var hitResult = project.hitTest(event.point, hitOptions);
  if (!hitResult) {
    hideDiamond()
  } else {
    showDiamond()
  }
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
  vector = vector + (mouseVector - vector) / 30;

  // Run through the active layer's children list and change
  // the position of the placed symbols:
  for (var i = 0; i < count; i++) {
    var item = project.activeLayer.children[i];
    var size = item.bounds.size;
    var length = vector.length / 10 * item.data.size / 10;
    item.position += vector.normalize(length) + item.data.vector;
    item.rotate(item.data.rotate)
    item.fillColor.hue += 1
    if ((event.count + i) % 30 == 0) {
      var rand = Math.random()
      item.fillColor.brightness = rand + .6
      item.scale(1 + (rand - .5) / 5)
    }
    keepInView(item);
  }
}

function keepInView(item) {
  var position = item.position;
  var itemBounds = item.bounds;
  var bounds = view.bounds;
  if (itemBounds.left > bounds.width) {
    position.x = -itemBounds.width;
  }

  if (position.x < -itemBounds.width) {
    position.x = bounds.width;
  }

  if (itemBounds.top > view.size.height) {
    position.y = -itemBounds.height;
  }

  if (position.y < -itemBounds.height) {
    position.y = bounds.height  + itemBounds.height / 2;
  }
}