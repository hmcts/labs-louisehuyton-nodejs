import { fail } from 'assert';
import axios, { AxiosResponse } from 'axios';

jest.retryTimes(20); // 20 retries at 1 second intervals
jest.setTimeout(15000);
const testUrl = process.env.TEST_URL || 'https://localhost:8080'
const servicesToCheck = [
  { name: 'Default Page Template', url: 'http://localhost:8080', heading: '<h1 class="govuk-heading-xl">Default page template</h1>', },
  //add more services here when created
];

describe('Smoke Test', () => {
  describe('Health Check', () => {
    describe.each(servicesToCheck)('Required services should return 200 status UP', ({ name, url }) => {
      const parsedUrl = new URL('/health', url as string).toString();
      test(`${name}: ${url}`, async () => { // eslint-disable-line @typescript-eslint/no-empty-function
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
              setTimeout(() => reject(`'${name}' endpoint is not up: '${parsedUrl}': ${e}`), 1000)
            );
          }
        };
        await expect(checkService()).resolves.not.toThrow();
      });
    });
  });

  describe('UI Test', () => {
    describe.each(servicesToCheck)('Required services should have a heading present with the correct text displayed', ({ name, url, heading }) => {
      test(`${name}`, async () => { // eslint-disable-line @typescript-eslint/no-empty-function
        try {
          const response: AxiosResponse = await axios.get(url, {
            headers: {
              'Accept-Encoding': 'gzip',
              accept: 'application/json',
            },
          });
          if (!response.data.includes(heading)) {
            console.log(response.data)
            throw new Error(` Heading ${heading} not present and/or correct`)
          }
        } catch (e) {
          fail(e);
        }
      });
    });
  });
});
