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
        this.transitionTime = 50; // in ms

        // Health variables
        this.totalHealth = 1;
        this.currentHealth = this.totalHealth;
        this.invulnerabilityTime = 1800;
        this.damaged = false;

        // Engine Sound Effect
        this.engineSound = scene.sound.add('engine_sound', {loop: true});
        this.engineSound.play();

        // Explosion Sound effect
        this.explosionSound = scene.sound.add('racecar_explosion_sound');
    }

    takeDamage (damageAmount, scene) {
        // Only take damage if the player's damage flag is off
        if (!this.damaged) {
            this.currentHealth -= damageAmount;
            this.damaged = true;

            this.alpha = false;
            this.startDamageFlashing(scene);

            // Allow the player to take damage again after some time
            scene.time.delayedCall(this.invulnerabilityTime, () => {
                this.damaged = false;
                this.stopDamageFlashing();
            }, null, scene);

            if (this.currentHealth <= 0) {
                this.explosionSound.play();
                this.engineSound.stop();
                return true;
            }
            return false;
        }
    }

    startDamageFlashing (scene) {
        this.flashTimer = scene.time.delayedCall(200, () => {
            this.alpha = !this.alpha;

            // Recursively keep calling this function until it's time to stop flashing the sprite
            this.startDamageFlashing(scene);
        }, null, scene);
    }

    stopDamageFlashing () {
        this.flashTimer.paused = true;
        this.alpha = true;
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

        //console.log("IN here");

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

        this.newY = 0;
        if (this.movingUp) {
            racecar.currentLane -= 1;

            // Check for unusual instance of miscounting
            if (racecar.currentLane < 0) {
                racecar.currentLane = 0;
            }

            if (racecar.currentLane == 0) {
                this.newY = topLane;
            }
            else if (racecar.currentLane == 1) {
                this.newY = midLane;
            }
        }
        else {
            racecar.currentLane += 1;

            // Check for unusual instance of miscounting
            if (racecar.currentLane > 2) {
                racecar.currentLane = 2;
            }

            if (racecar.currentLane == 1) {
                this.newY = midLane;
            }
            else if (racecar.currentLane == 2) {
                this.newY = botLane;
            }
        }
    }

    execute (scene, racecar) {
        // Code from:
        // https://labs.phaser.io/view.html?src=src/tweens/eases/linear.js

        this.moveTween = scene.tweens.add({
            targets: racecar,
            y: this.newY,
            duration: 50,
            ease: 'Cubic',
            onComplete: this.finishedTransition.bind(this, racecar),
            onCompleteParams: [racecar],
            onCompleteScope: this,
        });

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

    finishedTransition (racecar) {
        if (racecar.y == this.newY) {
            this.stateMachine.transition('move');
            return;
        }
    }
}