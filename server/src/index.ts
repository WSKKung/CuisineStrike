import express from "express";
import http from "http";
import config from "./configs/config";
import router from "./routers/routes";
import { createWebSocketServer } from "./sockets";

// Web Server
const app = express()
const port = config.serverPort

// HTTP body parser
app.use(express.json())

// Routes HTTP request
app.use(router)

// Create WebSocket Server
const server = http.createServer(app)
createWebSocketServer(server)

// Start server
server.listen(port, () => {
	console.log(`Running server on port ${port}`)
})