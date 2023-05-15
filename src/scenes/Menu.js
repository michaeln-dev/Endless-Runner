class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload () {
        // load images
        this.load.image('racecar', './assets/racecar.png');
        this.load.image('dummycar', './assets/dummy_car.png');

        // load sound effects
        this.load.audio('ui_move', './assets/menu_move.wav');
    }
    
    create () {
        // <------------------------------ Game management variables ----------------> //
        this.maxUIOptions = 3;
        this.currentUIOption = 0;

        // <------------------------------ Text Labels ------------------------------> //
        // Add config variables for highlighted and unhighlighted UI selections
        this.highlightedConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            },
            fixedWidth: 0
        };

        this.unhighlightedConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                right: 5,
                left: 5
            },
            fixedWidth: 0
        };

        // Create UI labels
        this.startText = this.add.text(config.width/4, 300, 'START', this.highlightedConfig).setOrigin(0.5, 0.5);
        this.tutorialText = this.add.text(config.width/2, 300, 'TUTORIAL', this.unhighlightedConfig).setOrigin(0.5, 0.5);
        this.optionsText = this.add.text((config.width*3)/4, 300, 'OPTIONS', this.unhighlightedConfig).setOrigin(0.5, 0.5);

        // <--------------------------- Sound effects -------------------------------> //
        this.uiMoveSound = this.sound.add('ui_move');
        // <------------------------------ Keyboard Input ---------------------------> //
        // Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        console.log("flargass");
    }

    update () {
        // If the player presses enter, change scene
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            // Depending on what the currently highlighted selection is, do different things
            if (this.currentUIOption == 0) {
                this.scene.start('playScene');
                return;
            }
            else if (this.currentUIOption == 1) {
                console.log("Go to tutorial menu");
            }
            else if (this.currentUIOption == 2) {
                console.log("Go to options menu");
            }
        }

        // if player moves to a different UI selection
        if (Phaser.Input.Keyboard.JustDown(keyA)) {
            this.changeUISelection(false);
        }
        else if (Phaser.Input.Keyboard.JustDown(keyD)) {
            this.changeUISelection(true);
        }
    }

    changeUISelection (goingRight=true) {
        if (goingRight) {
            // If player is highlighted on the middle selection
            if (this.currentUIOption == 1) {
                this.uiMoveSound.play();
                this.tutorialText.setStyle(this.unhighlightedConfig);
                this.optionsText.setStyle(this.highlightedConfig);
                this.currentUIOption = 2;
            }
            // If player is highlighted on the leftmost selection
            else if (this.currentUIOption == 0) {
                this.uiMoveSound.play();
                this.startText.setStyle(this.unhighlightedConfig);
                this.tutorialText.setStyle(this.highlightedConfig);
                this.currentUIOption = 1;
            }
        }
        else {
            // If player is highlighted on the middle selection
            if (this.currentUIOption == 1) {
                this.uiMoveSound.play();
                this.tutorialText.setStyle(this.unhighlightedConfig);
                this.startText.setStyle(this.highlightedConfig);
                this.currentUIOption = 0;
            }
            // If player is highlighted on the rightmost selection
            else if (this.currentUIOption == 2) {
                this.uiMoveSound.play();
                this.optionsText.setStyle(this.unhighlightedConfig);
                this.tutorialText.setStyle(this.highlightedConfig);
                this.currentUIOption = 1;
            }
        }
    }
}