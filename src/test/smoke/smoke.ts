import { fail } from 'assert';
import axios, { AxiosResponse } from 'axios';

jest.retryTimes(20); // 20 retries at 1 second intervals
jest.setTimeout(15000);
const testUrl = process.env.TEST_URL || 'http://localhost:8080'

describe('Smoke Test', () => {
    describe('Required services should return 200 status UP', () => {
      const parsedUrl = new URL('/health', testUrl as string).toString();
      test(`${testUrl}`, async () => { // eslint-disable-line @typescript-eslint/no-empty-function
        const checkService = async () => {
          try {
            const response: AxiosResponse = await axios.get(parsedUrl, {
              headers: {
                'Accept-Encoding': 'gzip',
                accept: 'application/json',
              },
            });
            if (response.status !== 200 || response.data?.status !== 'UP') {
              throw new Error(`Status: ${response.status} Data: '${JSON.stringify(response.data)}'`);
            }
          } catch (e) {
            await new Promise((resolve, reject) =>
              setTimeout(() => reject(`Endpoint is not up: '${parsedUrl}': ${e}`), 1000)
            );
          }
        };
        await expect(checkService()).resolves.not.toThrow();
      });
    });
  });

  describe('UI Test', () => {
    describe('Required services should have a heading present with the correct text displayed', () => {
      test(`${testUrl}`, async () => { // eslint-disable-line @typescript-eslint/no-empty-function
        try {
          const response: AxiosResponse = await axios.get(testUrl, {
            headers: {
              'Accept-Encoding': 'gzip',
              accept: 'application/json',
            },
          });
          if (!response.data.includes('<h1 class="govuk-heading-xl">Default page template</h1>')) {
            console.log(response.data)
            throw new Error(` Heading not present and/or correct`)
          }
        } catch (e) {
          fail(e);
        }
      });
    });
  });
