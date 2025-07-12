/**
 * Main Game class for HTMLSSnake
 * Manages the game loop, scenes, and overall game state
 */
class Game {
    constructor() {
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
        
        this.createScenes();
        
        this.input = new InputHandler();
        
        this.audio = new AudioManager();
        
        this.resize();
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
