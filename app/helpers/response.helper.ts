export default class ResponseHelper {
	/**
	 * Send valid response
	 * @param result Result data
	 * @param message Optional message
	 * @param code Optional status code
	 * @returns Response JSON with result and message
	 */
	static sendResponse<T>(
		result: T,
		message: string | null = null,
		code: number = 200
	): any {
		let response = {
			status: code,
			message: message || '',  // Set to an empty string if no message is provided
			data: result,            // Nest the `result` inside `data`
		}
		
		return response;
	}

	/**
	 * Send response error
	 * @param error Error message
	 * @param code HTTP error code
	 * @returns Response JSON with error
	 */
	static sendError(error: string, code: number = 404) {
		const response: any = {
			status: code,
			message: error,
		};

		return response;
	}
	
	static sendResponseController(reply, { status, message, data }: { status: number, message?: string, data?: any }) {
		const responsePayload = { status, message, data }
		
		// Only include 'data' if it is not null or undefined
		if (data !== null && data !== undefined) {
			responsePayload.data = data;
		}else{
			responsePayload.data = {};
		}
		
		reply.code(status).send(responsePayload);
	}
}