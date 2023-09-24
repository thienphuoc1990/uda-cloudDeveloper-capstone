jest.doMock('aws-xray-sdk', () => {
    return {
        captureAWS: jest.fn()
    };
});