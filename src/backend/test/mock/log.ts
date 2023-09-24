const logger = {
    info: jest.fn(),
    error: jest.fn()
};

// trying to mock createLogger to return a specific logger instance
jest.mock("winston", () => ({
    format: {
        json: jest.fn()
    },
    createLogger: jest.fn().mockReturnValue(logger),
    transports: {
        Console: jest.fn()
    }
}));

export { logger }