/* eslint no-unused-expressions: 0 */
import faker from 'faker';

faker.seed(parseInt(Math.random().toString().split('.').pop(), 10));

const apiPrefix = 'api';
const version = '';
const area = '/example';

describe.skip('about ExampleController operations.', () => {
  before('before Test ExampleController operations.', async () => {
    try {
      sails.log.debug('=== do nothing ===');
    } catch (e) {
      throw e;
    }
  });

  it('Get Test information from server should success', async () => {
    const result = await request(sails.hooks.http.app)
      .get(`/${apiPrefix}${version}${area}/test`)
      // send nothing
      .query({
      })
      // expect return response code 200
      .expect(200);

    sails.log.debug('======== Test information ========');
    console.dir(result.body);
    sails.log.debug('======== Test information ========');

    const hook = sails.hooks['sails-app-example'];

    result.body.success.should.be.equal(true);
    result.body.message.should.be.equal('success');
    result.body.information.identity.should.be.eq(hook.identity);
    result.body.information.config.toString().should.be.eq(hook.config.toString());
  });
});
