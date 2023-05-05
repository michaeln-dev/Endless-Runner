let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 720,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)