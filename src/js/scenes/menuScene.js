/**
 * MenuScene class for HTMLSSnake
 * Displays the game's main menu
 */
class MenuScene extends BaseScene {
    /**
     * Create a new menu scene
     * @param {Game} game - The main game object
     */
    constructor(game) {
        super(game);
        
        this.setupMenu();
    }
    
    /**
     * Set up the menu elements
     */
    setupMenu() {
        this.background = new PIXI.Graphics();
        this.container.addChild(this.background);
        this.drawBackground();
        
        this.titleContainer = new PIXI.Container();
        this.container.addChild(this.titleContainer);
        
        this.title = this.createText("HTMLSSnake", 64, 0x7CFC00);
        this.title.anchor.set(0.5);
        this.titleContainer.addChild(this.title);
        
        this.createSnakeLogo();
        
        this.buttonsContainer = new PIXI.Container();
        this.container.addChild(this.buttonsContainer);
        
        this.startButton = this.createButton("Start Game", () => {
            this.game.switchScene('game');
        }, 220, 60);
        this.buttonsContainer.addChild(this.startButton);
        
        this.optionsButton = this.createButton("Options", () => {
            console.log("Options button clicked");
        }, 220, 60);
        this.buttonsContainer.addChild(this.optionsButton);
        
        this.positionElements();
        
        this.animationTime = 0;
    }
    
    /**
     * Position menu elements
     */
    positionElements() {
        const appWidth = this.game.app.screen.width;
        const appHeight = this.game.app.screen.height;
        
        this.titleContainer.x = appWidth / 2;
        this.titleContainer.y = appHeight * 0.25;
        
        this.buttonsContainer.x = appWidth / 2;
        this.startButton.x = -this.startButton.width / 2;
        this.startButton.y = appHeight * 0.55;
        
        this.optionsButton.x = -this.optionsButton.width / 2;
        this.optionsButton.y = this.startButton.y + this.startButton.height + 20;
    }
    
    /**
     * Create a decorative snake logo for the menu
     */
    createSnakeLogo() {
        this.snakeLogo = new PIXI.Container();
        this.titleContainer.addChild(this.snakeLogo);
        
        const segments = 5;
        const segmentSize = 20;
        
        for (let i = 0; i < segments; i++) {
            const segment = new PIXI.Graphics();
            
            const color = i === 0 ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY;
            
            segment.beginFill(color);
            segment.drawRect(0, 0, segmentSize, segmentSize);
            segment.endFill();
            
            segment.x = -i * segmentSize * 0.8; 
            segment.y = Math.sin(i * 0.5) * 15;
            
            this.snakeLogo.addChild(segment);
            
            if (i === 0) {
                const eyeSize = segmentSize / 4;
                
                const rightEye = new PIXI.Graphics();
                rightEye.beginFill(0xFFFFFF);
                rightEye.drawRect(segmentSize - eyeSize * 1.5, eyeSize, eyeSize, eyeSize);
                rightEye.endFill();
                
                rightEye.beginFill(0x000000);
                rightEye.drawRect(segmentSize - eyeSize * 1.25, eyeSize * 1.25, eyeSize / 2, eyeSize / 2);
                rightEye.endFill();
                
                segment.addChild(rightEye);
            }
        }
        
        this.snakeLogo.x = this.title.width / 2 + 20;
        this.snakeLogo.y = 15;
    }
    
    /**
     * Draw the background grid pattern
     */
    drawBackground() {
        const appWidth = this.game.app.screen.width;
        const appHeight = this.game.app.screen.height;
        
        this.background.clear();
        
        for (let x = 0; x < GRID_WIDTH; x++) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                const baseColor = (x + y) % 2 === 0 ? COLORS.GRID_BG_1 : COLORS.GRID_BG_2;
                
                const darkenedColor = this.darkenColor(baseColor, 0.7);
                
                this.background.beginFill(darkenedColor);
                this.background.drawRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
                this.background.endFill();
            }
        }
        
        const vignette = new PIXI.Graphics();
        vignette.beginFill(0x000000, 0.3);
        vignette.drawRect(0, 0, appWidth, appHeight);
        vignette.endFill();
        
        const mask = new PIXI.Graphics();
        mask.beginFill(0xFFFFFF);
        mask.drawCircle(appWidth / 2, appHeight / 2, Math.max(appWidth, appHeight) * 0.7);
        mask.endFill();
        
        vignette.mask = mask;
        this.background.addChild(vignette);
        this.background.addChild(mask);
    }
    
    /**
     * Darken a color by a specified amount
     * @param {number} color - The color to darken
     * @param {number} amount - The amount to darken (0-1)
     * @returns {number} - The darkened color
     */
    darkenColor(color, amount) {
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        
        const newR = Math.floor(r * amount);
        const newG = Math.floor(g * amount);
        const newB = Math.floor(b * amount);
        
        return (newR << 16) | (newG << 8) | newB;
    }
    
    /**
     * Called when scene becomes active
     */
    onEnter() {
        this.game.audio.playMusic('menu');
        
        this.animationTime = 0;
        
        this.positionElements();
        
        this.titleContainer.alpha = 0;
        this.titleContainer.y += 50;
        this.buttonsContainer.alpha = 0;
        
        gsap.to(this.titleContainer, {
            alpha: 1,
            y: this.game.app.screen.height * 0.25,
            duration: 0.8,
            ease: "back.out"
        });
        
        gsap.to(this.buttonsContainer, {
            alpha: 1,
            duration: 0.5,
            delay: 0.4
        });
    }
    
    /**
     * Called when scene becomes inactive
     */
    onExit() {
        // Stop any animations if needed
    }
    
    /**
     * Update scene state
     * @param {number} delta - Time elapsed since last update
     */
    update(delta) {
        this.animationTime += delta / 60;
        
        this.titleContainer.y = this.game.app.screen.height * 0.25 + Math.sin(this.animationTime) * 5;
        
        if (this.snakeLogo) {
            this.snakeLogo.rotation = Math.sin(this.animationTime * 0.5) * 0.1;
        }
    }
}
