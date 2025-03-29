/**
 * Asteroid Alert!
 * a retro-inspired video game
 * 
 * created by Gary Crosby
 * 
 * This is a simple space shooter game.
 * The game aesthetics were influenced by early of the
 * late 1970's-early 1980's that had vector-based graphics with
 * limited color palettes.
 * 
 * The game isn't perfect, it contains some sloppy/inefficient code,
 * and it could use a few gameplay embellishments but it works.
 * 
 * Credits:
 * Audio assets except success.mp3 from www.kenney.nl used under CC0 license.
 * Audio asset success.mp3 from Leszek_Szary @ pixabay.com used under CC0 license.
*/


/**
 * Initialize ALL global constants and variables
 * 
 * USE GLOBAL VARIABLES ONLY WHEN ABSOLUTELY NECESSARY!
 */

// UI colors. Note: Some colors are not used at present
const BLACK = [0, 0, 0];
const RED = [204, 143, 92];
const GREEN = [0, 255, 0];
const BLUE = [0, 154, 238];
const ORANGE = [253, 177, 48];
const YELLOW = [255, 234, 0];
const LIGHT_GREEN = [0, 128, 0];
const WHITE = [255, 255, 255];
// Canvas size
const C_WIDTH = 750; // canvas width
const C_HEIGHT = 1000; // canvas height
// Game states
const STATE_INTRO = "intro"; // Introduction gameState
const STATE_PLAY = "play"; // Play gameState
const STATE_GAMEOVER = "gameover"; // Game Over gameState
const STATE_WIN = "win"; // Win gameState
let gameState = STATE_INTRO; // values STATE_INTRO, STATE_PLAY, STATE_GAMEOVER, STATE_CREDITS
let introLevel = 0; // INTRO level 
let playLevel = 0; // PLAY level 
let score = 0; // score
// Arrays for projectiles and asteroids
const projectiles = []; // array to hold all active projectile instances
const asteroids = []; // array to hold all active asteroid instances
// Array for play level specifics
// [# ast to create, ast move interval, ast create frequency, # ast created]
const PLAY_LEVELS = [[30, 0.5, 60, 0], [45, 0.75, 50, 0], [60, 1, 40, 0]];
// Weapons 
const WEAPON_REGEN = 15; // # of frames between consecutive weapons fire
let frameN = 0; // # of frames since app start
let weaponFrame = 0; // frame count last time weapon was fired
// Sounds and music
let musicPlaying = false; // false to stop or true to play
let weaponFireSnd; // weapon sound 
let astDestroySnd; // asteroid destroyed sound
let shieldSnd; // sheild activated sound
let shipDestroySnd; // ship destroy sound
let thrusterSnd; //  thruster sound
let winSnd; // WIN sound
let winSndPlayed = false;

/**
 * Preload audio into sound instances.
 * 
 * Runs once before setup()
 */
function preload() {
  weaponFireSnd = loadSound('/assets/laserSmall_004.ogg');
  astDestroySnd = loadSound('/assets/explosionCrunch_000.ogg');
  shieldSnd = loadSound('/assets/forceField_000.ogg');
  shipDestroySnd = loadSound('/assets/explosionCrunch_002.ogg');
  thrusterSnd = loadSound('/assets/thrusterFire_004.ogg');
  winSnd = loadSound('/assets/success.mp3');
}


/**
 * Setup initial states when programs starts.
 * 
 * Runs once before draw()
 * This is where you setup the game canvas, background, etc.
 */
function setup() {
  createCanvas(C_WIDTH, C_HEIGHT);
  resetBackground();
  soundFormats('ogg');
}


/**
 * Main game loop
 * 
 * This is where the game logic is placed and where the game is drawn
 */
