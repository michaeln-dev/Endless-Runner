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

        // initialize racecar state machine (initial state, possible states, state args[])
        this.racecarFSM = new StateMachine('move', {
            move: new HorizontalMoveState(),
            transition: new VerticalTransitionState(),
            damaged: new DamagedSpinOut()
        }, [this, this.racecar]);

        // Create a score label
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#ffffff',
            align: 'center',
        };
        this.score = this.add.text(game.config.width / 2, 16, 
            "000000000000000", scoreConfig).setOrigin(0.5, 0.5);
        
        // Add a wave manager to the current scene
        this.currentWave = 5;
        this.maxWaves = 5;

        console.log(this.currentWave);

        // Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        // TEST CREATE AN OBSTACLE WAVE
        this.obstacleWave = new ObstacleManager(this, 
            game.config.width + (game.config.width/19.5), midLane,
            this.currentWave); // Place right outside game boundaries

        // Start the first wave
        this.obstacleWave.createWave();
    }

    update () {
        if (this.currentWave == 1) {
            this.road.tilePositionX += 6;
        }
        else if (this.currentWave == 2) {
            this.road.tilePositionX += 7;
        }
        else if (this.currentWave == 3) {
            this.road.tilePositionX += 8;
        }
        else if (this.currentWave == 4) {
            this.road.tilePositionX += 9;
        }
        else if (this.currentWave == 5) {
            this.road.tilePositionX += 10;
        }

        this.racecarFSM.step();

        // Update the game objects
        this.obstacleWave.update();
    }
}