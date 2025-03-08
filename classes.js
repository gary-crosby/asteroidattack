/**
 * Contains all classes for Asteroid Alert!
 */

/**
 * Represents a weapon projectile
 * 
 *  @param {number} x - x position of the projectile
 *  @param {number} y - y position of the projectile
 *  @param {number} deltaY - [optional] number of pixels to move the projectile
 *  @param {number} r - [optional] radius in pixels of the projectile 
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
      fill(0, 255, 0); // green color for the projectile
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
      stroke(0, 255, 0);
      strokeWeight(1.5);
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
    if (this.active && fuel > 0 && this.x < (C_WIDTH - this.deltaX - this.r)) {
      this.x = this.x + this.deltaX;
      console.log("Ship X: " + this.x);
      fuel = fuel - FUEL_COST;
      if (fuel <= 0) {
        fuel = 0;
      }
      this.display();
      console.log("Ship moved right")
      console.log("Fuel: " + fuel);
    }
  }

  // Move the ship to the left
  move_left() {
    if (this.active && fuel > 0 && this.x > (0 + this.deltaX + this.r)) {
      this.x = this.x - this.deltaX;
      console.log("Ship X: " + this.x);
      fuel = fuel - FUEL_COST;
      if (fuel <= 0) {
        fuel = 0;
      }
      this.display();
      console.log("Ship moved left");
      console.log("Fuel: " + fuel);
    }
  }

  // Destroy the ship
  destroy() {
    this.active = false; // Set the ship as inactive
  }

  // Display the ship
  display() {
    if (this.active) {
      stroke(0, 255, 0);
      strokeWeight(1.5);
      fill(0, 0, 0);
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
