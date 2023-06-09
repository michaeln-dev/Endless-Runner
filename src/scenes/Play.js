class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload () {
        // Load images
        this.load.image('road', './assets/road.png');
        this.load.image('empty_heart', './assets/empty_heart.png');
        this.load.image('full_heart', './assets/full_heart.png');

        // Load sprite sheet
        this.load.spritesheet('obstacle_explosion', './assets/obstacle_explosion.png', 
            {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5});

        // Load sound effects
        this.load.audio('engine_sound', './assets/engine_sound.wav');
        this.load.audio('racecar_explosion_sound', './assets/racecar_explosion.wav');
        this.load.audio('player_hit', './assets/player_hit.wav');
        this.load.audio('speed_up', './assets/speed_up.wav');
    }
    
    create () {
        // <------------------------- Game Management Variables -------------------------> //
        // Add a wave manager to the current scene
        this.currentWave = 1;
        this.maxWaves = 5;

        // For every wave before the max wave, send a certain amount of hoards before the next wave
        this.hoardPerWave = [4, 8, 15, 18];
        //this.hoardPerWave = [1, 1, 1, 1];
        this.hoardsSent = 0;
        this.hoardInterval = 500; // in ms

        // Game management booleans
        this.playerDied = false;
        this.gameEnded = false;
        this.hoardQueued = true;

        // Score
        this.score = 0;


        // <------------------------- Object Children ----------------------------------> //
        // Place the road tilesprite
        this.road = this.add.tileSprite(0, 0, 780, 360, 'road').setOrigin(0, 0);

        // Create the enemy wave manager
        this.obstacleWave = new ObstacleManager(this, 
            game.config.width + (game.config.width/19.5), midLane,
            this.currentWave); // Place right outside game boundaries

        // Create the racecar
        this.racecar = new Racecar(this, 0, 0, 'racecar');

        // initialize racecar state machine (initial state, possible states, state args[])
        this.racecarFSM = new StateMachine('move', {
            move: new HorizontalMoveState(),
            transition: new VerticalTransitionState(),
        }, [this, this.racecar]);

        // Create health capsules
        let healthUIX = config.width / 2;
        let healthUIY = config.height / 1.06
        this.leftHealth = this.add.sprite(healthUIX-64, healthUIY, 'full_heart').setOrigin(0.5, 0.5);
        this.middleHealth = this.add.sprite(healthUIX, healthUIY, 'full_heart').setOrigin(0.5, 0.5);
        this.rightHealth = this.add.sprite(healthUIX+64, healthUIY, 'full_heart').setOrigin(0.5, 0.5);


        // <---------------------------- Animations -------------------> //
        // animation config
        this.anims.create ({
            key: 'obstacle_explode',
            frames: this.anims.generateFrameNumbers('obstacle_explosion', { start:0, end:5, first:0 }),
            frameRate: 30
        });

        // <-------------------------- Audio -------------------------> //
        this.hitSound = this.sound.add('player_hit');
        this.speedUpSound = this.sound.add('speed_up');
        this.endPopupSound = this.sound.add('ui_move');
        this.uiAcceptSound = this.sound.add('ui_accept');
        this.uiCancelSound = this.sound.add('ui_cancel');


        // <--------------------------- Text labels -------------------> //
        // Create a score label
        let scoreConfig = {
            fontFamily: 'Source Sans Pro',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center',
        };
        this.scoreText = this.add.text(game.config.width / 2, 16, 
            "000000000000000", scoreConfig).setOrigin(0.5, 0.5);
        
        // Create a label for displaying text in the middle of the screen
        let centerTextConfig = {
            fontFamily: 'Source Sans Pro',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center'
        };
        this.centerText = this.add.text(game.config.width / 2, game.config.height / 2, 
            "BEGIN", centerTextConfig).setOrigin(0.5, 0.5);
        
        
        // <------------------------------ Timers -----------------------------------> //
        // Display text that a new wave has started for a few seconds
        this.newWaveTextTimer;

        // After displaying new text, wait a few seconds before starting the new wave
        this.newWaveDownTimeTimer;


        // <------------------------------ Keyboard Input ---------------------------> //
        // Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        // <--------------------------------- Begin Game -----------------------------> //
        // Send the first wave after a few seconds
        this.time.delayedCall(2000, () => {
            this.centerText.alpha = 0;
            this.gameStarted = true;

            this.newHoard(this.hoardInterval);
        }, null, this);
    }

    update () {
        // Using this implementation cuz to allow for a death cutscene to work
        if (!this.playerDied) {
            this.gameplayUpdate();
        }
        else if (this.gameEnded) {
            this.endUpdate();
        }
    }

    gameplayUpdate () {
        //console.log(this.racecar.currentHealth);

        // Update the game objects
        this.racecarFSM.step();
        this.obstacleWave.update();

        // Check for object collision
        // Player - obstacle collision
        if(this.obstacleWave.lane1Obstacle.isCollisionActive && this.checkCollision(this.racecar, this.obstacleWave.lane1Obstacle)) {
            this.obstacleWave.lane1Obstacle.disableObstacle();
            let healthBefore = this.racecar.currentHealth;
            if (this.racecar.takeDamage(1, this)) {
                // Remove player from the scene
                this.playerExplodeCutscene();
            }
            let healthAfter = this.racecar.currentHealth;
            if (healthBefore != healthAfter) {
                this.hitSound.play();
                this.decreaseHealthContainer();
            }
        }
        if(this.obstacleWave.lane2Obstacle.isCollisionActive && this.checkCollision(this.racecar, this.obstacleWave.lane2Obstacle)) {
            this.obstacleWave.lane2Obstacle.disableObstacle();
            let healthBefore = this.racecar.currentHealth;
            if (this.racecar.takeDamage(1, this)) {
                // Remove player from the scene
                this.playerExplodeCutscene();
            }
            let healthAfter = this.racecar.currentHealth;
            if (healthBefore != healthAfter) {
                this.hitSound.play();
                this.decreaseHealthContainer();
            }
        }
        if(this.obstacleWave.lane3Obstacle.isCollisionActive && this.checkCollision(this.racecar, this.obstacleWave.lane3Obstacle)) {
            this.obstacleWave.lane3Obstacle.disableObstacle();
            let healthBefore = this.racecar.currentHealth;
            if (this.racecar.takeDamage(1, this)) {
                // Remove player from the scene
                this.playerExplodeCutscene();
            }
            let healthAfter = this.racecar.currentHealth;
            if (healthBefore != healthAfter) {
                this.hitSound.play();
                this.decreaseHealthContainer();
            }
        }

        // Run different logic functions depending on what wave it currently is
        if (this.currentWave == 5) {
            this.wave5();
        }
        else if (this.currentWave == 4) {
            this.wave4();
        }
        else if (this.currentWave == 3) {
            this.wave3();
        }
        else if (this.currentWave == 2) {
            this.wave2();
        }
        else {
            this.wave1();
        }

        // Update player score
        this.score += 1;
        this.scoreText.text = this.score.toString().padStart(7, '0');
    }

    endUpdate () {
        // Check if player wants to do something else
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.game.sound.stopAll();
            this.uiCancelSound.play();
            this.scene.start('menuScene');
            return;
        }
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            this.uiAcceptSound.play();
            this.scene.restart();
            return;
        }
    }

    wave1 () {
        this.road.tilePositionX += 6;

        // If the current hoard just left the screen, wait a few moments before sending another one
        if (!this.obstacleWave.hoardStarted && !this.hoardQueued) {
            if (this.hoardsSent == this.hoardPerWave[0]) {
                // Time for next wave
                this.speedUpSound.play();
                this.newWave(2, "SPEED UP", 400);
            }
            else {
                this.newHoard();
            }
        }
    }

    wave2 () {
        this.road.tilePositionX += 7;

        // If the current hoard just left the screen, wait a few moments before sending another one
        if (!this.obstacleWave.hoardStarted && !this.hoardQueued) {
            if (this.hoardsSent == this.hoardPerWave[1]) {
                // Time for next wave
                this.speedUpSound.play();
                this.newWave(3, "SPEED UP", 300);
            }
            else {
                this.newHoard();
            }
        }
    }

    wave3 () {
        this.road.tilePositionX += 9;
        // If the current hoard just left the screen, wait a few moments before sending another one
        if (!this.obstacleWave.hoardStarted && !this.hoardQueued) {
            if (this.hoardsSent == this.hoardPerWave[2]) {
                // Time for next wave
                this.speedUpSound.play();
                this.newWave(4, "SPEED UP", 150);
            }
            else {
                this.newHoard();
            }
        }
    }

    wave4 () {
        this.road.tilePositionX += 11;
        // If the current hoard just left the screen, wait a few moments before sending another one
        if (!this.obstacleWave.hoardStarted && !this.hoardQueued) {
            if (this.hoardsSent == this.hoardPerWave[3]) {
                // Time for next wave
                this.speedUpSound.play();
                this.newWave(5, "MAX SPEED", 0);
            }
            else {
                this.newHoard();
            }
        }
    }

    wave5 () {
        this.road.tilePositionX += 13;
        // If the current hoard just left the screen, wait a few moments before sending another one
        if (!this.obstacleWave.hoardStarted && !this.hoardQueued) {
            this.newHoard();
        }
    }

    newHoard () {
        this.hoardQueued = true;

        // Create small delay before spawning in new hoard
        this.time.delayedCall(this.hoardInterval, () => {
            this.obstacleWave.createWave();
            this.hoardsSent += 1;
            this.hoardQueued = false;
        }, null, this);
    }

    newWave (newWaveNumber, newWaveText, newHoardInterval=500) {
        // Handle wave transition logic
        this.hoardsSent = 0;
        this.hoardQueued = true;
        this.hoardInterval = newHoardInterval;
        this.currentWave = newWaveNumber;
        this.obstacleWave.changeWave(this.currentWave);

        // Update the center screen text
        this.centerText.text = newWaveText
        this.centerText.alpha = 1;

        // Display the center text for a few seconds then start the next wave
        this.newWaveTextTimer = this.time.delayedCall(2500, () => {
            this.centerText.alpha = 0;

            // Tiny delay before first hoard spawns
            this.newHoard(this.hoardInterval);

        }, null, this);
    }

    checkCollision (racecar, obstacle) {
        if (racecar.x < obstacle.x + obstacle.width && racecar.x + racecar.width > obstacle.x && 
            racecar.y < obstacle.y + obstacle.height && racecar.height + racecar.y > obstacle. y) {
            let explode = this.add.sprite(obstacle.x, obstacle.y, 'obstacle_explosion').setOrigin(0.5, 0.5);
            explode.setScale(2);
            explode.anims.play('obstacle_explode');             // play explode animation
            explode.on('animationcomplete', () => {    // callback after anim completes
                explode.destroy();                       // remove explosion sprite
            });
            return true;
          } else {
            return false;
          }
    }

    decreaseHealthContainer () {
        let textureKey = this.rightHealth.texture.key;
        if (textureKey == 'full_heart') {
            this.rightHealth.setTexture('empty_heart');
            return;
        }

        textureKey = this.middleHealth.texture.key;
        if (textureKey == 'full_heart') {
            this.middleHealth.setTexture('empty_heart');
            return;
        }

        textureKey = this.leftHealth.texture.key;
        if (textureKey == 'full_heart') {
            this.leftHealth.setTexture('empty_heart');
            return;
        }
    }

    playerExplodeCutscene () {
        this.racecar.destroy();
        this.playerDied = true;

        let explode = this.add.sprite(this.racecar.x, this.racecar.y, 'obstacle_explosion').setOrigin(0.5, 0.5);
            explode.setScale(8);
            explode.anims.play('obstacle_explode');             // play explode animation
            explode.on('animationcomplete', () => {    // callback after anim completes
                explode.destroy();                       // remove explosion sprite
            });

        // Create explosion and create timer
        this.time.delayedCall(2000, () => {
            // Add game over text
            this.endPopupSound.play();
            let gameOverConfig = {
                fontFamily: "Source Sans Pro",
                fontSize: '60px',
                backgroundColor: '#b71e00',
                color: '#ffffff',
                align: 'center',
                padding: {
                    top: 5,
                    bottom: 5,
                    right: 10,
                    left: 10
                }
            };
            this.add.text(config.width/2, (config.height/2)-50, 'GAME OVER', gameOverConfig).setOrigin(0.5, 0.5);

            // Add game over text
            let gameOverOptionsConfig = {
                fontFamily: "Source Sans Pro",
                fontSize: '16px',
                backgroundColor: '#b71e00',
                color: '#ffffff',
                align: 'center',
                padding: {
                    top: 5,
                    bottom: 5,
                    right: 10,
                    left: 10
                }
            };
            this.add.text(config.width/2, (config.height/2)+25, 'ENTER: RETRY STAGE\nESCAPE: BACK TO TITLE', gameOverOptionsConfig).setOrigin(0.5, 0.5);
            this.gameEnded = true;
        }, null, this);
    }
}