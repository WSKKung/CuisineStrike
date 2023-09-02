import { Server } from "http";
import { WebSocketServer } from "ws";
import store from "./stores";
import { playerDisconnected, playerConnected, Actions } from "./actions";
import { Player } from "./models/player";
import appState from "./models/root";
import { verifyToken } from "./middlewares/account";

export function createWebSocketServer(server: Server) {

	const wss = new WebSocketServer({
		server: server,
		//TODO: Make all communication with player thorugh socket instead? So authentication process will be moved to here instead.
		verifyClient: async ({ req }, callback) => {
			// require JWT token in the query params
			if (!req.headers.authorization) {
				callback(false, 401, "Missing authorization token")
				return
			}

			let token = req.headers.authorization.split(" ")[1]

			// verify token
			try {
				let tokenPayload = await verifyToken(token)
				// @ts-ignore
				req.body = { user: tokenPayload }
				callback(true)
			}
			catch (err) {
				callback(false, 401, "Authorization failed")
			}
			
		}

	})

	wss.on('connection', (socket, req) => {

		// @ts-ignore
		let userId = req.body.user.id

		// get player object of who is connecting (in case of reconnection to a running game)
		let player = appState.players.find(p => p.id === userId)
		// or create a new player object
		if (!player) {
			player = new Player()
			player.id = userId
			player.name = `Player ${userId}`
			appState.players.push(player)
		}

		player.socket = socket
		appState.sockets[player.id] = socket
		store.dispatch(playerConnected(player, socket))

		socket.on('message', (data) => {
			var dataStr = data.toString()
			try {
				var msgJson = JSON.parse(dataStr)
				console.log(`Got message from client: ${dataStr}`)
				if (!msgJson.type) {
					socket.send(JSON.stringify({ error: true, message: "Missing message type" }))
					return
				}
				if (!Object.keys(Actions).includes(msgJson.type)) {
					socket.send(JSON.stringify({ error: true, message: `Unknown message type: ${msgJson.type}` }))
					return
				}
				store.dispatch({ type: msgJson.type, player: player, ...msgJson })
			} catch (e) {
				console.log(`Cannot parse message from client: ${dataStr}`)
			}
		})

		socket.on('close', (code, reason) => {
			player.socket = null
			appState.sockets[player.id] = null
			store.dispatch(playerDisconnected(player))
		})

	})

	return wss
}