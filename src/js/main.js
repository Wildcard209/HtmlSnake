document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    
    game.start();
    
    window.addEventListener('resize', () => {
        game.resize();
    });
});
