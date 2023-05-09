class Racecar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        // Initialize the racecar position to be in the middle lane
        this.x = 100;
        this.y = midLane;

        // Number which stores the current lane of the car: 0 = top, 1 = middle, 2 = bottom
        this.currentLane = 1;
    }

    update () {
    }

    reset () {
    }
}