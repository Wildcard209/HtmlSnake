/**
 * Level class for HTMLSSnake
 * Manages level data, progression, and walls
 */
class Level {
    /**
     * Create a new Level manager
     * @param {number} levelIndex - Starting level index (default: 0)
     */
    constructor(levelIndex = 0) {
        this.currentLevelIndex = levelIndex;
        this.levelData = LEVELS[levelIndex];
        this.walls = [...this.levelData.walls];
        this.requiredScore = this.levelData.requiredScore;
        this.speed = this.levelData.speed;
        
        this.graphics = new PIXI.Container();
        
        this.updateGraphics();
    }
    
    /**
     * Get current level index
     * @returns {number} - The current level index
     */
    getLevelIndex() {
        return this.currentLevelIndex;
    }
    
    /**
     * Get current level number (1-based)
     * @returns {number} - The current level number
     */
    getLevelNumber() {
        return this.currentLevelIndex + 1;
    }
    
    /**
     * Get current level data
     * @returns {Object} - The current level data
     */
    getLevelData() {
        return this.levelData;
    }
    
    /**
     * Get walls for current level
     * @returns {Array} - Array of wall positions
     */
    getWalls() {
        return this.walls;
    }
    
    /**
     * Get required score to advance to next level
     * @returns {number} - Required score
     */
    getRequiredScore() {
        return this.requiredScore;
    }
    
    /**
     * Get game speed for current level
     * @returns {number} - Game speed in milliseconds
     */
    getSpeed() {
        return this.speed;
    }
    
    /**
     * Check if player can advance to next level
     * @param {number} score - Current player score
     * @returns {boolean} - True if player can advance
     */
    canAdvanceLevel(score) {
        return score >= this.requiredScore && this.hasNextLevel();
    }
    
    /**
     * Check if there's another level after the current one
     * @returns {boolean} - True if there's another level
     */
    hasNextLevel() {
        return this.currentLevelIndex < LEVELS.length - 1;
    }
    
    /**
     * Advance to next level
     * @returns {boolean} - True if successfully advanced
     */
    advanceLevel() {
        if (this.hasNextLevel()) {
            this.currentLevelIndex++;
            this.levelData = LEVELS[this.currentLevelIndex];
            this.walls = [...this.levelData.walls];
            this.requiredScore = this.levelData.requiredScore;
            this.speed = this.levelData.speed;
            
            this.updateGraphics();
            
            return true;
        }
        return false;
    }
    
    /**
     * Reset to first level
     */
    reset() {
        this.currentLevelIndex = 0;
        this.levelData = LEVELS[0];
        this.walls = [...this.levelData.walls];
        this.requiredScore = this.levelData.requiredScore;
        this.speed = this.levelData.speed;
        
        this.updateGraphics();
    }
    
    /**
     * Update wall graphics
     */
    updateGraphics() {
        this.graphics.removeChildren();

        this.walls.forEach(wall => {
            const wallGraphic = new PIXI.Graphics();
            
            wallGraphic.beginFill(COLORS.WALL);
            wallGraphic.drawRect(0, 0, GRID_SIZE, GRID_SIZE);
            wallGraphic.endFill();
            
            wallGraphic.beginFill(0x000000, 0.2);
            wallGraphic.drawRect(2, 2, GRID_SIZE - 4, GRID_SIZE - 4);
            wallGraphic.endFill();
            
            wallGraphic.x = wall.x * GRID_SIZE;
            wallGraphic.y = wall.y * GRID_SIZE;
            
            this.graphics.addChild(wallGraphic);
        });
    }
    
    /**
     * Draw the grid pattern
     * @param {PIXI.Graphics} graphics - The graphics object to draw on
     */
    drawGrid(graphics) {
        graphics.clear();
        
        for (let x = 0; x < GRID_WIDTH; x++) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                const color = (x + y) % 2 === 0 ? COLORS.GRID_BG_1 : COLORS.GRID_BG_2;
                
                graphics.beginFill(color);
                graphics.drawRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                graphics.endFill();
            }
        }
    }
}
