function Particle(x, y, r) {
  this.r = r;
  this.pos = createVector(x, y);
  this.vel = createVector(0,0);
  this.accel = createVector(0,0);
  this.bounce = 0.3;
  this.gravity = 0.02;
  this.profile = 'zero-grav';
  this.color = color(255, 255, 255);
  this.paused = false;
  this.MIN_ALPHA = 30;  // between 0 and 255
  this.translucency = false;
  this.variableSize = false;
  
  this.update = function() {
    if (this.paused) { return }
    
    this.applyForce(createVector(0, this.gravity))
    this.vel.add(this.accel);
    this.pos.add(this.vel);

    // Handle edges of the draw box
    this.handleCanvasEdges();
  }
    
  this.draw = function() {
    noStroke();
    this.applyVariableCharacteristics();
    circle(this.pos.x, this.pos.y, this.r);
  }
  
  this.applyForce = function(f) {
    this.accel.add(f);
  }
  
  this.handleCanvasEdges = function() {
    if (this.pos.y >= height) {
      this.pos.y = height
      this.vel = createVector(this.vel.x, -this.vel.y * this.bounce)
      this.accel = createVector(this.accel.x, 0)
    }
    
    if (this.pos.x >= width) {
      this.pos.x = width
      this.vel = createVector(-this.vel.x * this.bounce, this.vel.y)
      this.accel = createVector(0, this.accel.y)
    }
    
    if (this.pos.y <= 0) {
      this.pos.y = 0
      this.vel = createVector(this.vel.x, -this.vel.y * this.bounce)
      this.accel = createVector(this.accel.x, 0)
    }
    
    if (this.pos.x <= 0) {
      this.pos.x = 0
      this.vel = createVector(-this.vel.x * this.bounce, this.vel.y)
      this.accel = createVector(0, this.accel.y)
    }
  }
  
  this.pauseUnpause = function() {
    this.paused = !this.paused
  }
  
  this.isEmpty = function() {
    return Object.keys(this.memory).length === 0
  }
  
  this.setProfile = function(str) {
    if (str == 'zero-grav') {
      this.profile = str
      this.color = color(255, 255, 255);
      this.gravity = 0
      this.translucency = false
      this.variableSize = false
    } else if (str == 'zero-grav-dynamic') {
      this.profile = str
      this.color = color(255, 255, 255, 50);
      this.gravity = 0
      this.translucency = true
      this.variableSize = true
    } else if (str == 'earth') {
      this.profile = str
      this.color = color(35, 189, 255);
      this.gravity = 0.02
      this.translucency = false
      this.variableSize = false
    } else if (str == 'mars') {
      this.profile = str
      this.color = color(255, 0, 0);
      this.gravity = 0.0066
      this.translucency = false
      this.variableSize = false
    } else if (str == 'moon') {
        this.profile = str
        this.color = color(150, 150, 150);
        this.gravity = 0.00332
        this.translucency = false
        this.variableSize = false
    } else {
      throw `no profile of type ${str}`
    }
  }
    
  this.applyVariableCharacteristics = function() {
    var mag = this.vel.mag() * 10
    if (this.translucency) {
      this.color.setAlpha(max(this.MIN_ALPHA, mag))
    }
    if (this.variableSize) {
      this.r = max(5, mag/20)
    }
    fill(this.color)
  }
    
  this.explode = function(num=10, force=10) {
    let newParticles = []
    for (var i = 0; i < num; i++) {
      let p = this.clone(this)
      p.vel = createVector(random(-force, force), random(-force, force))
      newParticles.push(p)
    }
    
    return newParticles
  }
    
  this.clone = function(particle) {
    let p = new Particle(this.pos.x, this.pos.y, this.r)
    
    p.name = this.name
    p.r = this.r
    p.pos = this.pos.copy()
    p.vel = this.vel.copy()
    p.accel = this.accel.copy()
    p.bounce = this.bounce
    p.gravity = this.gravity
    p.profile = this.profile
    p.color = this.color
    p.paused = this.paused
    p.MIN_ALPHA = this.MIN_ALPHA
    p.translucency = this.translucency
    p.variableSize = this.variableSize
    
    return p
  }
}