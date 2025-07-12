/**
 * InputHandler class for HTMLSSnake
 * Manages keyboard and controller inputs
 */
class InputHandler {
    constructor() {
        this.keys = {};
        this.pressedThisFrame = {};
        this.keysHeld = {};
        
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        console.log("Input handler initialized");
    }
    
    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        this.keys[event.key] = true;
        this.keysHeld[event.key] = true;
        console.log("Key down:", event.key);
    }
    
    /**
     * Handle keyup events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyUp(event) {
        this.keys[event.key] = false;
        this.keysHeld[event.key] = false;
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
     * Check if a key is currently held down
     * @param {string} key - The key to check
     * @returns {boolean} - True if the key is held down
     */
    isKeyHeld(key) {
        return this.keysHeld[key] === true;
    }
    
    /**
     * Check if any of the keys in a group is held down
     * @param {Array} keyGroup - Array of keys to check
     * @returns {boolean} - True if any key in the group is held
     */
    isGroupHeld(keyGroup) {
        return keyGroup.some(key => this.isKeyHeld(key));
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
     * @returns {boolean} - True if up was pressed or held
     */
    isUpPressed() {
        return KEY_CODES.UP.some(key => this.isKeyHeld(key));
    }
    
    /**
     * Check if down direction was pressed
     * @returns {boolean} - True if down was pressed or held
     */
    isDownPressed() {
        return KEY_CODES.DOWN.some(key => this.isKeyHeld(key));
    }
    
    /**
     * Check if left direction was pressed
     * @returns {boolean} - True if left was pressed or held
     */
    isLeftPressed() {
        return KEY_CODES.LEFT.some(key => this.isKeyHeld(key));
    }
    
    /**
     * Check if right direction was pressed
     * @returns {boolean} - True if right was pressed or held
     */
    isRightPressed() {
        return KEY_CODES.RIGHT.some(key => this.isKeyHeld(key));
    }
    
    /**
     * Check if pause was pressed
     * @returns {boolean} - True if pause was pressed
     */
    isPausePressed() {
        return KEY_CODES.PAUSE.some(key => this.wasPressed(key));
    }
}
