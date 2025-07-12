/**
 * BaseScene class for HTMLSSnake
 * Base class for all game scenes
 */
class BaseScene {
    /**
     * Create a new scene
     * @param {Game} game - The main game object
     */
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
    }
    
    /**
     * Called when scene becomes active
     */
    onEnter() {
        // Override in subclasses
    }
    
    /**
     * Called when scene becomes inactive
     */
    onExit() {
        // Override in subclasses
    }
    
    /**
     * Update scene state
     * @param {number} delta - Time elapsed since last update
     */
    update(delta) {
        // Override in subclasses
    }
    
    /**
     * Create a text object with standard styling
     * @param {string} text - The text content
     * @param {number} size - Font size
     * @param {number} color - Text color
     * @param {string} align - Text alignment
     * @returns {PIXI.Text} - The created text object
     */
    createText(text, size = 24, color = 0xFFFFFF, align = 'center') {
        const textStyle = new PIXI.TextStyle({
            fontFamily: 'Courier New, Courier, monospace',
            fontSize: size,
            fontWeight: 'bold',
            fill: color,
            align: align,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 4,
            dropShadowDistance: 2
        });
        
        return new PIXI.Text(text, textStyle);
    }
    
    /**
     * Create a button
     * @param {string} text - Button text
     * @param {Function} onClick - Click handler
     * @param {number} width - Button width
     * @param {number} height - Button height
     * @returns {PIXI.Container} - Button container
     */
    createButton(text, onClick, width = 200, height = 50) {
        const button = new PIXI.Container();
        button.interactive = true;
        button.buttonMode = true;
        
        // Button background
        const background = new PIXI.Graphics();
        background.beginFill(0x7CFC00); // Light green
        background.drawRoundedRect(0, 0, width, height, 10);
        background.endFill();
        
        // Button text
        const buttonText = this.createText(text, 20, 0x000000);
        buttonText.anchor.set(0.5);
        buttonText.x = width / 2;
        buttonText.y = height / 2;
        
        // Add to button container
        button.addChild(background);
        button.addChild(buttonText);
        
        // Add hover effects
        button.on('pointerover', () => {
            background.tint = 0x90EE90; // Lighter green
            button.scale.set(1.05);
        });
        
        button.on('pointerout', () => {
            background.tint = 0xFFFFFF; // Reset tint
            button.scale.set(1.0);
        });
        
        // Add click handler
        button.on('pointerdown', () => {
            background.tint = 0x32CD32; // Darker green
            button.scale.set(0.95);
        });
        
        button.on('pointerup', () => {
            background.tint = 0xFFFFFF; // Reset tint
            button.scale.set(1.0);
            onClick();
        });
        
        return button;
    }
}
