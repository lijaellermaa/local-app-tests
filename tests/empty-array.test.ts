// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import {StatusCodes} from 'http-status-codes';
import {UserDTO} from "../src/DTO/UserDTO";

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API - all users (empty array test)', () => {

    test('all users: should return empty array when no users', async ({request}) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.OK);

        const responseBody: Array<UserDTO> = await response.json();
        expect(responseBody.length).toBe(0);
        expect(responseBody).toBeInstanceOf(Array);
    });

});
