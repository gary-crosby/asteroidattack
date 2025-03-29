/**
 * Contains all functions for Asteroid Alert!
 */


/**
 * Reset canvas background
 */
function resetBackground() {
  background(BLACK); // Reset background color
}


/**
 * Reset values for Globals to start/restart game play.
 */
function resetVariables() {
  // Set to initial states
  weaponFrame = 0; // frame count last time weapon was fired
  musicPlaying = false; // false to stop or true to play
  gameState = STATE_INTRO; // values: STATE_INTRO, STATE_PLAY,STATE_GAMEOVERR, STATE_CREDITS
  introLevel = 0; // INTRO gameState: 0, 1, 2
  playLevel = 0; //PLAY gameState level: 0 ... 
  winSndPlayed = false;
  PLAY_LEVELS[0][3] = 0;
  PLAY_LEVELS[1][3] = 0;
  PLAY_LEVELS[2][3] = 0;
  // Remove all elements from arrays for projectiles and asteroids
  if (projectiles.length > 0) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      projectiles[i].destroy();
      projectiles.splice(i, 1);
    }
  }
  if (asteroids.length > 0) {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      asteroids[i].destroy();
      asteroids.splice(i, 1);
    }
  }
}


/**
 * Handle key presses on INTRO, GAME OVER and WIN states
 * 
 * @param {*} key from system event
 * @returns {false}
 */
function keyPressed(key) {

  // Enter key pressed in Intro state
  if (gameState === STATE_INTRO) {
    // Detect ENTER to advance to next INTRO screen
    if (introLevel < 2 && (keyCode === 13)) {
      introLevel += 1
    }
    // Detect ENTER to advance to PLAY level
    else if (introLevel === 2 && (keyCode === 13)) {
      gameState = STATE_PLAY;
    }
  }
  // Enter key pressed in Gameover or Win state
  else if (gameState === STATE_GAMEOVER || gameState === STATE_WIN) {
    // Detect ENTER to play again
    if (keyCode === 13) {
      resetVariables();
      myDisplay.reset();
      gameState = STATE_PLAY;
    }
  }
  return false; // Prevent default browser behavior for keypress
}


/**
 * Create and control asteroids
 * 
 * @param {boolean} [doCreate=false]
 */
function controlAsteroids(createNew = false) {

  // Create and display a NEW asteroid
  if (createNew == true) {
    // Randomize x, r, y, number of points
    // Apply slight variance to speed
    let r = getRandomInt(10, 30);
    let x = getRandomInt(0 + r, C_WIDTH - r);
    let y = 30 + r;
    let n = getRandomInt(7, 15);
    let deltaY = PLAY_LEVELS[playLevel][1] * (getRandomInt(8, 12) / 10);
    // Instantiate a new asteroid
    let newAsteroid = new Asteroid(x, y, r, deltaY, n);
    asteroids.push(newAsteroid);
    // Increment number of asteroids created in this PLAY_LEVEL
    PLAY_LEVELS[playLevel][3] += 1
  }

  // Update position of EXISTING asteroids only
  else {
    // Determine if asteroid has reached bottom of screen
    let removeAsteroids = [];
    // Loop through all asteroids
    for (let i = 0; i < Number(asteroids.length); i++) {
      // Asteroid has NOT reached the bottom of the screen
      if (asteroids[i].y < (C_HEIGHT + asteroids[i].r)) {
        asteroids[i].move();
      }
      // Asteroid has reached the bottom of the screen
      else {
        removeAsteroids.push(i);
      }
    }
    // Remove destroyed asteroids from array
    for (let i = removeAsteroids.length - 1; i >= 0; i--) {
      let indexToRemove = removeAsteroids[i];
      asteroids[indexToRemove].destroy();
      asteroids.splice(indexToRemove, 1);
    }

    // // Check for collision of asteroids with the ship
    removeAsteroids = [];
    // Loop through all asteroids
    for (let i = 0; i < Number(asteroids.length); i++) {
      // 
      if (dist(asteroids[i].x, asteroids[i].y, myShip.x, myShip.y) > (myShip.r + asteroids[i].r)) {
        asteroids[i].move();
      }
      // Asteroid has collided with ship
      else {
        removeAsteroids.push(i);
        myDisplay.asteroidDestroyed();
        myDisplay.collision();
        if (myDisplay.shield >= 0) {
          shieldSnd.play();
        }
        if (myDisplay.shield < 0) {
          myDisplay.shield = 0;
          shipDestroySnd.play()
          gameState = STATE_GAMEOVER;
        }
      }
    }
    // Remove destroyed asteroids from array
    for (let i = removeAsteroids.length - 1; i >= 0; i--) {
      let indexToRemove = removeAsteroids[i];
      asteroids[indexToRemove].destroy();
      astDestroySnd.play();
      asteroids.splice(indexToRemove, 1);
    }
  }
}


