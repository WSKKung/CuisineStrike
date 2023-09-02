export enum Actions {
	/** player connected to the server */
	PLAYER_CONNECTED = "PLAYER_CONNECTED", 
	/** player disconnected from the server */
	PLAYER_DISCONNECTED = "PLAYER_DISCONNECTED",
	/** player asks to be queue for a random match */
	PLAYER_FIND_RANDOM_MATCH = "PLAYER_FIND_RANDOM_MATCH",
	/** player asks to join an existing match */
	PLAYER_JOIN_MATCH = "PLAYER_JOIN_MATCH",

	/** player ready for a Duel to begin */
	PLAYER_GAME_READY = "PLAYER_GAME_READY"

}