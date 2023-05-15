// Michael Nieto
// CMPM-120
// Retro Runway

// Time spent: 25 hours

// Creative Tilt:
// I think as far as technically interesting, I had a lot of learning to do with proper code structure
// and using a finite state machine to understand better about classes and how to organize code in an
// effective way.
//
// Creatively, I really liked how the pixel art assets came out, considering that I'm not really that 
// good at pixel art or art in general. I really wanted to add my own music to the game, and I have
// a song worked on for the game, but unfortunately due to time constraints, I was not able to add
// that to the game.

let config = {
    type: Phaser.CANVAS,
    width: 780,
    height: 360,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

// Reserve keyboard keys
let keyW, keyA, keyS, keyD, keyENTER, keyESC;


// Create player racecar borders
let racecarLeftBorder = game.config.width / 7.8; // leftBorder = 100 px
let racecarRightBorder = game.config.width / 1.3; // leftBorder = 600 px

// Create border sizes for the road and lanes
let edgeGrassSize = game.config.height / 6; // grassSize = 60 px
let roadLaneSize = game.config.height / 4.5; // roadLaneSize = 80 px
let topLane = edgeGrassSize + (roadLaneSize / 2)
let midLane = edgeGrassSize + roadLaneSize + (roadLaneSize / 2)
let botLane = edgeGrassSize + roadLaneSize + roadLaneSize + (roadLaneSize / 2)