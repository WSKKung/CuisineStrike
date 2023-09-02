import { WebSocket } from "ws"
import { Player } from "./player"
import { GameState } from "./game"

export class AppState {
	players: Player[] = []
	games: GameState[] = []
	playerQueue: Player[] = []
	sockets = {}
}

const appState = new AppState()

export default appState
