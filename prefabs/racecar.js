class Racecar extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        // Initialize the racecar position to be in the middle lane
        this.x = 120;
        this.y = midLane;

        // Number which stores the current lane of the car: 0 = top, 1 = middle, 2 = bottom
        this.currentLane = 1;

        // Movement variables
        this.moveSpeed = 3;
    }

    update () {
    }

    reset () {
    }
}

// 
class HorizontalMoveState extends State {
    execute (scene, racecar) {
        // Check for state machine transitions
        // if the player moves up and they arent on the top lane
        if (Phaser.Input.Keyboard.JustDown(keyW) && racecar.currentLane != 0) {
            this.stateMachine.transition('transition', true);
            return;
        }
        // if the player moves down and they arent on the bottom lane
        if (Phaser.Input.Keyboard.JustDown(keyS) && racecar.currentLane != 2) {
            this.stateMachine.transition('transition', false);
            return;
        }

        // Handle horizontal movement movement
        if (keyA.isDown && racecar.x > racecarLeftBorder) {
            racecar.x -= racecar.moveSpeed;

            if (racecar.x < racecarLeftBorder) {
                racecar.x = racecarLeftBorder;
            }
        }
        else if (keyD.isDown && racecar.x < racecarRightBorder) {
            racecar.x += racecar.moveSpeed;

            if (racecar.x > racecarRightBorder) {
                racecar.x = racecarRightBorder;
            }
        }
    }
}

class VerticalTransitionState extends State {
    enter (scene, racecar, movingUp) {
        this.movingUp = movingUp;
    }

    execute (scene, racecar) {
        // for now, immediately send the player to the next lane
        if (this.movingUp) {
            racecar.currentLane -= 1;
            // Check for unusual instance of miscounting
            if (racecar.currentLane < 0) {
                racecar.currentLane = 0;
            }
            racecar.y -= roadLaneSize;

            this.stateMachine.transition('move');
            return;
        }
        else {
            racecar.currentLane += 1;
            // Check for unusual instance of miscounting
            if (racecar.currentLane > 2) {
                racecar.currentLane = 2;
            }
            racecar.y += roadLaneSize;

            this.stateMachine.transition('move');
            return;
        }
        console.log(this.movingUp);
    }
}

class DamagedSpinOut extends State {

}