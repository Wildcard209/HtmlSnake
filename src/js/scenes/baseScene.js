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
        
        const background = new PIXI.Graphics();
        
        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x000000, 0.4);
        shadow.drawRoundedRect(4, 4, width, height, 10);
        shadow.endFill();
        button.addChild(shadow);
        
        background.beginFill(0x32CD32);
        background.lineStyle(3, 0x006400);
        background.drawRoundedRect(0, 0, width, height, 10);
        background.endFill();
        
        const highlight = new PIXI.Graphics();
        highlight.beginFill(0xFFFFFF, 0.3);
        highlight.drawRoundedRect(3, 3, width - 6, height / 3, 10, 10, 0, 0);
        highlight.endFill();
        
        const buttonText = this.createText(text, 20, 0xFFFFFF);
        buttonText.style.dropShadow = true;
        buttonText.style.dropShadowColor = 0x000000;
        buttonText.style.dropShadowDistance = 2;
        buttonText.anchor.set(0.5);
        buttonText.x = width / 2;
        buttonText.y = height / 2;
        
        button.addChild(background);
        button.addChild(highlight);
        button.addChild(buttonText);
        
        button.on('pointerover', () => {
            background.tint = 0x7CFC00;
            button.scale.set(1.05);
        });
        
        button.on('pointerout', () => {
            background.tint = 0xFFFFFF;
            button.scale.set(1.0);
        });
        
        button.on('pointerdown', () => {
            background.tint = 0x228B22;
            button.scale.set(0.95);
        });
        
        button.on('pointerup', () => {
            background.tint = 0xFFFFFF;
            button.scale.set(1.0);
            console.log("Button clicked:", text);
            onClick();
        });
        
        return button;
    }
}
