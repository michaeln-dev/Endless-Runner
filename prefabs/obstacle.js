class Obstacle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, moveSpeed=1) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        // Initialize the obstacle to be invisible
        this.isCollisionActive = false;
        this.alpha = 0;

        this.moveSpeed = moveSpeed
    }

    enableObstacle () {
        this.isCollisionActive = true;
        this.alpha = 1;
    }

    disableObstacle () {
        this.isCollisionActive = false;
        this.alpha = 0;
    }
}