/* eslint no-unused-expressions: 0 */
import faker from 'faker';

faker.seed(parseInt(Math.random().toString().split('.').pop(), 10));

describe.skip('about ExampleService operations.', () => {
  before('before Test ExampleService operations.', async () => {
    try {
      sails.log.debug('=== do nothing ===');
    } catch (e) {
      throw e;
    }
  });

  it('Get Test information from server should success', async () => {
    const result = ExampleService.getInformation();

    sails.log.debug('======== Test information ========');
    console.dir(result);
    sails.log.debug('======== Test information ========');

    const hook = sails.hooks['sails-app-example'];

    result.identity.should.be.eq(hook.identity);
    result.config.toString().should.be.eq(hook.config.toString());
  });
});
