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
        // <------------------------------ Keyboard Input ---------------------------> //
        // Define keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        console.log("flarbis");
    }

    update () {
        // If the player presses enter, change scene
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            this.scene.start('playScene');
        }
    }
}