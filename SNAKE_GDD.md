# HTMLSSnake - Game Design Document

## 1. Game Overview

### Core Concept
HTMLSSnake is a modern take on the classic Snake game where the player controls a snake on a grid. The snake moves around collecting apples which make it grow longer. The primary objective is to collect as many apples as possible without the snake colliding with itself.

### Target Platforms
- Primary: Desktop web browsers
- Secondary: Mobile web browsers

### Unique Selling Points
- Level-based progression system
- Increasing challenge through level design
- Wrap-around grid edges
- Obstacles and walls in advanced levels

## 2. Game Mechanics

### Movement
- Grid-based movement (up, down, left, right)
- The snake cannot immediately reverse direction (cannot go in the direction of its last body segment)
- Movement occurs at fixed time intervals

### Controls
- Arrow keys
- WASD keys
- Controller support

### Growth Mechanics
- When the snake eats an apple, it grows by one segment
- Growth occurs at the tail end of the snake

### Collision Rules
- Edge collisions: Snake wraps around to the opposite side of the grid
- Self-collision: Game over
- Wall/obstacle collision: Game over

## 3. Game Elements

### Snake
- Visual: Simple blocky pixel art style
- Color: Vibrant green
- Head will be visually distinct from the body segments

### Food
- Visual: Simple blocky pixel art apples
- Color: Vibrant red
- Randomly appears on the grid in locations not occupied by the snake or obstacles

### Playing Field
- Grid-based layout
- Wrap-around borders (snake teleports to opposite side)
- Later levels include static wall obstacles

## 4. Game Progression

### Level System
- Players advance through levels by collecting a certain number of apples
- Each level introduces new challenges

### Difficulty Progression
- Increasing complexity of level layouts
- More obstacles and walls in advanced levels
- Higher threshold of apples needed to progress to the next level

### Scoring System
- Score is measured by the number of apples collected
- The length of the snake serves as a visual representation of the player's score
- A progress indicator (secondary snake at the top) shows how close the player is to advancing to the next level

## 5. Visual Style

### Art Direction
- Pixel art aesthetic
- Clean, readable visuals
- Clear distinction between game elements

### Color Scheme
- Snake: Vibrant green
- Apples: Bright red
- Background/grass: Light green
- Walls/obstacles: Distinct contrasting color

### Theme
- Nature theme
- Simple forest/grass environment

## 6. Audio

### Sound Effects
- Eating food sound
- Game over sound
- Growing larger sound
- Level completion/threshold sound

### Music
- Title screen: Upbeat, inviting theme
- Gameplay: Cheerful lofi music
- All music will loop seamlessly

## 7. User Interface

### HUD Elements
- The snake's length serves as a diegetic score display
- Secondary snake at the top of the screen shows progress toward the next level
- Burger menu icon for accessing the pause menu

### Menus
- Simple, clean design
- Title screen with game name and start option
- Pause menu with resume, restart, and quit options
- Game over screen with final score and restart option

### Pause Functionality
- Game can be paused at any time
- Pause menu appears when game is paused
- All game actions and timers stop during pause

## 8. Technical Requirements

### Development Platform
- PixiJS for rendering and game logic
- Electron for desktop application packaging
- JavaScript/HTML5 as the core technology

### Performance Considerations
- Must run smoothly in web browsers and as a desktop application
- Responsive design to accommodate different screen sizes
- Minimal loading times
- Hardware acceleration via WebGL through PixiJS

## 9. Development Roadmap

### Timeline
- Total development time: 2 weeks

### Phase 1: Core Mechanics (Days 1-5)
- Grid system implementation
- Snake movement and control
- Collision detection
- Food spawning
- Basic scoring

### Phase 2: Game Systems (Days 6-10)
- Level progression
- UI implementation
- Audio integration
- Wall/obstacle implementation

### Phase 3: Polish (Days 11-14)
- Visual refinement
- Performance optimization
- Bug fixing
- Final testing

## 10. Future Expansion Possibilities
- Mobile-optimized touch controls
- Additional obstacles like moving barriers
- Time-limited bonus items
- Multiplayer mode
- Level editor
