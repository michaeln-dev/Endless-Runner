// Time spent: 18 hours

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