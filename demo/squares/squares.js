// The amount of symbol we want to place;
var count = 100;
var hit = false



//
// Squares
//
var squares = []

for (var i = 0; i < count; i++) {
  var center = Point.random() * view.size;
  var size = (i + 50) / count * 25

  var color = randColor();

  var path = new Path.Rectangle({
    point: center,
    size: size,
    fillColor: color.clone(),
    // strokeColor: 'white',
  });

  path.data.vector = new Point({
    angle: Math.random() * 360,
    length : (i / count) * Math.random()
  });


  path.data.rotate = (Math.random() - .5) * 5
  path.data.angle = 0
  path.data.size = size
  path.data.initialSize = size
  path.data.color = color.clone()
  path.data.random = Math.random()

  path.transformContent = false

  squares.push(path)
}



//
// Animations
//

var animations = []
var animation
var noop = function() {}

// circle
animations.push(function CircleAnimation() {
  var shape = new Path.Circle(view.center, 300)
  shape.position.y = 350

  for (var i = 0; i < count; i++) {
    var item = squares[i];
    var p = Math.random() * shape.length
    item.data.home = shape.getPointAt(p)
  }

  return noop;
})


// diamond
animations.push(function DiamondAnimation() {
  var shape = new Path.Rectangle(view.center - 200, 400).rotate(45)
  shape.position.y = 350

  for (var i = 0; i < count; i++) {
    var item = squares[i];
    var p = Math.random() * shape.length
    item.data.home = shape.getPointAt(p)
  }

  return noop;
})

// line
animations.push(function DiamondAnimation() {
  var yPos = 320
  var shape = new Path.Line(
    new Point(0, yPos),
    new Point(view.size.width, yPos)
  )

  for (var i = 0; i < count; i++) {
    var item = squares[i];
    var p = Math.random() * shape.length
    item.data.home = shape.getPointAt(p)
  }

  return noop;
})


// random
animations.push(function RandomAnimation() {
  for (var i = 0; i < count; i++) {
    var item = squares[i];
    item.data.home = Point.random() * view.size
  }

  return function(event) {
    vector = vector + (mouseVector - vector) / 30;
    for (var i = 0; i < count; i++) {
      var item = project.activeLayer.children[i];
      if (item == hit) continue
      var length = vector.length / 10 * item.data.size / 10;
      item.position += vector.normalize(length) + item.data.vector;
      keepInView(item);
    }
  }
})

// random direction snow
animations.push(function() {
  for (var i = 0; i < count; i++) {
    var item = squares[i];
    // item.data.home = Point.random() * view.size
    item.data.home = undefined
  }

  return function(event) {
    for (var i = 0; i < count; i++) {
      var item = project.activeLayer.children[i];
      if (item == hit) continue

      var v = new Point({
        angle: i * 5,
        length: item.data.size / 2,
      })
      item.position += v + item.data.vector;
      keepInView(item);
    }
  }
})


// directional snow
animations.push(function() {
  for (var i = 0; i < count; i++) {
    var item = squares[i];
    item.data.home = undefined
  }

  return function(event) {
    vector = vector;
    for (var i = 0; i < count; i++) {
      var item = project.activeLayer.children[i];
      if (item == hit) continue
      var p = mousePoint - view.center;
      p.length = item.data.size / 1.1;
      item.position += p;
      keepInView(item);
    }
  }
})



// shuffle
animations.push(function() {
  var shape = new Path.Circle(view.center, view.size)

  function shuffle() {
    for (var i = 0; i < count; i++) {
      var item = squares[i];
      if (item == hit) continue
      var p = Math.random() * shape.length
      item.data.home = shape.getPointAt(p)
    }
  }

  return function(event) {
    if (event.count % 45 == 0) shuffle()
  }
})

// snow
animations.push(function() {

  for (var i = 0; i < count; i++) {
    var item = squares[i];
    item.data.home = undefined
  }

  return function(event) {
    for (var i = 0; i < count; i++) {
      var item = squares[i];
      if (item == hit) continue
      item.position.y += item.data.size / 2;
      keepInView(item)
    }
  }
})



//
// Mouse events
//

var vector = new Point({
  angle: 45,
  length: 0
});

var mouseVector = vector.clone();
var mousePoint = view.center;

