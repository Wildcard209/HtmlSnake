/**
 * InputHandler class for HTMLSSnake
 * Manages keyboard and controller inputs
 */
class InputHandler {
    constructor() {
        this.keys = {};
        this.pressedThisFrame = {};
        
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        this.keys[event.key] = true;
    }
    
    /**
     * Handle keyup events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyUp(event) {
        this.keys[event.key] = false;
    }
    
    /**
     * Update input state (called each frame)
     */
    update() {
        this.pressedThisFrame = {};
        
        for (const key in this.keys) {
            if (this.keys[key]) {
                this.pressedThisFrame[key] = true;
                
                this.keys[key] = false;
            }
        }
    }
    
    /**
     * Check if a key was just pressed this frame
     * @param {string} key - The key to check
     * @returns {boolean} - True if the key was just pressed
     */
    wasPressed(key) {
        return this.pressedThisFrame[key] === true;
    }
    
    /**
     * Check if any of the keys in a group was just pressed
     * @param {Array} keyGroup - Array of keys to check
     * @returns {boolean} - True if any key in the group was just pressed
     */
    wasGroupPressed(keyGroup) {
        return keyGroup.some(key => this.wasPressed(key));
    }
    
    /**
     * Check if up direction was pressed
     * @returns {boolean} - True if up was pressed
     */
    isUpPressed() {
        return KEY_CODES.UP.some(key => this.wasPressed(key));
    }
    
    /**
     * Check if down direction was pressed
     * @returns {boolean} - True if down was pressed
     */
    isDownPressed() {
        return KEY_CODES.DOWN.some(key => this.wasPressed(key));
    }
    
    /**
     * Check if left direction was pressed
     * @returns {boolean} - True if left was pressed
     */
    isLeftPressed() {
        return KEY_CODES.LEFT.some(key => this.wasPressed(key));
    }
    
    /**
     * Check if right direction was pressed
     * @returns {boolean} - True if right was pressed
     */
    isRightPressed() {
        return KEY_CODES.RIGHT.some(key => this.wasPressed(key));
    }
    
    /**
     * Check if pause was pressed
     * @returns {boolean} - True if pause was pressed
     */
    isPausePressed() {
        return KEY_CODES.PAUSE.some(key => this.wasPressed(key));
    }
}
