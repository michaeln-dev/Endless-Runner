class ObstacleManager extends Phaser.GameObjects.Container {
    constructor(scene, x, y, currentWave=1) {
        super(scene, x, y);
        scene.add.existing(this);

        this.moveSpeed = 6;

        // The obstacle container's obstacle children
        this.lane1Obstacle = new Obstacle(scene, this.x, this.y - roadLaneSize, 'dummycar', 0, this.moveSpeed);
        this.lane2Obstacle = new Obstacle(scene, this.x, this.y, 'dummycar', 0, this.moveSpeed);
        this.lane3Obstacle = new Obstacle(scene, this.x, this.y + roadLaneSize, 'dummycar', 0, this.moveSpeed);

        // Positional variables
        this.startX = this.x;
        this.startY = this.y;
        this.endX = -(game.config.width/19.5); // 40 px
        this.endY = this.y;

        this.currentWave = currentWave;
        this.hoardStarted = false;
    }

    update () {
        // Move the container along with the children so that the container can trigger 
        if (this.hoardStarted) {
            this.x -= this.moveSpeed;
            this.lane1Obstacle.x -= this.moveSpeed;;
            this.lane2Obstacle.x -= this.moveSpeed;;
            this.lane3Obstacle.x -= this.moveSpeed;;

            if (this.x <= this.endX) {
                this.hoardStarted = false;
                this.resetWave();
            }
        }
    }

    createWave () {
        // Implementation of barrier hoards:
        // 1.) ObstacleManager is a container object which will store the obstacles as its children
        // 2.) Depending on the wave, randomly decide which lanes will have an obstacle on it
        // 3.) Pass the createObstacle function an array of what lanes have obstacles. Ex: [1, 0, 1]
        // 4.) Enable the obstacles notated by the given array
        // 5.) Enable the wave started flag so that the wave can actually move
        // 6.) Move the ObstacleManager container in tandem with the obstacle children
        // 7.) Once the children reach the left end of the screen, reset the positions and stop hoard

        // Find the probability
        if (this.currentWave == 2) {
            // 20% chance of two obstacles, 80% chance of one
            if (Phaser.Math.Between(1, 10) <= 2) {
                this.createObstacles(this.getDoubleLaneArray());
            }
            else {
                this.createObstacles(this.getSingleLaneArray());
            }
        }
        else if (this.currentWave == 3) {
            // 2% chance of three obstacles, 40% chance of two, %58 chance of one
            let probability = Phaser.Math.Between(1, 100);
            if (probability <= 2) {
                this.createObstacles(this.getTripleLaneArray());
            }
            else if (probability <= 42) {
                this.createObstacles(this.getDoubleLaneArray());
            }
            else {
                this.createObstacles(this.getSingleLaneArray());
            }
        }
        else if (this.currentWave == 4) {
            // 15% chance of three obstacles, 60% chance of two, %25 chance of one
            let probability = Phaser.Math.Between(1, 100)
            if (probability <= 15) {
                this.createObstacles(this.getTripleLaneArray());
            }
            else if (probability <= 75) {
                this.createObstacles(this.getDoubleLaneArray());
            }
            else {
                this.createObstacles(this.getSingleLaneArray());
            }
        }
        else if (this.currentWave == 5) {
            // 25% chance of three obstacles, 70% chance of two, %5 chance of one
            let probability = Phaser.Math.Between(1, 100)
            if (probability <= 25) {
                this.createObstacles(this.getTripleLaneArray());
            }
            else if (probability <= 95) {
                this.createObstacles(this.getDoubleLaneArray());
            }
            else {
                this.createObstacles(this.getSingleLaneArray());
            }
        }
        // If it's wave 1 or in rare cases where the wave number is not valid
        else {
            // 100% chance of one obstacle
            this.createObstacles(this.getSingleLaneArray());
        }

        this.hoardStarted = true;
    }

    getSingleLaneArray () {
        let laneToSpawn = Phaser.Math.Between(1, 3);
        let laneArray = [0, 0, 0];
        laneArray[laneToSpawn-1] = 1;
        return laneArray;
    }

    getDoubleLaneArray () {
        // Im sure theres a smarter way of creating this kind of probability lol
        let laneCombination = Phaser.Math.Between(1, 3);
        let laneArray;
        if (laneCombination == 1) {
            laneArray = [1, 1, 0];
        }
        else if (laneCombination == 2) {
            laneArray = [0, 1, 1];
        }
        else {
            laneArray = [1, 0, 1];
        }
        return laneArray;
    }

    getTripleLaneArray () {
        // This function really isn't necessary, but it makes the code more readable i guess
        return [1, 1, 1];
    }

    createObstacles (laneArray) {
        // Check lane 1 status
        if (laneArray[0] == 1) {
            this.lane1Obstacle.enableObstacle();
        }
        // Check lane 2 status
        if (laneArray[1] == 1) {
            this.lane2Obstacle.enableObstacle();
        }
        // Check lane 3 status
        if (laneArray[2] == 1) {
            this.lane3Obstacle.enableObstacle();
        }
    }

    resetWave () {
        // Disable all obstacles
        this.lane1Obstacle.disableObstacle();
        this.lane2Obstacle.disableObstacle();
        this.lane3Obstacle.disableObstacle();

        // Reset all positions
        this.x = this.startX;
        this.lane1Obstacle.x = this.startX;
        this.lane2Obstacle.x = this.startX;
        this.lane3Obstacle.x = this.startX;
    }
}