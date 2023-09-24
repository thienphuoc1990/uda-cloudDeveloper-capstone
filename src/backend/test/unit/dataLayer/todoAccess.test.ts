import { setMockResponse } from '../../mock/dynamodb';
import '../../mock/xray';
import { getTodosForUser } from '../../../dataLayer/todosAccess';

describe('todosAccess', () => {
    describe('getTodosForUser', () => {
        it('return empty todos list', async () => {
            expect(await getTodosForUser('userId')).toEqual([]);
        });

        it('return all data get from db', async () => {
            const expectedData = [{
                "todoId": "2af0d5bc-df9b-4ff0-ba52-7f4a0605a46b",
                "attachmentUrl": "https://thienphuoc1990-serverless-fs-todo-app-image-dev.s3.amazonaws.com/auth0|61d088c6f64d4a0072b22c14-2af0d5bc-df9b-4ff0-ba52-7f4a0605a46b",
                "userId": "auth0|61d088c6f64d4a0072b22c14",
                "dueDate": "2023-10-01",
                "createdAt": "2023-09-24",
                "name": "To not create empty attachment url",
                "done": true
            },
            {
                "todoId": "62495ec2-cbb6-4ff5-b903-9082dabce90e",
                "userId": "auth0|61d088c6f64d4a0072b22c14",
                "dueDate": "2023-10-01",
                "createdAt": "2023-09-24",
                "name": "To test not create item with empty attachment url",
                "done": false
            }];
            setMockResponse({
                Items: expectedData,
            });
            
            expect(await getTodosForUser('userId')).toEqual(expectedData);
        });
    });
});