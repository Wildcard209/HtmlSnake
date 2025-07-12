/**
 * AudioManager class for HTMLSSnake
 * Manages game sounds and music using Howler.js
 */
class AudioManager {
    constructor() {
        this.sounds = {
            eat: null,
            gameOver: null,
            levelUp: null,
            grow: null
        };
        
        this.music = {
            menu: null,
            game: null
        };
        
        this.soundVolume = 0.7;
        this.musicVolume = 0.4;
        this.soundEnabled = true;
        this.musicEnabled = true;
        
        this.currentMusic = null;
        
        this.audioLoadFailed = false;
        this.audioInitialized = false;
        
        // Create initial dummy objects to handle immediate requests
        this._createDummyAudioSystem();
        
        // Initialize immediately to ensure menu music can play
        this.loadAudio();
        console.log("Initial audio loading completed");
        
        // Initialize with a delay to ensure assets are properly preloaded for in-game sounds
        this.initTimeout = setTimeout(() => {
            try {
                this.loadAudio();
                console.log("Audio loaded successfully");
                this.audioInitialized = true;
                
                // Try to play menu music again if we're in the menu scene
                if (this.currentMusic && this.currentMusic === this.music.menu) {
                    console.log("Replaying menu music after full initialization");
                    this.playMusic('menu');
                }
            } catch (error) {
                console.error("Error loading audio:", error);
                this.audioLoadFailed = true;
                this._createDummyAudioSystem();
            }
        }, 800); // Increased delay to ensure assets are loaded
        
        // Safety timeout - if audio hasn't initialized after 5 seconds, create dummy system
        this.safetyTimeout = setTimeout(() => {
            if (!this.audioInitialized) {
                console.warn("Audio initialization timed out after 5 seconds, creating fallback system");
                this.audioLoadFailed = true;
                clearTimeout(this.initTimeout);
                this._createDummyAudioSystem();
            }
        }, 5000);
    }
    
    /**
     * Create a complete dummy audio system if loading fails
     * @private
     */
    _createDummyAudioSystem() {
        console.log("Creating dummy audio system");
        
        // Create dummy sound objects
        for (const soundName in this.sounds) {
            this.sounds[soundName] = {
                play: () => { return 0; },
                stop: () => {},
                volume: () => {},
                playing: () => false
            };
        }
        
        // Create dummy music objects
        for (const musicName in this.music) {
            this._createDummyMusic(musicName);
        }
        
        // Set as initialized
        this.audioInitialized = true;
    }
    
    /**
     * Load all audio files
     */
    loadAudio() {
        try {
            console.log("Loading sound effects...");
            
            // Load each sound with error handling
            this._loadSound('eat', ASSETS.SOUNDS.EAT);
            this._loadSound('gameOver', ASSETS.SOUNDS.GAME_OVER);
            this._loadSound('levelUp', ASSETS.SOUNDS.LEVEL_UP);
            this._loadSound('grow', ASSETS.SOUNDS.GROW);
            
            console.log("Loading music...");
            
            // Load each music track with error handling
            this._loadMusic('menu', ASSETS.MUSIC.MENU);
            this._loadMusic('game', ASSETS.MUSIC.GAME);
            
            console.log("Audio loading complete");
        } catch (error) {
            console.error("Error in loadAudio:", error);
            this.audioLoadFailed = true;
        }
    }
    
    /**
     * Load a single sound with error handling
     * @private
     */
    _loadSound(name, path) {
        try {
            console.log(`Loading sound: ${name} from ${path}`);
            this.sounds[name] = new Howl({
                src: [path],
                volume: this.soundVolume,
                html5: true,
                onload: () => console.log(`Sound loaded: ${name}`),
                onloaderror: (id, err) => {
                    console.error(`Error loading sound ${name}:`, err);
                    // Create a dummy sound that does nothing
                    this.sounds[name] = {
                        play: () => {},
                        stop: () => {},
                        volume: () => {}
                    };
                }
            });
        } catch (error) {
            console.error(`Error creating Howl for ${name}:`, error);
            // Create a dummy sound that does nothing
            this.sounds[name] = {
                play: () => {},
                stop: () => {},
                volume: () => {}
            };
        }
    }
    
    /**
     * Load a single music track with error handling
     * @private
     */
    _loadMusic(name, path) {
        try {
            console.log(`Loading music: ${name} from ${path}`);
            
            // Create a timeout to detect hanging loads
            let loadTimeout = setTimeout(() => {
                console.error(`Timeout loading music ${name}. Creating dummy object.`);
                // Create a dummy music object if loading takes too long
                this._createDummyMusic(name);
            }, 5000); // 5 second timeout
            
            this.music[name] = new Howl({
                src: [path],
                volume: this.musicVolume,
                loop: true,
                html5: true, // Force HTML5 Audio for larger music files
                preload: true,
                onload: () => {
                    console.log(`Music loaded successfully: ${name}`);
                    clearTimeout(loadTimeout);
                },
                onloaderror: (id, err) => {
                    console.error(`Error loading music ${name}:`, err);
                    clearTimeout(loadTimeout);
                    // Create a dummy music object that does nothing
                    this._createDummyMusic(name);
                }
            });
        } catch (error) {
            console.error(`Error creating Howl for ${name}:`, error);
            // Create a dummy music object that does nothing
            this._createDummyMusic(name);
        }
    }
    
