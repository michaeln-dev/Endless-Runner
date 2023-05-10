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

        // Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update () {
        this.road.tilePositionX += 7;

        this.racecarFSM.step();
    }
}