function onMouseMove(event) {
  mouseVector = (view.center - event.point) / 20 * -1;
  mousePoint = event.point;
}

var hitOptions = {
  segments: false,
  stroke: false,
  fill: true,
  tolerance: 20
};

function onMouseDown(event) {
  if (window.HALT) return;
  var hitResult = project.hitTest(event.point, hitOptions);
  removeOldHit()
  if (hitResult) newHit(hitResult.item)
}


var lastHit = new Date()
function newHit(item) {
  removeOldHit()
  hit = item
  hit.scaling = 1
  hit.fillColor.brightness = 1
  lastHit = new Date()
}

function removeOldHit() {
  if (!hit) return;
  scaleItem(hit, hit.data.initialSize / hit.data.size)
  hit.position = hit.data.home
  hit = false
}

function randomHit() {
  if (window.HALT) return;
  // hideDiamond()
  var item = rando(squares)
  newHit(item)
}


var timer = setInterval(function() {
  var now = new Date()
  var diff = now - lastHit
  if (diff > 6000) {
    // hideDiamond()
  }
  if (diff > 8000) {
    randomHit()
  }
}, 1000)





//
// Hit animation
//
function hitAnimation(event) {
  if (!hit) return;
  if (hit.data.size < 250) {
    scaleItem(hit, 1.12)
  }


  var rDiff = 45 - hit.rotation
  rDiff = rDiff / 10
  hit.rotate(rDiff)


  var xDiff = (view.center.x - hit.position.x - 10) / 10
  hit.position.x += xDiff;

  var yDiff = (330 - window.scrollY - hit.position.y) / 12
  hit.position.y += yDiff;

  if (Math.abs(xDiff) < 1) {
    // removeOldHit()
  }
}



//
// onFrame!
//

function onFrame(event) {


  if (event.count % 240 == 0) {
    animation = rando(animations)()
    // animation = animations[animations.length - 1]()
  }

  animation(event)
  hitAnimation(event)

  for (var i = 0; i < count; i++) {
    var item = squares[i];
    if (!item) continue
    if (item == hit) continue

    if (item.data.home) {
      var vec = item.data.home - item.position
      var length = vec.length / 10 * item.data.size / 100;
      item.position += vec.normalize(length)
    }

    // mouse nearby?
    var mouseDist = mousePoint - item.position;
    if (mouseDist.length < 20) {
      // item.strokeWidth = 5
      item.lightness += 20
      if (item.scaling.length < 3) item.scaling += .04
    } else {
      // item.strokeWidth = 0
      item.lightness -= 20
      if (item.scaling.x > 1) {
        item.scaling -= .02
      } else {
        item.scaling = 1
      }
    }

    item.rotate(item.data.rotate)
    item.fillColor.hue += 5 * item.data.random

    var period = 240
    item.fillColor.alpha = .6 + Math.sin((event.count % period) / (period / Math.PI)) / 2

    if ((event.count + i) % count == 0) {
      item.fillColor = randColor()
    }

  }
}



//
// Item fns
//

function keepInView(item) {
  var position = item.position;
  var itemBounds = item.bounds;
  var bounds = view.bounds;
  if (itemBounds.left > bounds.width) {
    position.x = -itemBounds.width;
    item.data.home = undefined
  }
  if (position.x < -itemBounds.width) {
    position.x = bounds.width;
    item.data.home = undefined
  }
  if (itemBounds.top > view.size.height) {
    position.y = -itemBounds.height;
    item.data.home = undefined
  }
  if (position.y < -itemBounds.height) {
    position.y = bounds.height  + itemBounds.height / 2;
    item.data.home = undefined
  }

}


function scaleItem(item, a) {
  item.data.size *= a
  item.scale(a)
}


function randColor() {
  var colours = ["#feff98", "#79e3a7", "#e8b2ea", "#84b299", "#ffffff", "#e7e7e7", "#c9c9c9"];
  var colours = ['#F8F087', '#B7E3C0', '#B8D0DD', '#DBBAE5', '#F39DD4'];
  var hex = colours[Math.floor(colours.length * Math.random())]
  var c = new Color(hex)
  c.alpha = .5 + Math.random()
  return c
}


function rando(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}