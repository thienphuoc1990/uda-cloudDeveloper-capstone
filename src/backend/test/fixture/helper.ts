import * as fs from 'fs';

export function getInput(type: string): any {
    const file = fs.readFileSync(
        `${process.env.PWD}/src/backend/test/fixture/event/${type}.json`
    );

    return JSON.parse(file.toString());
}

export function getMockResponse(type: string): any {
    const file = fs.readFileSync(
        `${process.env.PWD}/src/backend/test/fixture/response/${type}.json`
    );

    return JSON.parse(file.toString());
}