/**
 * GameScene class for HTMLSSnake
 * Handles the main gameplay
 */
class GameScene extends BaseScene {
    /**
     * Create a new game scene
     * @param {Game} game - The main game object
     */
    constructor(game) {
        super(game);
        
        this.createGameObjects();
        
        this.setupInput();
        
        this.setupUI();
    }
    
    /**
     * Create game objects
     */
    createGameObjects() {
        this.gameContainer = new PIXI.Container();
        this.container.addChild(this.gameContainer);
        
        this.gridGraphics = new PIXI.Graphics();
        this.gameContainer.addChild(this.gridGraphics);
        
        this.level = new Level(0);
        this.gameContainer.addChild(this.level.graphics);
        
        this.snake = new Snake(Math.floor(GRID_WIDTH / 2), Math.floor(GRID_HEIGHT / 2));
        this.gameContainer.addChild(this.snake.graphics);
        
        this.food = new Food();
        this.gameContainer.addChild(this.food.graphics);
        
        this.gameSpeed = this.level.getSpeed();
        this.timeSinceLastUpdate = 0;
        this.score = 0;
        this.isGameOver = false;
    }
    
    /**
     * Set up input handlers
     */
    setupInput() {
        this.keyHandler = (e) => {
            console.log("Game scene key pressed:", e.key);
            
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.snake.setDirection(DIRECTIONS.UP);
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.snake.setDirection(DIRECTIONS.DOWN);
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.snake.setDirection(DIRECTIONS.LEFT);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.snake.setDirection(DIRECTIONS.RIGHT);
            }
            
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                this.game.pause();
            }
        };
    }
    
    /**
     * Set up UI elements
     */
    setupUI() {
        this.uiContainer = new PIXI.Container();
        this.container.addChild(this.uiContainer);
        
        this.scoreText = this.createText("Score: 0", 24, 0xFFFFFF);
        this.scoreText.x = 10;
        this.scoreText.y = 10;
        this.uiContainer.addChild(this.scoreText);
        
        this.levelText = this.createText("Level: 1", 24, 0xFFFFFF);
        this.levelText.x = 10;
        this.levelText.y = 40;
        this.uiContainer.addChild(this.levelText);
        
        this.progressBarContainer = new PIXI.Container();
        this.uiContainer.addChild(this.progressBarContainer);
        
        this.progressBarBg = new PIXI.Graphics();
        this.progressBarBg.beginFill(0x333333);
        this.progressBarBg.drawRect(0, 0, 200, 15);
        this.progressBarBg.endFill();
        this.progressBarContainer.addChild(this.progressBarBg);
        
        this.progressBar = new PIXI.Graphics();
        this.progressBar.beginFill(0x7CFC00);
        this.progressBar.drawRect(0, 0, 0, 15);
        this.progressBar.endFill();
        this.progressBarContainer.addChild(this.progressBar);
        
        this.progressBarContainer.x = this.game.app.screen.width - 210;
        this.progressBarContainer.y = 10;
        
        this.pauseButton = new PIXI.Graphics();
        this.pauseButton.beginFill(0x000000, 0.5);
        this.pauseButton.drawRoundedRect(0, 0, 40, 40, 5);
        this.pauseButton.endFill();
        
        for (let i = 0; i < 3; i++) {
            const line = new PIXI.Graphics();
            line.beginFill(0xFFFFFF);
            line.drawRect(8, 10 + i * 10, 24, 3);
            line.endFill();
            this.pauseButton.addChild(line);
        }
        
        this.pauseButton.x = this.game.app.screen.width - 50;
        this.pauseButton.y = 10;
        this.pauseButton.interactive = true;
        this.pauseButton.buttonMode = true;
        this.pauseButton.on('pointerdown', () => {
            this.game.pause();
        });
        
        this.uiContainer.addChild(this.pauseButton);
    }
    
    /**
     * Draw the grid
     */
    drawGrid() {
        this.gridGraphics.clear();
        
        for (let x = 0; x < GRID_WIDTH; x++) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                const color = (x + y) % 2 === 0 ? COLORS.GRID_BG_1 : COLORS.GRID_BG_2;
                
                this.gridGraphics.beginFill(color);
                this.gridGraphics.drawRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                this.gridGraphics.endFill();
            }
        }
    }
    
    /**
     * Spawn food in a valid location
     */
    spawnFood() {
        this.food.spawn(this.snake, this.level.getWalls());
    }
    
    /**
     * Update the score
     * @param {number} points - Points to add
     */
    updateScore(points) {
        this.score += points;
        this.scoreText.text = `Score: ${this.score}`;
        
        const requiredScore = this.level.getRequiredScore();
        const progress = Math.min(this.score / requiredScore, 1);
        this.progressBar.clear();
        this.progressBar.beginFill(0x7CFC00);
        this.progressBar.drawRect(0, 0, 200 * progress, 15);
        this.progressBar.endFill();
        
        if (this.level.canAdvanceLevel(this.score)) {
            this.advanceLevel();
        }
    }
    
    /**
     * Advance to the next level
     */
    advanceLevel() {
        try {
            this.game.audio.playSound('levelUp');
            
            this.level.advanceLevel();
            
            this.levelText.text = `Level: ${this.level.getLevelNumber()}`;
            
            this.gameSpeed = this.level.getSpeed();
            
            this.progressBar.clear();
            this.progressBar.beginFill(0x7CFC00);
            this.progressBar.drawRect(0, 0, 0, 15);
            this.progressBar.endFill();
            
            const levelUpText = this.createText(`Level ${this.level.getLevelNumber()}!`, 48, 0xFFFF00);
            levelUpText.anchor.set(0.5);
            levelUpText.x = this.game.app.screen.width / 2;
            levelUpText.y = this.game.app.screen.height / 2;
            levelUpText.alpha = 0;
            this.container.addChild(levelUpText);
            
            try {
                if (typeof gsap !== 'undefined') {
                    gsap.to(levelUpText, {
                        alpha: 1,
                        duration: 0.5,
                        yoyo: true,
                        repeat: 1,
                        onComplete: () => {
                            this.container.removeChild(levelUpText);
                        }
                    });
                } else {
                    this._animateLevelUpWithoutGSAP(levelUpText);
                }
            } catch (error) {
                console.error("Error animating level up:", error);
                this._animateLevelUpWithoutGSAP(levelUpText);
            }
        } catch (error) {
            console.error("Error advancing level:", error);
        }
    }
    
    /**
     * Fallback animation for level up text without GSAP
     * @param {PIXI.Text} levelUpText - The text object to animate
     * @private
     */
    _animateLevelUpWithoutGSAP(levelUpText) {
        console.log("Using fallback animation for level up");
        
        levelUpText.alpha = 1;
        
        setTimeout(() => {
            if (levelUpText.parent) {
                this.container.removeChild(levelUpText);
            }
        }, 2000);
    }
    
    /**
     * Handle game over
     */
    handleGameOver() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            
            this.game.audio.playSound('gameOver');
            
            this.game.score = this.score;
            
            setTimeout(() => {
                this.game.gameOver();
            }, 1000);
        }
    }
    
    /**
     * Reset the game
     */
    reset() {
        this.score = 0;
        this.isGameOver = false;
        
        this.level.reset();
        this.snake.reset(Math.floor(GRID_WIDTH / 2), Math.floor(GRID_HEIGHT / 2));
        this.spawnFood();
        
        this.scoreText.text = "Score: 0";
        this.levelText.text = "Level: 1";
        this.progressBar.clear();
        this.progressBar.beginFill(0x7CFC00);
        this.progressBar.drawRect(0, 0, 0, 15);
        this.progressBar.endFill();
        
        this.gameSpeed = this.level.getSpeed();
        this.timeSinceLastUpdate = 0;
    }
    
    /**
     * Called when scene becomes active
     */
    onEnter() {
        console.log("Game scene entered");
        
        this.reset();
        
        this.drawGrid();
        
        this.spawnFood();
        
        try {
            console.log("Attempting to play game music");
            // Use a short timeout to give audio system time to initialize if needed
            setTimeout(() => {
                try {
                    this.game.audio.playMusic('game');
                } catch (error) {
                    console.error("Error playing delayed game music:", error);
                }
            }, 100);
        } catch (error) {
            console.error("Error setting up game music:", error);
        }
        
        window.addEventListener('keydown', this.keyHandler);
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
        if (this.isGameOver) {
            return;
        }
        
        if (this._updateCount === undefined) {
            this._updateCount = 0;
        }
        
        if (this._updateCount < 10) {
            console.log("Game scene update:", this._updateCount);
            console.log("Input states - Up:", this.game.input.isUpPressed(), 
                        "Down:", this.game.input.isDownPressed(),
                        "Left:", this.game.input.isLeftPressed(),
                        "Right:", this.game.input.isRightPressed());
            this._updateCount++;
        }
        
        const keyHandlerWorking = this.game.input.isUpPressed() || 
                                  this.game.input.isDownPressed() || 
                                  this.game.input.isLeftPressed() || 
                                  this.game.input.isRightPressed();
        
        if (!keyHandlerWorking) {
            console.log("Using direct key handler as backup");
            if (this.game && this.game.input && this.game.input.keysHeld) {
                if (this.game.input.keysHeld['ArrowUp'] || 
                    this.game.input.keysHeld['w'] || 
                    this.game.input.keysHeld['W']) {
                    console.log("Direct UP detected");
                    this.snake.setDirection(DIRECTIONS.UP);
                }
                else if (this.game.input.keysHeld['ArrowDown'] || 
                         this.game.input.keysHeld['s'] || 
                         this.game.input.keysHeld['S']) {
                    console.log("Direct DOWN detected");
                    this.snake.setDirection(DIRECTIONS.DOWN);
                }
                else if (this.game.input.keysHeld['ArrowLeft'] || 
                         this.game.input.keysHeld['a'] || 
                         this.game.input.keysHeld['A']) {
                    console.log("Direct LEFT detected");
                    this.snake.setDirection(DIRECTIONS.LEFT);
                }
                else if (this.game.input.keysHeld['ArrowRight'] || 
                         this.game.input.keysHeld['d'] || 
                         this.game.input.keysHeld['D']) {
                    console.log("Direct RIGHT detected");
                    this.snake.setDirection(DIRECTIONS.RIGHT);
                }
            }
        } else {
            if (this.game.input.isUpPressed()) {
                console.log("UP pressed in game");
                this.snake.setDirection(DIRECTIONS.UP);
            } else if (this.game.input.isDownPressed()) {
                console.log("DOWN pressed in game");
                this.snake.setDirection(DIRECTIONS.DOWN);
            } else if (this.game.input.isLeftPressed()) {
                console.log("LEFT pressed in game");
                this.snake.setDirection(DIRECTIONS.LEFT);
            } else if (this.game.input.isRightPressed()) {
                console.log("RIGHT pressed in game");
                this.snake.setDirection(DIRECTIONS.RIGHT);
            }
        }
        
        if (this.game.input.isPausePressed()) {
            console.log("PAUSE pressed in game");
            this.game.pause();
            return;
        }
        
        this.timeSinceLastUpdate += delta;
        
        if (this.timeSinceLastUpdate >= this.gameSpeed / 60) {
            this.timeSinceLastUpdate = 0;
            
            this.snake.update();
            
            if (this.snake.isHeadAt(this.food.position.x, this.food.position.y)) {
                this.snake.grow();
                
                this.game.audio.playSound('eat');
                
                this.game.audio.playSound('grow');
                
                this.spawnFood();
                
                this.updateScore(1);
            }
            
            if (this.snake.hasCollidedWithSelf()) {
                this.handleGameOver();
                return;
            }
            
            if (this.snake.hasCollidedWithWall(this.level.getWalls())) {
                this.handleGameOver();
                return;
            }
        }
    }
}
