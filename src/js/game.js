/**
 * Main Game class for HTMLSSnake
 * Manages the game loop, scenes, and overall game state
 */
class Game {
    constructor() {
        try {
            this.app = new PIXI.Application({
                width: GRID_WIDTH * GRID_SIZE,
                height: GRID_HEIGHT * GRID_SIZE,
                backgroundColor: COLORS.GRID_BG_1,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true
            });
            
            document.getElementById('game-container').appendChild(this.app.view);
            
            this.currentScene = null;
            this.scenes = {};
            this.isPaused = false;
            this.score = 0;
            this.level = 1;
            
            // Initialize input handler first
            this.input = new InputHandler();
            
            // Initialize audio with error handling first
            try {
                console.log("Initializing audio manager");
                this.audio = new AudioManager();
            } catch (audioError) {
                console.error("Failed to initialize audio:", audioError);
                // Create a dummy audio manager that does nothing
                this.audio = this._createDummyAudioManager();
            }
            
            // Create scenes after audio to ensure audio is ready
            this.createScenes();
            
            this.resize();
        } catch (error) {
            console.error("Critical error during game initialization:", error);
            this._showErrorMessage("Failed to initialize game. Please refresh the page.");
        }
    }
    
    /**
     * Create a dummy audio manager to prevent crashes if audio fails
     * @private
     */
    _createDummyAudioManager() {
        console.log("Using dummy audio manager as fallback");
        return {
            sounds: {},
            music: {},
            soundEnabled: false,
            musicEnabled: false,
            audioLoadFailed: true,
            playSound: () => {},
            playMusic: () => {},
            stopMusic: () => {},
            toggleSound: () => {},
            toggleMusic: () => {},
            setSoundVolume: () => {},
            setMusicVolume: () => {}
        };
    }
    
    /**
     * Show an error message to the user
     * @private
     */
    _showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        errorDiv.style.color = '#FF0000';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '10px';
        errorDiv.style.fontFamily = 'Arial, sans-serif';
        errorDiv.style.fontSize = '18px';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.zIndex = '1000';
        errorDiv.innerHTML = message;
        
        document.body.appendChild(errorDiv);
    }
    
    /**
     * Create game scenes
     */
    createScenes() {
        this.scenes = {
            menu: new MenuScene(this),
            game: new GameScene(this),
            pause: new PauseScene(this),
            gameOver: new GameOverScene(this)
        };
        
        for (const sceneName in this.scenes) {
            const scene = this.scenes[sceneName];
            this.app.stage.addChild(scene.container);
            scene.container.visible = false;
        }
        
        this.switchScene('menu');
    }
    
    /**
     * Start the game loop
     */
    start() {
        this.app.ticker.add(this.update, this);
    }
    
    /**
     * Update the game state
     * @param {number} delta - The time elapsed since the last update
     */
    update(delta) {
        if (this.isPaused && this.currentScene !== this.scenes.pause) {
            return;
        }
        
        if (this.currentScene) {
            this.currentScene.update(delta);
        }
        
        this.input.update();
    }
    
    /**
     * Switch to a different scene
     * @param {string} sceneName - The name of the scene to switch to
     */
    switchScene(sceneName) {
        if (this.currentScene) {
            this.currentScene.container.visible = false;
            this.currentScene.onExit();
        }
        
        this.currentScene = this.scenes[sceneName];
        this.currentScene.container.visible = true;
        this.currentScene.onEnter();
    }
    
    /**
     * Pause the game
     */
    pause() {
        if (!this.isPaused) {
            this.isPaused = true;
            this.switchScene('pause');
        }
    }
    
    /**
     * Resume the game
     */
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.switchScene('game');
        }
    }
    
    /**
     * Reset the game state
     */
    reset() {
        this.score = 0;
        this.level = 1;
        this.isPaused = false;
        
        this.scenes.game.reset();
    }
    
    /**
     * Handle game over
     */
    gameOver() {
        this.switchScene('gameOver');
    }
    
    /**
     * Handle window resize
     */
    resize() {
        const parent = document.getElementById('game-container');
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        
        const gameRatio = (GRID_WIDTH * GRID_SIZE) / (GRID_HEIGHT * GRID_SIZE);
        const containerRatio = width / height;
        
        let scale;
        if (containerRatio > gameRatio) {
            scale = height / (GRID_HEIGHT * GRID_SIZE);
        } else {
            scale = width / (GRID_WIDTH * GRID_SIZE);
        }
        
        this.app.stage.scale.set(scale);
        
        this.app.renderer.resize(
            GRID_WIDTH * GRID_SIZE * scale,
            GRID_HEIGHT * GRID_SIZE * scale
        );
        
        this.app.view.style.position = 'absolute';
        this.app.view.style.left = '50%';
        this.app.view.style.top = '50%';
        this.app.view.style.transform = 'translate(-50%, -50%)';
    }
}
