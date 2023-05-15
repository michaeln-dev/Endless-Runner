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
        this.load.audio('ui_accept', './assets/ui_accept.wav');
        this.load.audio('ui_cancel', './assets/ui_cancel.wav');
    }
    
    create () {
        // <------------------------------ Game management variables ----------------> //
        this.maxUIOptions = 3;
        this.currentUIOption = 0;
        this.inMenu = false;

        // <------------------------------ Text Labels ------------------------------> //
        let titleConfig = {
            fontFamily: 'Courier',
            fontSize: '68px',
            backgroundColor: '#b71e00',
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
        this.add.text(config.width/2, 50, 'RETRO RUNWAY', titleConfig).setOrigin(0.5, 0.5);


        // Add config variables for highlighted and unhighlighted UI selections
        this.highlightedConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: '#b71e00',
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
        this.creditsText = this.add.text((config.width*3)/4, 300, 'CREDITS', this.unhighlightedConfig).setOrigin(0.5, 0.5);

        let controlsConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
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
        this.add.text(config.width/2, config.height-10, '(A) AND (D) TO MOVE CURSOR - (ENTER) TO CONFIRM AND (ESC) TO CANCEL', controlsConfig).setOrigin(0.5, 0.5);

        // <--------------------------- Sound effects -------------------------------> //
        this.uiMoveSound = this.sound.add('ui_move');
        this.uiCancelSound = this.sound.add('ui_cancel');
        this.uiAcceptSound = this.sound.add('ui_accept');


        // <------------------------------ Keyboard Input ---------------------------> //
        // Define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update () {
        if (!this.inMenu) {
            this.mainUpdate();
        }
        else {
            this.inSubMenuUpdate();
        }
    }

    mainUpdate () {
        // If the player presses enter, change scene
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            // Depending on what the currently highlighted selection is, do different things
            if (this.currentUIOption == 0) {
                this.uiAcceptSound.play();
                this.scene.start('playScene');
                return;
            }
            else if (this.currentUIOption == 1) {
                this.inMenu = true;
                this.uiAcceptSound.play();
                console.log("Go to tutorial menu");
            }
            else if (this.currentUIOption == 2) {
                this.inMenu = true;
                this.uiAcceptSound.play();
                console.log("Go to credits menu");
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

    inSubMenuUpdate () {
        // If the player presses enter, change scene
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.uiCancelSound.play();
            this.inMenu = false;
        }
    }

    changeUISelection (goingRight=true) {
        if (goingRight) {
            // If player is highlighted on the middle selection
            if (this.currentUIOption == 1) {
                this.uiMoveSound.play();
                this.tutorialText.setStyle(this.unhighlightedConfig);
                this.creditsText.setStyle(this.highlightedConfig);
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
                this.creditsText.setStyle(this.unhighlightedConfig);
                this.tutorialText.setStyle(this.highlightedConfig);
                this.currentUIOption = 1;
            }
        }
    }
}