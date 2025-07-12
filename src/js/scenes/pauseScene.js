/**
 * PauseScene class for HTMLSSnake
 * Displays the pause menu
 */
class PauseScene extends BaseScene {
    /**
     * Create a new pause scene
     * @param {Game} game - The main game object
     */
    constructor(game) {
        super(game);
        
        this.setupMenu();
    }
    
    /**
     * Set up the pause menu elements
     */
    setupMenu() {
        this.overlay = new PIXI.Graphics();
        this.container.addChild(this.overlay);
        
        this.menuContainer = new PIXI.Container();
        this.container.addChild(this.menuContainer);
        
        this.menuPanel = new PIXI.Graphics();
        this.menuContainer.addChild(this.menuPanel);
        
        this.title = this.createText("Game Paused", 48, 0xFFFFFF);
        this.title.anchor.set(0.5, 0);
        this.menuContainer.addChild(this.title);
        
        this.buttonsContainer = new PIXI.Container();
        this.menuContainer.addChild(this.buttonsContainer);
        
        this.resumeButton = this.createButton("Resume", () => {
            console.log("Resume clicked");
            this.game.resume();
        }, 220, 60);
        this.buttonsContainer.addChild(this.resumeButton);
        
        this.restartButton = this.createButton("Restart", () => {
            console.log("Restart clicked");
            this.game.reset();
            this.game.switchScene('game');
        }, 220, 60);
        this.buttonsContainer.addChild(this.restartButton);
        
        this.quitButton = this.createButton("Quit to Menu", () => {
            console.log("Quit clicked");
            this.game.switchScene('menu');
        }, 220, 60);
        this.buttonsContainer.addChild(this.quitButton);
        
        this.keyHandler = (e) => {
            console.log("Pause scene key pressed:", e.key);
            
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                console.log("Resume from keyboard");
                this.game.resume();
            }
        };
        
        this.positionElements();
    }
    
    /**
     * Position menu elements
     */
    positionElements() {
        const appWidth = this.game.app.screen.width;
        const appHeight = this.game.app.screen.height;
        
        this.overlay.clear();
        this.overlay.beginFill(0x000000, 0.7);
        this.overlay.drawRect(0, 0, appWidth, appHeight);
        this.overlay.endFill();
        
        this.menuContainer.x = appWidth / 2;
        this.menuContainer.y = appHeight * 0.15;
        
        this.menuPanel.clear();
        this.menuPanel.beginFill(0x333333, 0.9);
        this.menuPanel.lineStyle(3, 0x7CFC00);
        
        const buttonWidth = 220;
        const panelWidth = buttonWidth + 60;
        const panelHeight = 300;
        
        this.menuPanel.drawRoundedRect(-panelWidth/2, -20, panelWidth, panelHeight, 15);
        this.menuPanel.endFill();
        
        this.title.x = 0;
        this.title.y = 10;
        
        const buttonSpacing = 20;
        const startY = this.title.y + this.title.height + 30;
        
        this.buttonsContainer.x = 0;
        this.buttonsContainer.y = 0;
        
        this.resumeButton.x = -this.resumeButton.width / 2;
        this.resumeButton.y = startY;
        
        this.restartButton.x = -this.restartButton.width / 2;
        this.restartButton.y = this.resumeButton.y + this.resumeButton.height + buttonSpacing;
        
        this.quitButton.x = -this.quitButton.width / 2;
        this.quitButton.y = this.restartButton.y + this.restartButton.height + buttonSpacing;
    }
    
    /**
     * Called when scene becomes active
     */
    onEnter() {
        console.log("Pause menu entered");
        
        // Make sure any current music continues playing - we don't want to stop it on pause
        try {
            // Store the current music state so we can restore it if needed
            if (this.game.audio && this.game.audio.currentMusic) {
                console.log("Preserving current music during pause");
                // No need to call playMusic as we want existing music to continue
            }
        } catch (error) {
            console.error("Error handling music in pause scene:", error);
        }
        
        this.positionElements();
        
        console.log("Menu container position:", this.menuContainer.x, this.menuContainer.y);
        console.log("Resume button position:", this.resumeButton.x, this.resumeButton.y);
        console.log("Menu container visible:", this.menuContainer.visible);
        console.log("Menu container alpha:", this.menuContainer.alpha);
        
        this.container.visible = true;
        this.menuContainer.visible = true;
        this.resumeButton.visible = true;
        this.restartButton.visible = true;
        this.quitButton.visible = true;
        
        window.addEventListener('keydown', this.keyHandler);
        
        this.menuContainer.alpha = 0;
        this.menuContainer.scale.set(0.8);
        
        try {
            if (typeof gsap !== 'undefined') {
                gsap.to(this.menuContainer, {
                    alpha: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out"
                });
            } else {
                this._animateMenuWithoutGSAP();
            }
        } catch (error) {
            console.error("Animation error:", error);
            this._animateMenuWithoutGSAP();
        }
    }
    
    /**
     * Fallback animation method when GSAP is not available
     * @private
     */
    _animateMenuWithoutGSAP() {
        this.menuContainer.alpha = 1;
        this.menuContainer.scale.set(1);
        console.log("Using fallback animation for pause menu");
    }
    
    /**
     * Called when scene becomes inactive
     */
    onExit() {
        window.removeEventListener('keydown', this.keyHandler);
    }
    
    /**
     * Update scene state
     * @param {number} delta - Time elapsed since last update
     */
    update(delta) {
        if (this._updateCount === undefined) {
            this._updateCount = 0;
        }
        
        if (this._updateCount < 5) {
            console.log("Updating pause scene, count:", this._updateCount);
            this._updateCount++;
        }
        
        if (this.game.input.isPausePressed()) {
            console.log("Pause pressed in pause menu");
            this.game.resume();
        }
    }
}