/**
 * Create and control weapon projectiles
 * 
 * @param {boolean} [createNew = false] // if true create a new projectile
 */
function controlProjectiles(createNew = false) {

  // Create a NEW projectile
  if (createNew) {
    // instantiate a new projectile
    let newProjectile = new projectile(myShip.x, (myShip.y - 21));
    projectiles.push(newProjectile);
    // Update the last firing frame number and weapons status
    weaponFrame = frameN;
    myDisplay.weaponFired();
  }

  // Update and display EXISTING projectiles only
  else {
    // Create arrays to hold lists of projectiles and asteroids to remove
    let projectilesToRemove = [];
    const asteroidsToRemove = [];

    // Check for out of bounds projectiles
    for (let p = 0; p < projectiles.length; p++) {
      // Projectile has reached the top boundary or is above the top boundary
      if ((projectiles[p].y) <= (40 + projectiles[p].r)) {
        // Add projectile to the removals list
        projectilesToRemove.push(p);
      }
      // Projectile is BELOW the top boundary
      else {
        projectiles[p].move();
      }
      // Destroy all out of bounds projectiles and then remove them from removals list
      // Iterate array in REVERSE
      for (let n = projectilesToRemove.length - 1; n >= 0; n--) {
        let indexToRemove = projectilesToRemove[n];
        projectiles[indexToRemove].destroy();
        projectiles.splice(indexToRemove, 1);
      }
      // clear list of projectiles to remove
      projectilesToRemove = [];

      // Check for collision between projectile and ALL asteroids
      for (let p = 0; p < projectiles.length; p++) {
        for (let a = 0; a < asteroids.length; a++) {
          if (dist(projectiles[p].x, projectiles[p].y, asteroids[a].x, asteroids[a].y) <= (projectiles[p].r + asteroids[a].r)) {
            // Add projectile to removals list
            // If projectile is already on removals list then DO NOT add it again.
            if (projectilesToRemove.includes(p) == false) {
              projectilesToRemove.push(p);
              // Add asteroid to removals list
              asteroidsToRemove.push(a);
              myDisplay.asteroidDestroyed();
            }
          }
        }
      }
    }
    // Destroy projectiles and then remove them from removals list
    // Iterate array in REVERSE
    for (let n = projectilesToRemove.length - 1; n >= 0; n--) {
      let indexToRemove = projectilesToRemove[n];
      projectiles[indexToRemove].destroy();
      projectiles.splice(indexToRemove, 1);
    }
    // clear list of projectiles to remove
    projectilesToRemove = [];

    // Remove destroyed asteroids from array
    for (let n = asteroidsToRemove.length - 1; n >= 0; n--) {
      let indexToRemove = asteroidsToRemove[n];
      asteroids[indexToRemove].destroy();
      astDestroySnd.play();
      asteroids.splice(indexToRemove, 1);
      console.log("ASTEROID DELETED FROM ARRAY!");
    }
  }
}


/**
 * Play/Stop music
 * 
 * IMPORTANT: INCOMPLETE
 * 
 * @param {Boolean} state 
 */
function doMusic(state) {
  // Play music
  if (state == true) {
    console.log("Start music");
    // CODE TO PLAY MUSIC
  }

  // Stop music
  else {
    console.log("Stop music");
    // CODE TO STOP MUSIC
  }
  musicPlaying = state;
}


/**
 * Generate a random integer between min and max
 * 
 * @param {number} min  
 * @param {number} max 
 * 
 * @param returns {number}
 */
function getRandomInt(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
}
