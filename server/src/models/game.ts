import { Player } from "./player";

export enum GameStatus {
	OPEN = "OPEN", // waiting for player to join
	STARTING = "STARTING",
	RUNNING = "RUNNING",
	ENDED = "ENDED"
}

export class GameState {
	gameId: number
	public: boolean = false
	players: Player[] = []
	
	status: GameStatus = GameStatus.OPEN
	turns: number = 0
	
	get turnPlayer() { return this.players[this.turns % 2] }

}