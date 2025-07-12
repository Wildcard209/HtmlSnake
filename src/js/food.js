/**
 * Food class for HTMLSSnake
 * Handles food generation and display
 */
class Food {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.active = false;
        
        this.graphics = new PIXI.Container();
        
        this.appleGraphic = new PIXI.Graphics();
        this.graphics.addChild(this.appleGraphic);
    }
    
    /**
     * Spawn food at a random position that doesn't overlap with snake or walls
     * @param {Snake} snake - The snake object for collision detection
     * @param {Array} walls - Array of wall positions
     */
    spawn(snake, walls) {
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!validPosition && attempts < maxAttempts) {
            const x = Math.floor(Math.random() * GRID_WIDTH);
            const y = Math.floor(Math.random() * GRID_HEIGHT);
            
            const overlapsSnake = snake.isAt(x, y);
            
            const overlapsWalls = walls.some(wall => wall.x === x && wall.y === y);
            
            if (!overlapsSnake && !overlapsWalls) {
                this.position.x = x;
                this.position.y = y;
                this.active = true;
                validPosition = true;
                
                this.updateGraphics();
            }
            
            attempts++;
        }
        
        if (!validPosition) {
            console.warn("Could not find valid food position after", maxAttempts, "attempts");
            this.position.x = Math.floor(Math.random() * GRID_WIDTH);
            this.position.y = Math.floor(Math.random() * GRID_HEIGHT);
            this.active = true;
            
            this.updateGraphics();
        }
    }
    
    /**
     * Check if food is at given position
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @returns {boolean} - True if food is at the position
     */
    isAt(x, y) {
        return this.active && this.position.x === x && this.position.y === y;
    }
    
    /**
     * Deactivate food (when eaten)
     */
    deactivate() {
        this.active = false;
        this.updateGraphics();
    }
    
    /**
     * Update the food's graphics
     */
    updateGraphics() {
        this.appleGraphic.clear();
        
        if (!this.active) return;
        
        this.graphics.x = this.position.x * GRID_SIZE;
        this.graphics.y = this.position.y * GRID_SIZE;
        
        this.appleGraphic.beginFill(COLORS.FOOD);
        this.appleGraphic.drawRect(0, 0, GRID_SIZE, GRID_SIZE);
        this.appleGraphic.endFill();
        
        this.appleGraphic.beginFill(0x654321);
        this.appleGraphic.drawRect(GRID_SIZE / 2 - 1, 0, 2, GRID_SIZE / 4);
        this.appleGraphic.endFill();
        
        this.appleGraphic.beginFill(0xFF6347);
        this.appleGraphic.drawRect(GRID_SIZE / 4, GRID_SIZE / 4, GRID_SIZE / 6, GRID_SIZE / 6);
        this.appleGraphic.endFill();
    }
}
