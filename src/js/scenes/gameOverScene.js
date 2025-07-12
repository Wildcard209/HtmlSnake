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
        console.log("Game over scene entered");
        
        this.scoreText.text = `Score: ${this.game.score}`;
        
        try {
            this.game.audio.playSound('gameOver');
        } catch (error) {
            console.error("Error playing game over sound:", error);
        }

        this.gameOverContainer.alpha = 0;
        this.gameOverContainer.y = this.game.app.screen.height * 0.1;
        
        try {
            if (typeof gsap !== 'undefined') {
                gsap.to(this.gameOverContainer, {
                    alpha: 1,
                    y: this.game.app.screen.height * 0.15,
                    duration: 0.5,
                    ease: "power2.out"
                });
            } else {
                this._animateWithoutGSAP();
            }
        } catch (error) {
            console.error("Animation error:", error);
            this._animateWithoutGSAP();
        }
        
        this.createDeathAnimation();
    }
    
    /**
     * Fallback animation when GSAP is not available
     * @private
     */
    _animateWithoutGSAP() {
        this.gameOverContainer.alpha = 1;
        this.gameOverContainer.y = this.game.app.screen.height * 0.15;
    }
    
    /**
     * Create a visual death animation
     */
    createDeathAnimation() {
        this.particlesContainer = new PIXI.Container();
        this.container.addChild(this.particlesContainer);
        
        this.particlesContainer.x = this.game.app.screen.width / 2;
        this.particlesContainer.y = this.game.app.screen.height / 2;
        
        const particleCount = 20;
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(0x32CD32);
            particle.drawRect(-3, -3, 6, 6);
            particle.endFill();
            
            particle.x = (Math.random() - 0.5) * 20;
            particle.y = (Math.random() - 0.5) * 20;
            
            particle.targetX = (Math.random() - 0.5) * 200;
            particle.targetY = (Math.random() - 0.5) * 200;
            particle.speed = 1 + Math.random();
            particle.progress = 0;
            
            this.particlesContainer.addChild(particle);
            this.particles.push(particle);
        }
        
        this.animationActive = true;
        
        setTimeout(() => {
            if (this.particlesContainer && this.particlesContainer.parent) {
                this.container.removeChild(this.particlesContainer);
            }
            this.animationActive = false;
        }, 2000);
    }
    
    /**
     * Update scene state
     * @param {number} delta - Time elapsed since last update
     */
    update(delta) {
        if (this.animationActive && this.particles) {
            for (const particle of this.particles) {
                particle.progress += (delta / 60) * particle.speed * 0.5;
                
                if (particle.progress >= 1) {
                    particle.alpha = 0;
                } else {
                    particle.x = particle.x + (particle.targetX - particle.x) * 0.05;
                    particle.y = particle.y + (particle.targetY - particle.y) * 0.05;
                    
                    particle.alpha = 1 - particle.progress;
                }
            }
        }
    }
    
    /**
     * Called when scene becomes inactive
     */
    onExit() {
        this.animationActive = false;

        if (this.particlesContainer && this.particlesContainer.parent) {
            this.container.removeChild(this.particlesContainer);
        }
    }
}
