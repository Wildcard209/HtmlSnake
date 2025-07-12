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
        
        this.loadAudio();
    }
    
    /**
     * Load all audio files
     */
    loadAudio() {
        this.sounds.eat = new Howl({
            src: [ASSETS.SOUNDS.EAT],
            volume: this.soundVolume
        });
        
        this.sounds.gameOver = new Howl({
            src: [ASSETS.SOUNDS.GAME_OVER],
            volume: this.soundVolume
        });
        
        this.sounds.levelUp = new Howl({
            src: [ASSETS.SOUNDS.LEVEL_UP],
            volume: this.soundVolume
        });
        
        this.sounds.grow = new Howl({
            src: [ASSETS.SOUNDS.GROW],
            volume: this.soundVolume
        });
        
        this.music.menu = new Howl({
            src: [ASSETS.MUSIC.MENU],
            volume: this.musicVolume,
            loop: true
        });
        
        this.music.game = new Howl({
            src: [ASSETS.MUSIC.GAME],
            volume: this.musicVolume,
            loop: true
        });
    }
    
    /**
     * Play a sound effect
     * @param {string} soundName - The name of the sound effect to play
     */
    playSound(soundName) {
        if (this.soundEnabled && this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
    
    /**
     * Play background music
     * @param {string} musicName - The name of the music track to play
     */
    playMusic(musicName) {
        if (this.currentMusic) {
            this.currentMusic.stop();
        }
        
        if (this.musicEnabled && this.music[musicName]) {
            this.currentMusic = this.music[musicName];
            this.currentMusic.play();
        }
    }
    
    /**
     * Stop all music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
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
        
        if (this.musicEnabled) {
            if (this.currentMusic) {
                this.currentMusic.play();
            }
        } else {
            if (this.currentMusic) {
                this.currentMusic.pause();
            }
        }
    }
    
    /**
     * Set sound volume
     * @param {number} volume - Volume level (0-1)
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        
        for (const soundName in this.sounds) {
            if (this.sounds[soundName]) {
                this.sounds[soundName].volume(this.soundVolume);
            }
        }
    }
    
    /**
     * Set music volume
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        for (const musicName in this.music) {
            if (this.music[musicName]) {
                this.music[musicName].volume(this.musicVolume);
            }
        }
    }
}
