import { AuthController } from '../app/controllers';
import ResponseHelper from '../app/helpers/response.helper';
import { logout } from '../app/middleware/auth.middleware';

export const RouteAuth = (app, rateLimit) => {
	const auth = new AuthController();

	app.register((route) => {
		route.post(
			'/login',
			{
				onRequest: app.csrf,
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await auth.doLogin(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
		
		route.post(
			'/logout',
			{
				onRequest: app.csrf,
				preHandler: [
					app.authenticate,
				],
				...rateLimit
			},
			async (request, reply) => {
				return await logout(request, reply);
			}
		);
		
		route.post(
			'/register',
			{
				onRequest: app.csrf,
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await auth.doRegister(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
	}, { prefix: '' });
}