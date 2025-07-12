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
    
    // Preload critical audio files first
    preloadCriticalAudio().then(() => {
        return preloadAssets();
    }).then(() => {
        document.body.removeChild(loadingMessage);
        
        // Initialize Howler.js
        if (!window.Howler) {
            console.warn("Howler.js not detected, audio may not work properly");
        } else {
            console.log("Howler.js initialized");
        }
        
        const game = new Game();
        
        game.start();
        
        window.addEventListener('resize', () => {
            game.resize();
        });
    });
});

/**
 * Preload critical audio files needed before game starts
 * This ensures menu music is available immediately
 */
function preloadCriticalAudio() {
    return new Promise((resolve) => {
        console.log("Preloading critical audio (menu music)");
        
        try {
            // Force load menu music first
            const menuMusic = new Audio();
            menuMusic.addEventListener('canplaythrough', () => {
                console.log("Menu music preloaded successfully");
                resolve();
            }, { once: true });
            
            menuMusic.addEventListener('error', (e) => {
                console.warn("Failed to preload menu music:", e);
                resolve(); // Continue anyway
            }, { once: true });
            
            // Set a timeout to prevent hanging
            setTimeout(() => {
                console.warn("Menu music preload timed out");
                resolve();
            }, 3000);
            
            menuMusic.src = 'assets/sounds/menu_music.mp3';
        } catch (error) {
            console.error("Error preloading menu music:", error);
            resolve(); // Continue anyway
        }
    });
}

/**
 * Preload all game assets
 * @returns {Promise} - Promise that resolves when all assets are loaded
 */
function preloadAssets() {
    return new Promise((resolve) => {
        console.log("Starting asset preloading");
        
        // Set a timeout to ensure we don't hang forever on bad assets
        const loadingTimeout = setTimeout(() => {
            console.warn("Asset loading timed out after 10 seconds - continuing anyway");
            resolve();
        }, 10000);
        
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
        let failedAssets = 0;
        
        if (totalAssets === 0) {
            clearTimeout(loadingTimeout);
            console.log("No assets to preload");
            return resolve();
        }
        
        const assetLoaded = (soundName, success) => {
            if (success) {
                console.log(`Asset loaded: ${soundName}`);
                loadedAssets++;
            } else {
                console.warn(`Failed to load asset: ${soundName} - continuing anyway`);
                failedAssets++;
            }
            
            // If all assets are processed (successfully or not), resolve the promise
            if ((loadedAssets + failedAssets) >= totalAssets) {
                clearTimeout(loadingTimeout);
                console.log(`Asset preloading complete. Loaded: ${loadedAssets}, Failed: ${failedAssets}`);
                resolve();
            }
        };
        
        // Attempt to load each sound with safety measures
        sounds.forEach(sound => {
            try {
                const soundPath = `assets/sounds/${sound}`;
                console.log(`Attempting to preload: ${soundPath}`);
                
                const audio = new Audio();
                
                // Set up event listeners before setting src
                audio.addEventListener('canplaythrough', () => {
                    assetLoaded(sound, true);
                }, { once: true });
                
                audio.addEventListener('error', (e) => {
                    console.error(`Error loading ${sound}:`, e);
                    assetLoaded(sound, false);
                }, { once: true });
                
                // Set a timeout for individual assets
                const individualTimeout = setTimeout(() => {
                    console.warn(`Loading timed out for ${sound}`);
                    assetLoaded(sound, false);
                }, 5000);
                
                // Clean up the timeout when loaded or error
                audio.addEventListener('canplaythrough', () => clearTimeout(individualTimeout), { once: true });
                audio.addEventListener('error', () => clearTimeout(individualTimeout), { once: true });
                
                // Now set src to start loading
                audio.src = soundPath;
            } catch (error) {
                console.error(`Exception while setting up ${sound}:`, error);
                assetLoaded(sound, false);
            }
        });
    });
}
