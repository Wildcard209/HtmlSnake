/**
 * GameOverScene class for HTMLSSnake
 * Displays the game over screen
 */
class GameOverScene extends BaseScene {
    /**
     * Create a new game over scene
     * @param {Game} game - The main game object
     */
    constructor(game) {
        super(game);
        
        this.setupGameOver();
    }
    
    /**
     * Set up the game over elements
     */
    setupGameOver() {
        this.overlay = new PIXI.Graphics();
        this.container.addChild(this.overlay);
        
        this.gameOverContainer = new PIXI.Container();
        this.container.addChild(this.gameOverContainer);
        
        this.title = this.createText("Game Over", 64, 0xFF0000);
        this.title.anchor.set(0.5, 0);
        this.gameOverContainer.addChild(this.title);
        
        this.scoreText = this.createText("Score: 0", 36, 0xFFFFFF);
        this.scoreText.anchor.set(0.5, 0);
        this.gameOverContainer.addChild(this.scoreText);
        
        this.playAgainButton = this.createButton("Play Again", () => {
            this.game.reset();
            this.game.switchScene('game');
        }, 220, 60);
        this.gameOverContainer.addChild(this.playAgainButton);
        
        this.menuButton = this.createButton("Main Menu", () => {
            this.game.switchScene('menu');
        }, 220, 60);
        this.gameOverContainer.addChild(this.menuButton);
        
        this.positionElements();
    }
    
    /**
     * Position game over elements
     */
    positionElements() {
        const appWidth = this.game.app.screen.width;
        const appHeight = this.game.app.screen.height;
        
        this.overlay.clear();
        this.overlay.beginFill(0x000000, 0.8);
        this.overlay.drawRect(0, 0, appWidth, appHeight);
        this.overlay.endFill();
        
        this.gameOverContainer.x = appWidth / 2;
        this.gameOverContainer.y = appHeight * 0.15;
        
        this.title.x = 0;
        this.title.y = 0;
        
        this.scoreText.x = 0;
        this.scoreText.y = this.title.y + this.title.height + 30;
        
        const buttonSpacing = 20;
        const startY = this.scoreText.y + this.scoreText.height + 50;
        
        this.playAgainButton.x = -this.playAgainButton.width / 2;
        this.playAgainButton.y = startY;
        
        this.menuButton.x = -this.menuButton.width / 2;
        this.menuButton.y = this.playAgainButton.y + this.playAgainButton.height + buttonSpacing;
    }
    
    /**
     * Called when scene becomes active
     */
    onEnter() {
        this.scoreText.text = `Score: ${this.game.score}`;

        this.gameOverContainer.alpha = 0;
        this.gameOverContainer.y = this.game.app.screen.height * 0.1;
        
        gsap.to(this.gameOverContainer, {
            alpha: 1,
            y: this.game.app.screen.height * 0.15,
            duration: 0.5,
            ease: "power2.out"
        });
        
        this.createDeathAnimation();
    }
    
    /**
     * Create a visual death animation
     */
    createDeathAnimation() {
        const particles = new PIXI.Container();
        this.container.addChild(particles);
        
        particles.x = this.game.app.screen.width / 2;
        particles.y = this.game.app.screen.height / 2;
        
        const particleCount = 20;
        const particleGraphics = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(0x32CD32);
            particle.drawRect(-3, -3, 6, 6);
            particle.endFill();
            
            particle.x = (Math.random() - 0.5) * 20;
            particle.y = (Math.random() - 0.5) * 20;
            
            particles.addChild(particle);
            particleGraphics.push(particle);

            gsap.to(particle, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                alpha: 0,
                duration: 1 + Math.random(),
                ease: "power2.out"
            });
        }
        
        setTimeout(() => {
            this.container.removeChild(particles);
        }, 2000);
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
        // No ongoing updates needed
    }
}
