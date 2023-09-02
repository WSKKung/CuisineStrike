import { Request, Response, NextFunction } from "express";
import { PlayerAccount } from "../models/player";
import { hashSync, hash, compare } from "bcrypt";
import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../configs/config";

// TODO: use generated salt instead!
const hashSalt = 10
// TODO: replace with database access instead
const users: PlayerAccount[] = [
	{ id: 1, username: "aaa", password: hashSync("aaa", hashSalt), role: "admin" },
	{ id: 2, username: "bbb", password: hashSync("bbb", hashSalt), role: "user" },
	{ id: 3, username: "ccc", password: hashSync("ccc", hashSalt), role: "user" }
]

export async function register(req: Request, res: Response) {
	const { username, password } = req.body
	if (!username || !password) {
		res.status(400).send({
			message: "username and/or password missing"
		})
		return
	}

	// check if username already exist
	if (users.find(acc => acc.username === username)) {
		res.status(400).send({
			message: "username is already in used"
		})
		return
	}

	// add user
	let userId = users.length + 1
	let hashedPassword = await hash(password, hashSalt)
	users.push({
		id: userId,
		username: username,
		password: hashedPassword,
		role: "user"
	})

	res.status(200).send({
		message: "register success",
		token: ""
	})
}

export async function authenticate(req: Request, res: Response) {
	const { username, password } = req.body
	if (!username) {
		res.status(400).send({
			message: "username missing"
		})
		return
	}
	
	// find account with specified username
	let account: PlayerAccount = users.find(acc => acc.username === username)
	if (!account) {
		res.status(400).send({
			message: "account with specified username does not exist"
		})
		return
	}

	// compare password
	let passwordMatched = await compare(password, account.password)
	if (!passwordMatched) {
		res.status(400).send({
			message: "password does not match"
		})
		return
	}

	// gen JWT token for user
	let jwtSignOptions: SignOptions = {
		expiresIn: 60 * 60 // 1 hour
	}
	let token = jwt.sign({ id: account.id }, config.jwtSecret, jwtSignOptions)

	// success, returning token and account data back
	res.status(200).send({
		message: "login success",
		token: token,
		user: { id: account.id }
	})
}

export async function verifyToken(token: string): Promise<any> {
	return jwt.verify(token, config.jwtSecret)
}

export async function authorize(req: Request, res: Response, next: NextFunction) {
	let auth = req.headers.authorization
	if (!auth) {
		res.status(401).send({
			message: "authorization token missing"
		})
		return
	}

	// get token
	let token = auth.split(" ")[1]

	// verify token
	try {
		// attach decoded token user data to request body
		req.body.user = await verifyToken(token)
		next()
	}
	catch (err) {
		res.status(401).send({
			message: "authorization failed"
		})
		return
	}
	
}

export async function fetchProfile(req: Request, res: Response) {
	// get user id
	let { id } = req.body.user
	if (!id) {
		res.status(400).send({
			message: "account id missing"
		})
		return
	}

	let account: PlayerAccount = users.find(acc => acc.id === id)
	if (!account) {
		res.status(400).send({
			message: "account with specified id does not exist"
		})
		return
	}

	// fetch user account
	res.status(200).send({
		user: {
			username: account.username,
			role: account.role
		}
	})
}