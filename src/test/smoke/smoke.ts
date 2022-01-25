import axios, { AxiosResponse } from 'axios';
import { sampleCheck } from '../../main/routes/health.ts';

jest.retryTimes(20); // 20 retries at 1 second intervals
jest.setTimeout(15000);

const servicesToCheck = [
  { name: 'Default Page', url: 'http://localhost:8080' },
];

describe('Smoke Test', () => {
  describe('Health Check', () => {
    describe.each(servicesToCheck)('Required services should return 200 status UP', ({ name, url }) => {
      const parsedUrl = new URL('/health', url as string).toString();

      test(`${name}: ${parsedUrl}`, async () => {
        const checkService = async () => {
          try {
            const response: AxiosResponse<sampleCheck> = await axios.get(parsedUrl, {
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
});