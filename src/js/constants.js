const GRID_SIZE = 20;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 30;

const GAME_SPEEDS = {
    VERY_SLOW: 250,
    SLOW: 200,
    NORMAL: 150,
    FAST: 100,
    VERY_FAST: 75
};

const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const COLORS = {
    SNAKE_HEAD: 0x006400, // Dark green
    SNAKE_BODY: 0x32CD32, // Lime green
    FOOD: 0xFF0000,       // Red
    WALL: 0x8B4513,       // Saddle brown
    GRID_BG_1: 0x90EE90,  // Light green
    GRID_BG_2: 0x7CFC00   // Lawn green
};

const KEY_CODES = {
    UP: ['ArrowUp', 'w', 'W'],
    DOWN: ['ArrowDown', 's', 'S'],
    LEFT: ['ArrowLeft', 'a', 'A'],
    RIGHT: ['ArrowRight', 'd', 'D'],
    PAUSE: ['Escape', 'p', 'P']
};

const LEVELS = [
    {
        id: 1,
        name: "Beginner",
        speed: GAME_SPEEDS.VERY_SLOW,
        requiredScore: 10,
        walls: [] // No walls in level 1
    },
    {
        id: 2,
        name: "Novice",
        speed: GAME_SPEEDS.SLOW,
        requiredScore: 15,
        walls: [
            // Simple wall pattern
            {x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10},
            {x: 30, y: 20}, {x: 29, y: 20}, {x: 28, y: 20}
        ]
    },
    {
        id: 3,
        name: "Intermediate",
        speed: GAME_SPEEDS.NORMAL,
        requiredScore: 20,
        walls: [
            // More complex wall pattern
            {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5}, {x: 8, y: 5},
            {x: 5, y: 25}, {x: 6, y: 25}, {x: 7, y: 25}, {x: 8, y: 25},
            {x: 30, y: 5}, {x: 31, y: 5}, {x: 32, y: 5}, {x: 33, y: 5},
            {x: 30, y: 25}, {x: 31, y: 25}, {x: 32, y: 25}, {x: 33, y: 25}
        ]
    },
    {
        id: 4,
        name: "Advanced",
        speed: GAME_SPEEDS.NORMAL,
        requiredScore: 25,
        walls: [
            // Cross pattern
            ...Array.from({length: GRID_WIDTH}, (_, i) => ({x: i, y: 15})).filter(pos => pos.x < 15 || pos.x > 25),
            ...Array.from({length: GRID_HEIGHT}, (_, i) => ({x: 20, y: i})).filter(pos => pos.y < 10 || pos.y > 20)
        ]
    },
    {
        id: 5,
        name: "Expert",
        speed: GAME_SPEEDS.FAST,
        requiredScore: 30,
        walls: [
            // Maze-like pattern
            ...Array.from({length: 10}, (_, i) => ({x: 10, y: i})),
            ...Array.from({length: 10}, (_, i) => ({x: 20, y: i + 10})),
            ...Array.from({length: 10}, (_, i) => ({x: 30, y: i + 20})),
            ...Array.from({length: 15}, (_, i) => ({x: i, y: 10})),
            ...Array.from({length: 15}, (_, i) => ({x: i + 15, y: 20}))
        ]
    }
];

const ASSETS = {
    SOUNDS: {
        EAT: 'assets/sounds/eat.mp3',
        GAME_OVER: 'assets/sounds/game_over.mp3',
        LEVEL_UP: 'assets/sounds/level_up.mp3',
        GROW: 'assets/sounds/grow.mp3'
    },
    MUSIC: {
        MENU: 'assets/sounds/menu_music.mp3',
        GAME: 'assets/sounds/game_music.mp3'
    }
};
