'use strict';

import Fastify from 'fastify';
import Routes from "./routes/routes";
import { config } from 'dotenv';
import { authorize } from './app/middleware/auth.middleware';
import csrf from '@fastify/csrf-protection';
import RateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';

// Load environment variables from .env file
config();

const app = Fastify({ logger: false });
const port = parseInt(`${process.env.PORT}`, 10) || 3000;
const host = process.env.HOST || '127.0.0.1';

/**
 * Initialize the server
 */
const start = async () => {
	// register plugins
	await app
		.register(RateLimit, {
			global: false, //disable that for customize rate limit per action route
			max: 1000,
			timeWindow: 1000 * 5 //5s
		})
		.register(csrf, { cookieOpts: { signed: true } })
		.register(cors, { methods: ['GET', 'PUT', 'POST', 'DELETE'] })
		.register(cookie, { secret: process.env.COOKIE })
		.decorate('authenticate', authorize);

	// Define the server's routes
	const routes = new Routes();
	await routes.defineRoutes(app);

	// Listen to the specified port
	await app.listen({ host: host, port: port }, (err, address) => {
		// If there is an error, print it and exit the process
		if (err) {
			console.error(err);
			process.exit(1);
		}

		// Log the server's address
		console.log(`Server listening at ${address}`);
	});
}

start();