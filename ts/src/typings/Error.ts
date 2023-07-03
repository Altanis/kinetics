export class InternalError extends Error {
    name = "InternalError";
    constructor(message: string) {
        super("[SYSTEM]: Whoops, something went wrong! Please report it at our GitHub page: " + message);
    }
};

export class ConfigurationError extends Error {
    name = "ConfigurationError";
    constructor(message: string) {
        super("[SYSTEM]: An error occurred when configuring an Entity or the System: " + message);
    }
};