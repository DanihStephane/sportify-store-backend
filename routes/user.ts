import { UserController } from '../app/controllers';
import ResponseHelper from '../app/helpers/response.helper';

export const RouteUser = (app, rateLimit) => {
	const user = new UserController();

	app.register((route) => {
		route.get(
			'/:userId',
			{
				onRequest: app.csrf,
				preHandler: [
					app.authenticate
				],
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await user.findById(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
		
		route.put(
			'/information/update/:userId',
			{
				onRequest: app.csrf,
				preHandler: [
					app.authenticate
				],
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await user.updateInformation(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
		
		route.get(
			'/orderByUserId/:userId',
			{
				onRequest: app.csrf,
				preHandler: [
					app.authenticate
				],
				...rateLimit
			},
			async (request, reply) => {
				const { data, message, status } = await user.orderByUserId(request);
				return ResponseHelper.sendResponseController(reply, { status, message, data });
			}
		);
	}, { prefix: 'user/' });
}