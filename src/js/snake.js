/**
 * Snake class for HTMLSSnake
 * Manages the snake's movement, growth, and collision detection
 */
class Snake {
    /**
     * Create a new Snake
     * @param {number} initialX - Initial X position of snake head
     * @param {number} initialY - Initial Y position of snake head
     */
    constructor(initialX, initialY) {
        this.segments = [
            { x: initialX, y: initialY },           // Head
            { x: initialX - 1, y: initialY },       // Body
            { x: initialX - 2, y: initialY }        // Tail
        ];
        
        this.direction = DIRECTIONS.RIGHT;
        this.nextDirection = DIRECTIONS.RIGHT;
        this.growing = false;
        
        this.graphics = new PIXI.Container();
        this.segmentGraphics = [];
        
        this.updateGraphics();
    }
    
    /**
     * Update the snake's position
     */
    update() {
        this.direction = this.nextDirection;
        
        const head = this.segments[0];

        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        
        newHead.x = (newHead.x + GRID_WIDTH) % GRID_WIDTH;
        newHead.y = (newHead.y + GRID_HEIGHT) % GRID_HEIGHT;
        
        this.segments.unshift(newHead);
        
        if (!this.growing) {
            this.segments.pop();
        } else {
            this.growing = false;
        }
        
        this.updateGraphics();
    }
    
    /**
     * Set the snake's direction
     * @param {Object} newDirection - The new direction to move
     */
    setDirection(newDirection) {
        if (
            (newDirection === DIRECTIONS.UP && this.direction !== DIRECTIONS.DOWN) ||
            (newDirection === DIRECTIONS.DOWN && this.direction !== DIRECTIONS.UP) ||
            (newDirection === DIRECTIONS.LEFT && this.direction !== DIRECTIONS.RIGHT) ||
            (newDirection === DIRECTIONS.RIGHT && this.direction !== DIRECTIONS.LEFT)
        ) {
            this.nextDirection = newDirection;
        }
    }
    
    /**
     * Make the snake grow on next update
     */
    grow() {
        this.growing = true;
    }
    
    /**
     * Check if snake head is at the given position
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @returns {boolean} - True if head is at the position
     */
    isHeadAt(x, y) {
        const head = this.segments[0];
        return head.x === x && head.y === y;
    }
    
    /**
     * Check if any part of the snake is at the given position
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @returns {boolean} - True if any segment is at the position
     */
    isAt(x, y) {
        return this.segments.some(segment => segment.x === x && segment.y === y);
    }
    
    /**
     * Check if snake has collided with itself
     * @returns {boolean} - True if snake collided with itself
     */
    hasCollidedWithSelf() {
        const head = this.segments[0];
        return this.segments.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }
    
    /**
     * Check if snake has collided with a wall
     * @param {Array} walls - Array of wall positions
     * @returns {boolean} - True if snake collided with a wall
     */
    hasCollidedWithWall(walls) {
        const head = this.segments[0];
        return walls.some(wall => wall.x === head.x && wall.y === head.y);
    }
    
    /**
     * Update the snake's graphics
     */
    updateGraphics() {
        this.graphics.removeChildren();
        this.segmentGraphics = [];
        
        this.segments.forEach((segment, index) => {
            const segmentGraphic = new PIXI.Graphics();
            
            const color = index === 0 ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY;
            
            segmentGraphic.beginFill(color);
            segmentGraphic.drawRect(0, 0, GRID_SIZE, GRID_SIZE);
            segmentGraphic.endFill();
            
            segmentGraphic.x = segment.x * GRID_SIZE;
            segmentGraphic.y = segment.y * GRID_SIZE;
            
            this.graphics.addChild(segmentGraphic);
            this.segmentGraphics.push(segmentGraphic);
            
            if (index === 0) {
                this.drawEyes(segmentGraphic);
            }
        });
    }
    
    /**
     * Draw eyes on the snake's head
     * @param {PIXI.Graphics} headGraphic - The head segment graphic
     */
    drawEyes(headGraphic) {
        const eyeSize = GRID_SIZE / 4;
        const eyeOffset = GRID_SIZE / 4;
        
        const eyes = new PIXI.Container();
        headGraphic.addChild(eyes);
        
        let eyePositions = [];
        
        if (this.direction === DIRECTIONS.RIGHT) {
            eyePositions = [
                { x: GRID_SIZE - eyeSize * 1.5, y: eyeOffset },
                { x: GRID_SIZE - eyeSize * 1.5, y: GRID_SIZE - eyeOffset - eyeSize }
            ];
        } else if (this.direction === DIRECTIONS.LEFT) {
            eyePositions = [
                { x: eyeOffset, y: eyeOffset },
                { x: eyeOffset, y: GRID_SIZE - eyeOffset - eyeSize }
            ];
        } else if (this.direction === DIRECTIONS.UP) {
            eyePositions = [
                { x: eyeOffset, y: eyeOffset },
                { x: GRID_SIZE - eyeOffset - eyeSize, y: eyeOffset }
            ];
        } else if (this.direction === DIRECTIONS.DOWN) {
            eyePositions = [
                { x: eyeOffset, y: GRID_SIZE - eyeOffset - eyeSize },
                { x: GRID_SIZE - eyeOffset - eyeSize, y: GRID_SIZE - eyeOffset - eyeSize }
            ];
        }
        
        eyePositions.forEach(pos => {
            const eye = new PIXI.Graphics();
            eye.beginFill(0xFFFFFF);
            eye.drawRect(pos.x, pos.y, eyeSize, eyeSize);
            eye.endFill();
            eyes.addChild(eye);
            
            const pupilSize = eyeSize / 2;
            const pupil = new PIXI.Graphics();
            pupil.beginFill(0x000000);
            pupil.drawRect(pos.x + eyeSize/4, pos.y + eyeSize/4, pupilSize, pupilSize);
            pupil.endFill();
            eyes.addChild(pupil);
        });
    }
    
    /**
     * Get the snake's length
     * @returns {number} - The length of the snake
     */
    getLength() {
        return this.segments.length;
    }
    
    /**
     * Reset snake to initial state
     * @param {number} initialX - Initial X position of snake head
     * @param {number} initialY - Initial Y position of snake head
     */
    reset(initialX, initialY) {
        this.segments = [
            { x: initialX, y: initialY },
            { x: initialX - 1, y: initialY },
            { x: initialX - 2, y: initialY }
        ];
        this.direction = DIRECTIONS.RIGHT;
        this.nextDirection = DIRECTIONS.RIGHT;
        this.growing = false;
        this.updateGraphics();
    }
}
