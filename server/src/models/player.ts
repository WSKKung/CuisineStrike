import { WebSocket } from "ws"

export class Player {
	id: number
	name: string
	socket: WebSocket
}

export interface PlayerAccount {
	id: number
	username: string
	password: string
	role: string
}