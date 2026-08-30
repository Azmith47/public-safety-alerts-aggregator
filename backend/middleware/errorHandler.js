import { logEvents } from "./logEvents.js";

const errorHandler = (err, req, res, next) => {
	logEvents(`${err.name}: ${err.message}`, "errLog.txt");
	console.error(err.stack);

	if (res.headersSent) {
		return next(err);
	}

	res.status(500).json({
		message: "Internal server error",
		error: err.message,
	});
};

export default errorHandler;
