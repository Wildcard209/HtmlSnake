/**
 * InputHandler class for HTMLSSnake
 * Manages keyboard and controller inputs
 */
class InputHandler {
    constructor() {
        this.keys = {};
        this.pressedThisFrame = {};
        this.keysHeld = {};
        
        this._handleKeyDown = this.handleKeyDown.bind(this);
        this._handleKeyUp = this.handleKeyUp.bind(this);
        
        try {
            window.addEventListener('keydown', this._handleKeyDown);
            window.addEventListener('keyup', this._handleKeyUp);
            console.log("Input handler initialized successfully");
        } catch (error) {
            console.error("Error initializing input handler:", error);
        }
        
        console.log("Input handler initial state:", {
            keys: this.keys,
            keysHeld: this.keysHeld,
            pressedThisFrame: this.pressedThisFrame
        });
    }
    
    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        try {
            this.keys[event.key] = true;
            this.keysHeld[event.key] = true;
            console.log("Key down:", event.key);
        } catch (error) {
            console.error("Error in handleKeyDown:", error);
        }
    }
    
    /**
     * Handle keyup events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyUp(event) {
        try {
            this.keys[event.key] = false;
            this.keysHeld[event.key] = false;
        } catch (error) {
            console.error("Error in handleKeyUp:", error);
        }
    }
    
    /**
     * Update input state (called each frame)
     */
    update() {
        try {
            this.pressedThisFrame = {};
            
            for (const key in this.keys) {
                if (this.keys[key]) {
                    this.pressedThisFrame[key] = true;
                    this.keys[key] = false;
                }
            }
        } catch (error) {
            console.error("Error in input update:", error);
        }
    }
    
    /**
     * Check if a key was just pressed this frame
     * @param {string} key - The key to check
     * @returns {boolean} - True if the key was just pressed
     */
    wasPressed(key) {
        try {
            return this.pressedThisFrame[key] === true;
        } catch (error) {
            console.error("Error in wasPressed:", error);
            return false;
        }
    }
    
    /**
     * Check if a key is currently held down
     * @param {string} key - The key to check
     * @returns {boolean} - True if the key is held down
     */
    isKeyHeld(key) {
        try {
            return this.keysHeld[key] === true;
        } catch (error) {
            console.error("Error in isKeyHeld:", error);
            return false;
        }
    }
    
    /**
     * Check if any of the keys in a group is held down
     * @param {Array} keyGroup - Array of keys to check
     * @returns {boolean} - True if any key in the group is held
     */
    isGroupHeld(keyGroup) {
        try {
            return keyGroup.some(key => this.isKeyHeld(key));
        } catch (error) {
            console.error("Error in isGroupHeld:", error);
            return false;
        }
    }
    
    /**
     * Check if any of the keys in a group was just pressed
     * @param {Array} keyGroup - Array of keys to check
     * @returns {boolean} - True if any key in the group was just pressed
     */
    wasGroupPressed(keyGroup) {
        try {
            return keyGroup.some(key => this.wasPressed(key));
        } catch (error) {
            console.error("Error in wasGroupPressed:", error);
            return false;
        }
    }
    
    /**
     * Check if up direction was pressed
     * @returns {boolean} - True if up was pressed or held
     */
    isUpPressed() {
        try {
            return KEY_CODES.UP.some(key => this.isKeyHeld(key));
        } catch (error) {
            console.error("Error in isUpPressed:", error);
            return false;
        }
    }
    
    /**
     * Check if down direction was pressed
     * @returns {boolean} - True if down was pressed or held
     */
    isDownPressed() {
        try {
            return KEY_CODES.DOWN.some(key => this.isKeyHeld(key));
        } catch (error) {
            console.error("Error in isDownPressed:", error);
            return false;
        }
    }
    
    /**
     * Check if left direction was pressed
     * @returns {boolean} - True if left was pressed or held
     */
    isLeftPressed() {
        try {
            return KEY_CODES.LEFT.some(key => this.isKeyHeld(key));
        } catch (error) {
            console.error("Error in isLeftPressed:", error);
            return false;
        }
    }
    
    /**
     * Check if right direction was pressed
     * @returns {boolean} - True if right was pressed or held
     */
    isRightPressed() {
        try {
            return KEY_CODES.RIGHT.some(key => this.isKeyHeld(key));
        } catch (error) {
            console.error("Error in isRightPressed:", error);
            return false;
        }
    }
    
    /**
     * Check if pause was pressed
     * @returns {boolean} - True if pause was pressed
     */
    isPausePressed() {
        try {
            return KEY_CODES.PAUSE.some(key => this.wasPressed(key));
        } catch (error) {
            console.error("Error in isPausePressed:", error);
            return false;
        }
    }
}
