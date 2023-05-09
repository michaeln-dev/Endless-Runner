// Time spent: 3 hours

let config = {
    type: Phaser.CANVAS,
    width: 780,
    height: 360,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

// Reserve keyboard keys
let keyW, keyA, keyS, keyD;


// Create player racecar borders
let racecarLeftBorder = 100;
let racecarRightBorder = 500;

// Create border sizes for the road and lanes
let edgeGrassSize = game.config.height / 6; // grassSize = 60 px
let roadLaneSize = game.config.height / 4.5; // roadLaneSize = 80 px
let topLane = edgeGrassSize + (roadLaneSize / 2)
let midLane = edgeGrassSize + roadLaneSize + (roadLaneSize / 2)
let botLane = edgeGrassSize + roadLaneSize + roadLaneSize + (roadLaneSize / 2)