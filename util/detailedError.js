class DetailedError extends Error {
	constructor(errorCode, errorId, errorMessage, ...params) {
		// Pass remaining params to super constructor
		super(...params);

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, DetailedError);
		}

		this.name = 'DetailedError';
		this.errorCode = errorCode;
		this.errorId = errorId;
		this.errorMessage = errorMessage;
	}
}

module.exports = DetailedError;