// Globals for internal use only (not displayed to user)
let particles = [];
let gIndex = 0;

// datGUI user controls
// NOTE: Switching p5 to instance mode would get rid of this wrapper function
var controls = new function() {
  this.particleCount = 100;
  this.fr = 60;
  this.profile = 'zero-grav'
  this.randomize = randomize
  this.earthify = function() { updateGravityProfile('earth') }
  this.marsify = function() { updateGravityProfile('mars') }
  this.explode = function() {
    let numParticlesAdded = explodeAll(num=10, force=15)
    this.particleCount += numParticlesAdded
  }
  this.pause = pauseUnpause
  this.reset = reset
}

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.mousePressed(clickEvent)
  frameRate(controls.fr);
  injectParticles(floor(controls.particleCount))
  renderGui()
}

function draw() {
  background(0);
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i]
    p.update();
    p.draw();
  }
}

function renderGui() {
  let gui = new dat.GUI();
  gui.add(controls, 'particleCount', 0, 1000).name('particle count').listen()
    .onChange(function(value) {
      let desiredValue = floor(value)
      let currentValue = floor(particles.length)
      if (desiredValue > currentValue) { injectParticles(desiredValue - currentValue) }
      if (desiredValue < currentValue) { removeParticles(currentValue - desiredValue) }
    })
  gui.add(controls, 'fr', 0, 60).name('frame rate')
    .onChange(function(value) {
      frameRate(floor(value))
    })
  gui.add(controls, 'profile', ['zero-grav', 'zero-grav-dynamic', 'earth', 'moon', 'mars'])
    .onChange(function(value) {
      setAllProfiles(value)
    })
  gui.add(controls, 'randomize')
  gui.add(controls, 'earthify')
  gui.add(controls, 'marsify')
  gui.add(controls, 'explode')
  gui.add(controls, 'pause')
  gui.add(controls, 'reset')
}

function injectParticles(num) {
  for (var i = 0; i < num; i++) {
    var p = new Particle(random(width), random(height), 5);
    p.setProfile(controls.profile);
    particles.push(p);
  }
}

function removeParticles(num) {
  for (var i = num; i > 0; i--) {
    particles.pop()
  }
}

function clickEvent() {
  followMouse()
}

function mouseDragged() {
  followMouse(0.1)
}

function followMouse(multiplier = 1) {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i]
    let v0 = p.pos
    let v1 = createVector(mouseX, mouseY);
    let diff = v1.sub(v0)
    let norm = diff.normalize()
    p.applyForce(norm.mult(multiplier));
  }
}

function keyPressed() {
  if (key === 'r') {
    randomize()
  } else if (key === 'e') {
    updateGravityProfile('earth')
  } else if (key === 'm') {
    updateGravityProfile('mars')
  } else if (key === 'z') {
    setAllProfiles('zero-grav')
    controls.profile = 'zero-grav'
  } else if (key === 'x') {
    setAllProfiles('zero-grav-dynamic')
    controls.profile = 'zero-grav-dynamic'
  } else if (key === 'p') {
    pauseUnpause()
  } else if (key === 'c') {
    reset()
  } else if (keyCode === LEFT_ARROW) {
    applyForceToAll(createVector(-1, 0))
  } else if (keyCode === RIGHT_ARROW) {
    applyForceToAll(createVector(1, 0))
  } else if (keyCode === DOWN_ARROW) {
    applyForceToAll(createVector(0, 1))
  } else if (keyCode === UP_ARROW) {
    applyForceToAll(createVector(0, -1))
  } else if (key === 'b') {
    explodeAll(num=10, force=15)
  }
}

function reset() {
  particles = []
  injectParticles(controls.particleCount)
}

function randomize() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i]
    let theta = random(0, 360)
    let v = createVector(cos(theta), sin(theta))
    p.applyForce(v);
  }
}

function applyForceToAll(v) {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i]
    p.applyForce(v)
  }
}

function updateGravityProfile(str) {
  let particlesFound = 0;
  let targetAmount = Math.floor(particles.length / 10)
  while (particlesFound < targetAmount && gIndex < particles.length) {
    let p = particles[gIndex];
    p.setProfile(str)
    particlesFound += 1
    gIndex = (gIndex + 1) % particles.length;
  }
}

function setAllProfiles(str) {
  for (var i = 0; i < particles.length; i++) {
    let p = particles[i]
    p.setProfile(str)
  }
}

function zeroGravity() {
  for (var i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.setProfile('zero-grav')
  }
}

function zeroGravityDynamic() {
  for (var i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.setProfile('zero-grav-dynamic')
  }
}

function pauseUnpause() {
  for (var i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.pauseUnpause()
  }
}

function explodeAll(num, force) {
  let oldLength = particles.length
  for (var i = 0; i < oldLength; i++) {
    let explosion = particles[i].explode(num, force)
    particles.push(...explosion)
  }
  let numParticlesAdded = particles.length - oldLength
  return numParticlesAdded
}