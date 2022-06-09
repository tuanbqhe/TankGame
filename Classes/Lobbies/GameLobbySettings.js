module.exports = class GameLobbySettings {
    constructor(gameMode, maxPlayers, minPlayers, levelData) {
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.levelData = levelData;
        this.gameMode = gameMode;
    }
}