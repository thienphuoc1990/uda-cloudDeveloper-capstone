let mockResponse = {
    Items: [],
};

const mockDynamoDbQuery = jest.fn().mockImplementation(() => {
    return {
        promise() {
            return Promise.resolve(mockResponse);
        }
    };
});

jest.doMock('aws-sdk/clients/dynamodb', () => {
    return {
        DocumentClient: jest.fn(() => ({
            query: mockDynamoDbQuery
        }))
    };
});

const setMockResponse = (response) => {
    mockResponse = response;
}

export {setMockResponse}