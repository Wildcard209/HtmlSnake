/**
 * Main entry point for the HTMLSSnake game
 */
document.addEventListener('DOMContentLoaded', () => {
    const loadingMessage = document.createElement('div');
    loadingMessage.style.position = 'absolute';
    loadingMessage.style.top = '50%';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translate(-50%, -50%)';
    loadingMessage.style.fontSize = '24px';
    loadingMessage.style.color = '#7CFC00';
    loadingMessage.textContent = 'Loading...';
    document.body.appendChild(loadingMessage);
    
    preloadAssets().then(() => {
        document.body.removeChild(loadingMessage);
        
        const game = new Game();
        
        game.start();
        
        window.addEventListener('resize', () => {
            game.resize();
        });
    });
});

/**
 * Preload all game assets
 * @returns {Promise} - Promise that resolves when all assets are loaded
 */
function preloadAssets() {
    return new Promise((resolve) => {
        const sounds = [
            'eat.mp3',
            'game_over.mp3',
            'level_up.mp3',
            'grow.mp3',
            'menu_music.mp3',
            'game_music.mp3'
        ];
        
        let totalAssets = sounds.length;
        let loadedAssets = 0;
        
        if (totalAssets === 0) {
            return resolve();
        }
        
        const assetLoaded = () => {
            loadedAssets++;
            if (loadedAssets >= totalAssets) {
                resolve();
            }
        };
        
        sounds.forEach(sound => {
            const soundPath = `assets/sounds/${sound}`;
            const audio = new Audio(soundPath);
            audio.addEventListener('canplaythrough', assetLoaded);
            audio.addEventListener('error', assetLoaded);
        });
    });
}
