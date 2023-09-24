import { CustomAuthorizerEvent } from 'aws-lambda';
import { MockAxios } from '../../mock/axios';
import { logger } from '../../mock/log';
import { getInput, getMockResponse } from '../../fixture/helper';
import { handler } from '../../../lambda/auth/auth0Authorizer';

function mockAxiosDefault() {
    MockAxios.onGet(
        new RegExp(`${process.env.AUTH0_APP_DOMAIN}/.well-known/jwks.json`)
    ).reply(200, getMockResponse('jwks'));
}

describe('auth0Authorizer', () => {
    let event: CustomAuthorizerEvent;

    beforeEach(() => {
        MockAxios.reset();
        mockAxiosDefault();
        logger.info.mockReset();
        logger.error.mockReset();
        event = getInput('auth');
    });

    it(`return authorizer failed when jwks doest not have the matched signingKey`, async () => {
        MockAxios.onGet(
            new RegExp(`${process.env.AUTH0_APP_DOMAIN}/.well-known/jwks.json`)
        ).reply(200, getMockResponse('jwks.wrongKid'));

        expect(await handler(event)).toEqual({
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        });
        expect(logger.error).toHaveBeenCalledWith("User not authorized", {"error": "Unable to find a signing key that matches 'ovLKFA04ay6KUAwa2CgEk'"});
    });

    it(`return authorizer failed when jwks doest not have signingKeys`, async () => {
        MockAxios.onGet(
            new RegExp(`${process.env.AUTH0_APP_DOMAIN}/.well-known/jwks.json`)
        ).reply(200, getMockResponse('jwks.invalid'));

        expect(await handler(event)).toEqual({
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        });
        expect(logger.error).toHaveBeenCalledWith("User not authorized", {"error": "The JWKS endpoint did not contain any signature verification keys"});
    });

    it(`return authorizer failed when jwks empty`, async () => {
        MockAxios.onGet(
            new RegExp(`${process.env.AUTH0_APP_DOMAIN}/.well-known/jwks.json`)
        ).reply(200, {});

        expect(await handler(event)).toEqual({
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        });
        expect(logger.error).toHaveBeenCalledWith("User not authorized", {"error": "The JWKS endpoint did not contain any keys"});
    });

    it(`return authorizer failed when miss event.authorizationToken`, async () => {
        delete event.authorizationToken;
        expect(await handler(event)).toEqual({
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        });
        expect(logger.error).toHaveBeenCalledWith("User not authorized", {"error": "No authentication header"});
    });

    it(`return successful`, async () => {
        expect(await handler(event)).toEqual({
            principalId: 'auth0|61d088c6f64d4a0072b22c14',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        });
        expect(logger.info).toHaveBeenCalledWith("User was authorized", {"at_hash": "N3cjj7l6jRcl8WFhpFqp3w", "aud": "0qkkCQBnQyNtZqJeSu2D1FufaYccX73d", "exp": 1695596032, "iat": 1695560032, "iss": "https://dev-5enywhhb.us.auth0.com/", "nonce": "1-6LfE-HnaRhycSSJadDflmVTMnGISsr", "sid": "JLIcluDwXwRUofpeK3qUvigpoEviDRIa", "sub": "auth0|61d088c6f64d4a0072b22c14"});
    });
});