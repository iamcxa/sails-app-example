/* eslint no-unused-expressions: 0 */
import faker from 'faker';

faker.seed(parseInt(Math.random().toString().split('.').pop(), 10));

const apiPrefix = 'api';
const version = '';
const area = '/app';

describe.skip('about TopicController operations.', () => {
  let memberWithTopicAndPosts;
  let users;

  before('before Test TopicController operations.', async () => {
    try {
      sails.log.debug('=== Create Seed Topics for spec testing ===');
      users = await SeedHelper.create({
        size: 3,
        model: User,
        data: i => ({
          username: `topic.user.${i + 1}`,
          email: `topic.user${i + 1}@gmail.com`,
          isActivated: true,
          isConfirmed: true,
          Passports: {
            provider: 'local',
            password: 'user',
          },
        }),
        include: [
          Passport,
        ],
      });
      memberWithTopicAndPosts = await SeedHelper.create({
        size: 10,
        model: Member,
        data: i => ({
          nickname: `spec.user.${i + 1}`,
          Topics: {
            title: `spec.title.${i + 1}`,
            content: `spec.topic.content ${i + 1}`,
            Posts: {
              content: `spec.post.content ${i + 1}`,
            },
          },
        }),
        include: [
          {
            model: Topic,
            include: [Post],
          },
        ],
      });
      // console.log('topic.length=>', memberWithTopicAndPosts.length);
    } catch (e) {
      throw e;
    }
  });

  beforeEach('', async () => {
    SpecHelper.mockLogin(users[0]);
  });

  afterEach('', async () => {
    SpecHelper.unMockLogin();
  });

  it('User login and request API should success', async () => {
    const test = async (user) => {
      const result = await request(sails.hooks.http.app)
        .post('/api/auth/login/local')
        .send({
          identifier: user.username,
          password: 'user',
        })
        .expect(200);
      console.log('result===>', result.body);
      result.body.success.should.be.equal(true);
      result.body.data.should.be.an('object');
      result.body.data.Authorization.should.be.a('string');
      result.body.data.user.username.should.be.a('string');
      result.body.data.user.id.should.be.a('number');
      result.body.data.user.id.should.be.equal(user.id);

      const apiResult = await request(sails.hooks.http.app)
        .get(`/${apiPrefix}${version}${area}/topics`)
        .set('Authorization', result.body.data.Authorization)
        .expect(200);
      sails.log.debug('======== Topic List ========');
      console.dir(apiResult.body);
      sails.log.debug('======== Topic List ========');
      apiResult.body.success.should.be.equal(true);
      apiResult.body.message.should.be.equal('success');
      apiResult.body.data.paging.should.be.an('object');
      apiResult.body.data.paging.sort.should.be.eq('DESC');
      apiResult.body.data.paging.curPage.should.be.eq(1);
      apiResult.body.data.paging.perPage.should.be.eq(10);
      apiResult.body.data.paging.total.should.be.eq(memberWithTopicAndPosts.length);
    };
    console.log('======== user login and request API ========');
    await Promise.all(users.map(user => test(user)));
    console.log('======== user login and request API ========');
  });

  it('Get Topic List without filter from server should success', async () => {
    const result = await request(sails.hooks.http.app)
      .get(`/${apiPrefix}${version}${area}/topics`)
      // send nothing
      // default perPage=10, curPage=1, sort=DESC
      .query({
      })
      // expect return response code 200
      .expect(200);

    sails.log.debug('======== Topic List ========');
    console.dir(result.body);
    sails.log.debug('======== Topic List ========');

    result.body.success.should.be.equal(true);
    result.body.message.should.be.equal('success');
    result.body.data.paging.should.be.an('object');
    result.body.data.paging.sort.should.be.eq('DESC');
    result.body.data.paging.curPage.should.be.eq(1);
    result.body.data.paging.perPage.should.be.eq(10);
    result.body.data.paging.total.should.be.eq(memberWithTopicAndPosts.length);
    result.body.data.items.should.be.an('array');
    // verify each item
    result.body.data.items.forEach((item) => {
      item.id.should.be.a('number');
      item.title.should.be.a('string');
      item.content.should.be.a('string');
      item.createdAt.should.be.a('string');
      // verify null
      should.not.exist(item.deletedAt);
      item.MemberId.should.be.a('number');
      item.Posts.should.be.a('array');
      item.Posts.forEach((post) => {
        post.id.should.be.a('number');
        post.content.should.be.a('string');
        post.TopicId.should.be.a('number');
      });
    });
  });

  it('Get Topic Detail from server should success', async () => {
    const result = await request(sails.hooks.http.app)
      .get(`/${apiPrefix}${version}${area}/topic/${memberWithTopicAndPosts[0].Topics[0].id}`)
      .expect(200);

    sails.log.debug('======== Topic Detail ========');
    console.dir(result.body);
    sails.log.debug('======== Topic Detail ========');

    result.body.success.should.be.equal(true);
    result.body.message.should.be.equal('success');
    result.body.data.id.should.be.a('number');
    result.body.data.id.should.be.equal(memberWithTopicAndPosts[0].Topics[0].id);
    result.body.data.title.should.be.a('string');
    result.body.data.title.should.be.equal(memberWithTopicAndPosts[0].Topics[0].title);
    result.body.data.content.should.be.a('string');
    result.body.data.content.should.be.equal(memberWithTopicAndPosts[0].Topics[0].content);
    result.body.data.MemberId.should.be.equal(memberWithTopicAndPosts[0].id);
    result.body.data.Posts.should.be.a('array');
    result.body.data.Posts.length.should.be.equal(1);
  });

  it('Create Topic to server should success', async () => {
    const topicData = {
      title: 'spec.new.topic.title',
      content: 'spec.new.topic.content',
      Posts: [{
        content: 'spec.new.post.content',
      }],
    };
    const result = await request(sails.hooks.http.app)
      .post(`/${apiPrefix}${version}${area}/topic`)
      .send({
        data: topicData,
      })
      .expect(200);

    sails.log.debug('======== New Topic ========');
    console.dir(result.body);
    sails.log.debug('======== New Topic ========');

    result.body.success.should.be.equal(true);
    result.body.message.should.be.equal('success');
    result.body.data.id.should.be.a('number');
    result.body.data.title.should.be.a('string');
    result.body.data.title.should.be.equal(topicData.title);
    result.body.data.content.should.be.a('string');
    result.body.data.content.should.be.equal(topicData.content);
    result.body.data.Posts.should.be.a('array');
    result.body.data.Posts.length.should.be.equal(1);
  });

  it('Update Topic to server should success', async () => {
    const memberWithTopic = await SeedHelper.create({
      size: 1,
      model: Member,
      data: i => ({
        nickname: `spec.update.before.user.${i + 1}`,
        Topics: [{
          title: `spec.update.before.title.${i + 1}`,
          content: `spec.update.before.topic.content ${i + 1}`,
        }],
      }),
      include: [
        {
          model: Topic,
        },
      ],
    });
    const newTopicData = {
      title: 'spec.update.after.title',
      content: 'spec.update.after.content',
    };
    const result = await request(sails.hooks.http.app)
      .put(`/${apiPrefix}${version}${area}/topic/${memberWithTopic[0].Topics[0].id}`)
      .send({
        data: newTopicData,
      })
      .expect(200);

    sails.log.debug('======== updated Topic ========');
    console.dir(result.body);
    sails.log.debug('======== updated Topic ========');

    result.body.success.should.be.equal(true);
    result.body.message.should.be.equal('success');
    result.body.data.id.should.be.a('number');
    result.body.data.title.should.be.a('string');
    result.body.data.title.should.be.equal(newTopicData.title);
    result.body.data.content.should.be.a('string');
    result.body.data.content.should.be.equal(newTopicData.content);
    result.body.data.Posts.should.be.a('array');
    result.body.data.Posts.length.should.be.equal(0);
  });

  it('Destroy a Topic on server should success', async () => {
    const memberWithTopic = await SeedHelper.create({
      size: 1,
      model: Member,
      data: i => ({
        nickname: `spec.delete.user.${i + 1}`,
        Topics: [{
          title: `spec.delete.title.${i + 1}`,
          content: `spec.delete.topic.content ${i + 1}`,
        }],
      }),
      include: [
        {
          model: Topic,
        },
      ],
    });
    const result = await request(sails.hooks.http.app)
      .delete(`/${apiPrefix}${version}${area}/topics`)
      .send({
        data: [memberWithTopic[0].Topics[0].id],
      })
      .expect(200);

    sails.log.debug('======== deleted Topic ========');
    console.dir(result.body);
    sails.log.debug('======== deleted Topic ========');

    result.body.success.should.be.equal(true);
    result.body.message.should.be.equal('success');
  });
});