    /**
     * Create a dummy music object that does nothing
     * @private
     */
    _createDummyMusic(name) {
        console.log(`Creating dummy music for: ${name}`);
        this.music[name] = {
            play: () => { return 0; }, // Return a dummy ID
            stop: () => {},
            pause: () => {},
            volume: () => {},
            loop: () => {},
            state: () => 'unloaded',
            playing: () => false
        };
    }
    
    /**
     * Play a sound effect
     * @param {string} soundName - The name of the sound effect to play
     */
    playSound(soundName) {
        if (this.audioLoadFailed) {
            console.warn("Audio system is disabled due to loading failures");
            return;
        }
        
        try {
            if (this.soundEnabled && this.sounds[soundName]) {
                console.log(`Playing sound: ${soundName}`);
                this.sounds[soundName].play();
            }
        } catch (error) {
            console.error(`Error playing sound ${soundName}:`, error);
        }
    }
    
    /**
     * Play background music
     * @param {string} musicName - The name of the music track to play
     */
    playMusic(musicName) {
        if (this.audioLoadFailed) {
            console.warn("Audio system is disabled due to loading failures");
            return;
        }
        
        try {
            console.log(`Attempting to play music: ${musicName}`);
            
            // Stop current music if any
            if (this.currentMusic) {
                try {
                    this.currentMusic.stop();
                } catch (error) {
                    console.error("Error stopping current music:", error);
                }
            }
            
            // Check if music exists and is enabled
            if (this.musicEnabled && this.music[musicName]) {
                console.log(`Starting music: ${musicName}`);
                this.currentMusic = this.music[musicName];
                
                try {
                    // Protect against potential errors with a fallback
                    if (typeof this.currentMusic.play !== 'function') {
                        console.error(`Music ${musicName} play function not available. Creating dummy.`);
                        this._createDummyMusic(musicName);
                        this.currentMusic = this.music[musicName];
                    }
                    
                    const id = this.currentMusic.play();
                    console.log(`Music playing with id: ${id}`);
                    
                    // Verify that the music is actually playing
                    setTimeout(() => {
                        try {
                            if (this.currentMusic && typeof this.currentMusic.playing === 'function' && !this.currentMusic.playing()) {
                                console.warn(`Music ${musicName} failed to play properly. Attempting fallback.`);
                                // Try one more time with a clean instance
                                this._createDummyMusic(musicName);
                                this.currentMusic = this.music[musicName];
                            }
                        } catch (e) {
                            console.error("Error checking if music is playing:", e);
                        }
                    }, 1000);
                } catch (error) {
                    console.error(`Error playing ${musicName}:`, error);
                    // Create a dummy on error to prevent future crashes
                    this._createDummyMusic(musicName);
                    this.currentMusic = this.music[musicName];
                }
            }
        } catch (error) {
            console.error(`Error in playMusic for ${musicName}:`, error);
        }
    }
    
    /**
     * Stop all music
     */
    stopMusic() {
        if (this.audioLoadFailed) {
            return;
        }
        
        try {
            if (this.currentMusic) {
                this.currentMusic.stop();
                this.currentMusic = null;
            }
        } catch (error) {
            console.error("Error stopping music:", error);
        }
    }
    
    /**
     * Toggle sound effects on/off
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
    }
    
    /**
     * Toggle music on/off
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        try {
            if (this.musicEnabled) {
                if (this.currentMusic) {
                    this.currentMusic.play();
                }
            } else {
                if (this.currentMusic) {
                    this.currentMusic.pause();
                }
            }
        } catch (error) {
            console.error("Error toggling music:", error);
        }
    }
    
    /**
     * Set sound volume
     * @param {number} volume - Volume level (0-1)
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        
        try {
            for (const soundName in this.sounds) {
                if (this.sounds[soundName]) {
                    this.sounds[soundName].volume(this.soundVolume);
                }
            }
        } catch (error) {
            console.error("Error setting sound volume:", error);
        }
    }
    
    /**
     * Set music volume
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        try {
            for (const musicName in this.music) {
                if (this.music[musicName]) {
                    this.music[musicName].volume(this.musicVolume);
                }
            }
        } catch (error) {
            console.error("Error setting music volume:", error);
        }
    }
}
