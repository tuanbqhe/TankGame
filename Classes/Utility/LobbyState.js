modules.exports = class LobbyState {
    constructor() {
        this.GAME = 'game';
        this.LOBBY = 'lobby';
        this.ENDGAME = 'endgame';
        this.currentState = this.LOBBY;
    }
}