/**
 * Contains all classes for Asteroid Alert!
*/


/**
 * Represents the player's display console
 * 
 * @param {number} weapon == % remnaining of weapon
 * @param {number} shield == % remaining of shield
 * @param {number} fuel == % remaining of fuel
 * @param {number} score == player's score
 */
class myConsole {
  constructor(weapon = 100, shield = 100, fuel = 100, score = 0,
    weaponCost = 0.4, shieldCost = 50, fuelCost = 0.035, asteroidScore = 1000) {
    this.weapon = weapon;
    this.weaponCost = weaponCost;
    this.shield = shield;
    this.shieldCost = shieldCost;
    this.fuel = fuel;
    this.fuelCost = fuelCost;
    this.score = score;
    this.asteroidScore = asteroidScore;
    this.active = true; // Property to track if the projectile is active
    this.display();
  }

  // Reset all console values to game start states
  reset() {
    this.weapon = 100;
    this.shield = 100;
    this.fuel = 100;
    this.score = 0;
    this.display();
  }

  // Destroy the console
  destroy() {
    this.active = false; // Set the projectile as inactive
  }

  // Asteroid hit so increase score
  asteroidDestroyed() {
    this.score += this.asteroidScore;
  }

  //Ship moved so update fuel level
  shipMoved() {
    this.fuel -= this.fuelCost; 
    if (this.fuel < 0) {
      this.fuel = 0;
    }
  }

    // Weapon fired so decrement weapon power
    weaponFired() {
      this.weapon -= this.weaponCost; 
      if (this.weapon < 0) {
        this.weapon = 0;
      }
    }

  // Collision between asteroid and ship
  collision() {
    this.shield -= this.shieldCost;
  }

  // Displays console
  display() {
    strokeWeight(0);
    textAlign(LEFT, TOP);
    textSize(20);
    // Change shield color based on status
    if (this.shield > 50) {
      fill(GREEN);
    }
    else if (this.shield <= 50 && this.shield > 0) {
      fill(YELLOW)
    }
    else {
      fill(RED);
    }
    text("Shield: " + parseInt(this.shield) + "%", 165, 5);
    // Change Weapon color based on status
    if (this.weapon > 50) {
      fill(GREEN);
    }
    else if (this.weapon <= 50 && this.weapon > 10) {
      fill(YELLOW)
    }
    else {
      fill(RED);
    }
    text("Weapon: " + parseInt(this.weapon) + "%", 350, 5);
    // Change fuel color base on status
    if (this.fuel > 50) {
      fill(GREEN);
    }
    else if (this.fuel <= 50 && this.fuel > 10) {
      fill(YELLOW)
    }
    else {
      fill(RED);
    }
    text("Fuel: " + parseInt(this.fuel) + "%", 10, 5);
    // Score is always GREEN
    fill(GREEN);
    text("Score: " + this.score, 555, 5);
  }
}


/**
 * Represents a weapon projectile
 * 
 *  @param {number} x == x position of the projectile
 *  @param {number} y == y position of the projectile
 *  @param {number} deltaY == [optional] number of pixels to move the projectile
 *  @param {number} r == [optional] radius in pixels of the projectile 
*/
class projectile {
  constructor(x, y, deltaY = 15, r = 3) {
    this.x = x;
    this.y = y;
    this.r = r; // Radius of the projectile
    this.deltaY = deltaY; // Number of pixels to move the projectile
    this.active = true; // Property to track if the projectile is active
    this.display();
  }

  // Move the projectile
  move() {
    if (this.active) {
      this.y -= this.deltaY; // Move the projectile up by step value
    }
    this.display();
  }

  // Destroy the projectile
  destroy() {
    this.active = false; // Set the projectile as inactive
  }

  // Display the projectile
  display() {
    if (this.active) {
      fill(GREEN);
      ellipseMode(CENTER);
      ellipse(this.x, this.y, this.r * 2, this.r * 2); // Draw the projectile
    }
  }
}


/**
 * Represents an asteroid
 * 
 * @param {number} x - x position of the asteroid
 * @param {number} y - y position of the asteroid
 * @param {number} r radius in pixels of the asteroid    
 * @param {number} deltaY - number of pixels to move the asteroid
 * @param {number} n - number of sides of the asteroid
 * */
class Asteroid {
  constructor(x, y, r, deltaY, n) {
    this.x = x;
    this.r = r;
    this.y = y;
    this.deltaY = deltaY;
    this.n = n;
    this.active = true; // Property to track if the asteroid is active
    this.display();
  }

  // Move the asteroid
  move() {
    if (this.active) {
      this.y += this.deltaY; // Move the asteroid down by step value
      if (this.y > height + this.r) {
        this.destroy(); // Destroy the asteroid if it goes off the screen 
      }
      this.display();
    }
  }

  // Destroy the asteroid
  destroy() {
    this.active = false; // Set the asteroid as inactive
  }

  // Display the asteroid
  display() {
    if (this.active) {
      // Draw the asteroid  
      stroke(WHITE);
      strokeWeight(1);
      fill(0, 0, 0);
      let angle = TWO_PI / this.n;
      beginShape();
      for (let a = 0; a < TWO_PI; a += angle) {
        let sx = this.x + cos(a) * this.r;
        let sy = this.y + sin(a) * this.r;
        vertex(sx, sy);
      }
      endShape(CLOSE);
    }
  }
}


/**
 * Represents the ship
 * 
 * @param {number} x - x position of the ship
 * @param {number} y - y position of the ship
 */
class Ship {
  constructor(x, y) {
    this.x = x; // x position of the ship
    this.y = y; // y position of the ship
    this.deltaX = 5; // Number of pixels to move the ship in X direction
    this.r = 19; // Radius of the ship in pixels
    this.active = true; // Property to track if the ship is active
    this.display();
  }

  // Move the ship to the right
  move_right() {
    if (this.active && this.x < (C_WIDTH - this.deltaX - this.r)) {
      this.x = this.x + this.deltaX;
      this.display();
    }
  }

  // Move the ship to the left
  move_left() {
    if (this.active && this.x > (0 + this.deltaX + this.r)) {
      this.x = this.x - this.deltaX;
      this.display();
    }
  }

  // Destroy the ship
  destroy() {
    this.active = false; // Set the ship as inactive
  }

  // Display the ship
  display() {
    if (this.active) {
      stroke(GREEN);
      strokeWeight(1);
      fill(BLACK);
      beginShape();
      // Start at the shape at ship's nose and then draw clockwise
      vertex(this.x, this.y - 19); // nose of ship
      vertex(this.x + 5, this.y - 15);
      vertex(this.x + 7, this.y - 9);
      vertex(this.x + 16, this.y);
      vertex(this.x + 19, this.y + 14); // lower right of wing
      vertex(this.x + 10, this.y + 14);
      vertex(this.x + 12, this.y + 19);
      vertex(this.x + 4, this.y + 19);
      vertex(this.x + 6, this.y + 14);
      vertex(this.x - 6, this.y + 14);
      vertex(this.x - 4, this.y + 19);
      vertex(this.x - 12, this.y + 19);
      vertex(this.x - 10, this.y + 14);
      vertex(this.x - 19, this.y + 14); // lower left of wing
      vertex(this.x - 16, this.y);
      vertex(this.x - 7, this.y - 9);
      vertex(this.x - 5, this.y - 15); // top of ship - left
      endShape(CLOSE);
    }
  }
}
