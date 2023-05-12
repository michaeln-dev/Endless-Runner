class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload () {
        // Load images
        this.load.image('road', './assets/road.png');
    }
    
    create () {
        // <------------------------- Game Management Variables -------------------------> //
        // Add a wave manager to the current scene
        this.currentWave = 1;
        this.maxWaves = 5;

        // For every wave before the max wave, send a certain amount of hoards before the next wave
        //this.hoardPerWave = [7, 5, 5, 6];
        this.hoardPerWave = [1, 1, 1, 1];
        this.hoardsSent = 0;

        // Game management booleans
        this.gameEnded = false;
        this.hoardQueued = true;


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
            damaged: new DamagedSpinOut()
        }, [this, this.racecar]);


        // <--------------------------- Text labels -------------------> //
        // Create a score label
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center',
        };
        this.score = this.add.text(game.config.width / 2, 16, 
            "000000000000000", scoreConfig).setOrigin(0.5, 0.5);
        
        // Create a label for displaying text in the middle of the screen
        let centerTextConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center'
        };
        this.centerText = this.add.text(game.config.width / 2, game.config.height / 2, 
            "LETS GOOO", centerTextConfig).setOrigin(0.5, 0.5);
        
        
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


        // <--------------------------------- Begin Game -----------------------------> //
        // Send the first wave after a few seconds
        this.time.delayedCall(2500, () => {
            this.centerText.alpha = 0;
            this.obstacleWave.createWave();
            this.hoardsSent += 1;
            this.gameStarted = true;
            this.hoardQueued = false
        }, null, this);
    }

    update () {
        // Update the game objects
        this.racecarFSM.step();
        this.obstacleWave.update();

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
    }

    wave1 () {
        this.road.tilePositionX += 6;

        // If the current hoard just left the screen, wait a few moments before sending another one
        if (!this.obstacleWave.hoardStarted && !this.hoardQueued) {
            if (this.hoardsSent == this.hoardPerWave[0]) {
                // Time for next wave
                this.newWave(2, "SPEED UP");
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
                this.newWave(3, "SPEED UP");
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
                this.newWave(4, "SPEED UP");
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
                this.newWave(5, "MAX SPEED");
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
        this.time.delayedCall(500, () => {
            this.obstacleWave.createWave();
            this.hoardsSent += 1;
            this.hoardQueued = false;
        }, null, this);
    }

    newWave (newWaveNumber, newWaveText) {
        // Handle wave transition logic
        this.hoardsSent = 0;
        this.hoardQueued = true;
        this.currentWave = newWaveNumber;
        this.obstacleWave.currentWave = this.currentWave;

        // Update the center screen text
        this.centerText.text = newWaveText
        this.centerText.alpha = 1;

        // Display the center text for a few seconds then start the next wave
        this.newWaveTextTimer = this.time.delayedCall(2500, () => {
            this.centerText.alpha = 0;

            // Tiny delay before first hoard spawns
            this.newWaveDownTimeTimer = this.time.delayedCall(500, () => {
                this.obstacleWave.createWave();
                this.hoardsSent += 1;
                this.hoardQueued = false;
            }, null, this);

        }, null, this);
    }
}