function draw() {

  // Count frames played
  frameN += 1;

  // Check gameState and run it
  switch (gameState) {

    // INTRO level
    case STATE_INTRO:

      // INTRO -> Splash screen 
      if (introLevel === 0) {
        if (musicPlaying === false) {
          doMusic(true); // Start music
        }
        resetBackground();
        stroke(GREEN);
        strokeWeight(0)
        fill(GREEN);
        strokeWeight(1);
        textAlign(CENTER, TOP);
        textSize(60);
        text("ASTEROID ALERT!", C_WIDTH / 2, C_HEIGHT / 5);
        strokeWeight(0);
        fill(GREEN);
        textSize(20);
        text("a retro-inspired video game", C_WIDTH / 2, C_HEIGHT / 3.9);
        fill(LIGHT_GREEN);
        text("[Press Enter to continue]", C_WIDTH / 2, C_HEIGHT / 1.1); // keypress detection in function keyPressed()
      }

      // INTRO -> Mission Plan
      else if (introLevel === 1) {
        resetBackground();
        fill(GREEN); // green text
        strokeWeight(0);
        textAlign(LEFT, CENTER);
        textSize(36);
        text("Greetings Captain", C_WIDTH / 5, C_HEIGHT / 5);
        textAlign(LEFT, TOP);
        textSize(24);
        text("You have been given command of the interplanetary cargo ship, ESV-217. The ship is carrying a load of unobtanium from Spaceport Beta 72 to Spaceport Gamma 3.\n\nBetween Beta 72 and Gamma 1 are asteroid fields. ESV-217 has an automated defense shield and a manual-activated, forward-facing plasma weapon. However, ESV-217 also has limited fuel for maneuvering, and limited individual power stores for the shield and the weapon.\n\nYour mission is to reach Gamma 3. Your pay will be based on how many asteroids you destroy.", C_WIDTH / 5, C_HEIGHT / 3.6, C_WIDTH / 1.5);
        textAlign(CENTER, TOP);
        fill(LIGHT_GREEN); // light green text
        textSize(20);
        text("[Press Enter to continue]", C_WIDTH / 2, C_HEIGHT / 1.1); // keypress detection in function keyPressed()
      }

      // INTRO -> Flight Manual
      else if (introLevel === 2) {
        resetBackground();
        fill(GREEN); // green text
        strokeWeight(0);
        textSize(36);
        textAlign(LEFT, CENTER);
        text("ESV-217 Flight Manual", C_WIDTH / 5, C_HEIGHT / 5);
        textAlign(LEFT, TOP);
        textSize(24);
        text("Launch, forward velocity, and docking (at Gamma 1) are controlled by the ship's flight computer. You must maneuver the ship laterally and fire the weapon.\n\nManeuver left: A or LEFT ARROW\n\nManeuver right: D or RIGHT ARROW\n\nFire weapon: SPACEBAR\n\n The ships's status display console will appear along the top of the screen.", C_WIDTH / 5, C_HEIGHT / 3.6, C_WIDTH / 1.5);
        textAlign(CENTER, TOP);
        fill(LIGHT_GREEN); // light green text
        textSize(20);
        text("[Press Enter to start your mission]", C_WIDTH / 2, C_HEIGHT / 1.1); // keypress detection in function keyPressed()
      }
      break;

    // PLAY level
    case STATE_PLAY:
      // Sets PLAY level state
      if (asteroids.length === 0 && projectiles.length === 0 && PLAY_LEVELS[playLevel][3] === PLAY_LEVELS[playLevel][0]) {
        playLevel += 1;
        console.log("playLevel incremented to: " + playLevel);
      }
      // Check for ALL levels completed -> WIN!
      if (playLevel === PLAY_LEVELS.length) {
        gameState = STATE_WIN;
      }
      else {

        // Clear the background and kill music
        resetBackground();
        doMusic(false);

        // If ship or status display console do not exist then create them
        if (typeof myShip === 'undefined') {
          myShip = new Ship(C_WIDTH / 2, C_HEIGHT - 30);
        }
        if (typeof myDisplay === 'undefined') {
          myDisplay = new myConsole();
        }

        // Setup player keyboard controls: <- or a, -> or d, or space bar
        //   
        //   Note:
        //   keyIsPressed() detects if a key is held down and
        //   is most suitable for controlling an object like a ship.
        //   keyPressed() detects a single key press and is most
        //   suitable for moving to the next screen, etc.
        //
        if (keyIsPressed) {
          // Move ship right using keys: -> or d or D
          if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
            if (myDisplay.fuel > 0) {
              myShip.moveRight();
              myDisplay.shipMoved();
              // Start the thruster sound if it's not playing
              if (!thrusterSnd.isPlaying()) {
                thrusterSnd.play();
              }
            }

          }
          // Move ship left using keys: <- or a or A
          else if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
            if (myDisplay.fuel > 0) {
              myShip.moveLeft();
              // Start the thruster sound if it's not playing
              if (!thrusterSnd.isPlaying()) {
                thrusterSnd.play();
              }
              myDisplay.shipMoved();
            }

          }
          // Fire weapon using key: space bar
          else if (keyCode === 32) {
            // Fire weapon only if enough time has passed since last firing
            if ( (frameN - weaponFrame) > WEAPON_REGEN && myDisplay.weapon > 0) {
              controlProjectiles(true);
              // Play the weapon sound
              weaponFireSnd.play();
            }
          }
        }
        else {
          // Stop the thruster sound if it's playing
          if (thrusterSnd.isPlaying()) {
            thrusterSnd.stop();
          }
        }
        // Update player status display and projectile position
        myDisplay.display();

        controlProjectiles(false);

        // If max number of asteroids has not been created
        // then create a new asteroid at a random time interval
        if (PLAY_LEVELS[playLevel][3] < PLAY_LEVELS[playLevel][0]) {
          let initAsteroid = getRandomInt(1, PLAY_LEVELS[playLevel][2]);
          if (initAsteroid === 1) {
            controlAsteroids(true)
          }
        }
        // Update all asteroids
        controlAsteroids(false);

        // The ship instance displays on new() and move() but must also
        // do it here in case move() was not called.
        myShip.display();
      }
      break;

    // GAME WIN!!!
    case STATE_WIN:
      if (winSndPlayed === false) {
        winSnd.play();
        winSndPlayed = true;
      }
      myShip.x = C_WIDTH / 2;
      myShip.y = C_HEIGHT - 30;
      resetBackground();
      strokeWeight(0);
      fill(GREEN);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("Mission Accomplished!", C_WIDTH / 2, C_HEIGHT / 5);
      textAlign(LEFT, TOP);
      textSize(24);
      text("You cleared the asteroid fields and delivered your cargo. Nice piloting!\n\n Your mission pay is $" + myDisplay.score, C_WIDTH / 5, C_HEIGHT / 3.6, C_WIDTH / 1.5);
      textAlign(CENTER, TOP);
      textSize(20);
      fill(LIGHT_GREEN); // light green text
      text("[Press Enter to play again]", C_WIDTH / 2, C_HEIGHT / 1.1);
      break;


    // GAME OVER :-(
    case STATE_GAMEOVER:
      myShip.x = C_WIDTH / 2;
      myShip.y = C_HEIGHT - 30;
      resetBackground();
      strokeWeight(0);
      fill(GREEN);
      textAlign(CENTER, CENTER);
      textSize(48);
      text("Game Over", C_WIDTH / 2, C_HEIGHT / 5);
      textAlign(LEFT, TOP);
      textSize(24);
      text("Sorry Captain, but the ESV-217 collided with too many asteroids which depleted the ship's shields and it was destroyed.", C_WIDTH / 5, C_HEIGHT / 3.6, C_WIDTH / 1.5);
      textAlign(CENTER, TOP);
      textSize(20);
      fill(LIGHT_GREEN);
      text("[Press Enter to play again.]", C_WIDTH / 2, C_HEIGHT / 1.1);
      break;

  }

}
