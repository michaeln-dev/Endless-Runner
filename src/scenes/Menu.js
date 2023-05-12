class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload () {
        // load images
        this.load.image('racecar', './assets/racecar.png');
        this.load.image('dummycar', './assets/dummy_car.png');
    }
    
    create () {
        // Automatically load into the next scene
        this.scene.start('playScene');
        console.log("Opened");
    }

    update () {
    }
}