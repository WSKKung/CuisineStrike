/**
 * These events are fired client-side from player action
 */

import { Action } from "redux";
import { WebSocket } from "ws";
import { Player } from "../models/player";
import { Actions } from "./types";

export interface PlayerAction extends Action { player: Player }
export interface PlayerConnectedAction extends PlayerAction { socket: WebSocket }
export interface PlayerDisconnectedAction extends PlayerAction {}
export interface PlayerFindRandomMatchAction extends PlayerAction {}
export interface PlayerJoinMatchAction extends PlayerAction {}

export interface PlayerGameReadyAction extends PlayerAction {}

export interface PlayerSetIngredientAction extends PlayerAction {
	/** Ingredient card being played */
	card: any, 
	/** Column number of zone to place the played card */
	column: number
}

export interface PlayerPlayActionCardAction extends PlayerAction {
	/** Action card being played */
	card: any
}

export interface PlayerCookSummonAction extends PlayerAction {
	/** Dish card being summoned */
	card: any, 
	/** Ingredient cards used as a material for the summon */
	materials: any[], 
	/** Column number of zone to place the summoned card */
	column: number
}

export interface PlayerDeclareAttackAction extends PlayerAction {
	/** Dish card to attack with */
	card: any, 
	/** Target dish card of the attack, or direct attack if not set */
	attackTarget?: any
}

export interface PlayerSelectAbilityTargetAction extends PlayerAction {
	/** Target cards for the ability */
	targets: any[]
}

export interface PlayerEndTurnAction extends PlayerAction {}

export function playerConnected(player: Player, socket: WebSocket): PlayerConnectedAction {
	return { type: Actions.PLAYER_CONNECTED, player, socket }
}

export function playerDisconnected(player: Player): PlayerDisconnectedAction {
	return { type: Actions.PLAYER_DISCONNECTED, player }
}

export function playerFindRandomMatch(player: Player): PlayerFindRandomMatchAction {
	return { type: Actions.PLAYER_FIND_RANDOM_MATCH, player }
}

export function playerGameReady(player: Player): PlayerAction {
	return { type: Actions.PLAYER_GAME_READY, player }
}