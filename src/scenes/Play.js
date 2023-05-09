class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload () {
        // Load images
        this.load.image('road', './assets/road.png');
    }
    
    create () {
        // Place the road tilesprite
        this.road = this.add.tileSprite(0, 0, 780, 360, 'road').setOrigin(0, 0);

        // Create the racecar
        this.racecar = new Racecar(this, 0, 0, 'racecar');
    }

    update () {
        this.road.tilePositionX += 7;
    }
}