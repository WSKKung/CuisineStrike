import { all, fork, put, take, takeEvery } from "redux-saga/effects"
import { Actions, PlayerAction, PlayerConnectedAction, PlayerDisconnectedAction } from "../actions"
import appState from "../models/root"
import { GameState, GameStatus } from "../models/game"

// player connected through a WebSocket
function* onPlayerConnected(action: PlayerConnectedAction) {
	console.log(`Player ${action.player.id} connected`)
	action.socket.send(`hello player ${action.player.id}`)
}

// player disconnected from a WebSocket
function* onPlayerDisconnected(action: PlayerDisconnectedAction) {
	console.log(`Player ${action.player.id} disconnected`)
	// TODO: Remove player and cancel game on time limit
}

// player ask to find a random public room to join
function* onPlayerFindRandomMatch(action: PlayerAction) {
	appState.playerQueue.push(action.player)
	if (appState.playerQueue.length >= 2) {
		// create new public game
		let newGame = new GameState()
		newGame.gameId = appState.games.length + 1
		newGame.public = true
		newGame.players.push(appState.playerQueue[0])
		newGame.players.push(appState.playerQueue[1])
		appState.playerQueue = appState.playerQueue.slice(2)
		appState.games.push(newGame)
		yield put({ type: "GAME_STARTED", game: newGame })
		
		// announce game start
	}
}

// player manually create new private game with specified code and (optionally) password
function* onPlayerCreatePrivateGame(action: PlayerAction) {

}

function* onGameStart(action: any) {
	let game: GameState = action.game
	// initialize game state
	game.turns = 0
	game.status = GameStatus.STARTING
	// determine player turn order randomly
	if (Math.random() < 0.5) {
		game.players.reverse()
	}

	game.players.forEach(p => {
		// notify game starting to player
		// also send initial game state (cards in decks, starting hands, player & opponent info)
		p.socket.send(JSON.stringify({ event: "GAME_STARTING" }))
	})
	yield fork(gameSaga, game)
}

function* gameSaga(game: GameState) {

	// wait for every player to send ready message
	let awaitingPlayers = new Set(game.players)
	while (awaitingPlayers.size > 0) {
		// pre-duel player action will be received here
		// e.g. paper-rock-scissor to determine first turn player, or mulligan, or something else?
		const readyAction: PlayerAction = yield take(Actions.PLAYER_GAME_READY)
		if (awaitingPlayers.has(readyAction.player)) {
			awaitingPlayers.delete(readyAction.player)
		}
	}

	// game started
	game.status = GameStatus.RUNNING
	game.players.forEach(p => {
		p.socket.send(JSON.stringify({ event: "GAME_STARTED" }))
	})
}


function* matchmakingSaga() {
	yield takeEvery(Actions.PLAYER_CONNECTED, onPlayerConnected)
	yield takeEvery(Actions.PLAYER_DISCONNECTED, onPlayerDisconnected)
	yield takeEvery(Actions.PLAYER_FIND_RANDOM_MATCH, onPlayerFindRandomMatch)
	yield takeEvery("GAME_STARTED", onGameStart)
}

function* rootSaga() {
	console.log("Running root saga")
	yield all([
		fork(matchmakingSaga)
	])
}

export default rootSaga