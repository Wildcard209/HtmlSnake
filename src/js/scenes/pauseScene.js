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
        
        this.title = this.createText("Game Paused", 48, 0xFFFFFF);
        this.title.anchor.set(0.5, 0);
        this.menuContainer.addChild(this.title);
        
        this.resumeButton = this.createButton("Resume", () => {
            this.game.resume();
        }, 220, 60);
        this.menuContainer.addChild(this.resumeButton);
        
        this.restartButton = this.createButton("Restart", () => {
            this.game.reset();
            this.game.switchScene('game');
        }, 220, 60);
        this.menuContainer.addChild(this.restartButton);
        
        this.quitButton = this.createButton("Quit to Menu", () => {
            this.game.switchScene('menu');
        }, 220, 60);
        this.menuContainer.addChild(this.quitButton);
        
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
        
        this.title.x = 0;
        this.title.y = 0;
        
        const buttonSpacing = 20;
        const startY = this.title.y + this.title.height + 50;
        
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
        this.menuContainer.alpha = 0;
        this.menuContainer.scale.set(0.8);
        
        gsap.to(this.menuContainer, {
            alpha: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out"
        });
    }
    
    /**
     * Called when scene becomes inactive
     */
    onExit() {
        // No specific actions needed
    }
    
    /**
     * Update scene state
     * @param {number} delta - Time elapsed since last update
     */
    update(delta) {
        if (this.game.input.isPausePressed()) {
            this.game.resume();
        }
    }
}
