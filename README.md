# HTMLSSnake

A modern take on the classic Snake game built with PixiJS and Electron.

## Features

- Level-based progression system
- Increasing challenge through level design
- Wrap-around grid edges
- Obstacles and walls in advanced levels
- Cross-platform: runs in browsers and as a desktop application

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd HTMLSSnake
   ```

2. Install dependencies
   ```
   npm install
   ```

### Running the Game

- Run as Electron app (desktop):
  ```
  npm start
  ```

- Run in development mode with DevTools:
  ```
  npm run dev
  ```

- Run as web application:
  ```
  npm run web
  ```
  Then open http://localhost:8080 in your browser.

### Building for Distribution

```
npm run build
```

This will create distributable packages in the `dist` directory.

## Game Controls

- Arrow keys or WASD to move the snake
- ESC to pause the game
- Controller support is also available

## License

MIT
