export default async function () {
  try {
    console.log('bootstrap project-example!');
    const member = await SeedHelper.create({
      size: 1,
      model: Member,
      data: () => ({
        nickname: 'user 0',
      }),
    });
    await SeedHelper.create({
      size: 10,
      model: Member,
      data: i => ({
        nickname: `user ${i + 1}`,
        Topics: {
          title: `title ${i + 1}`,
          content: `topic content ${i + 1}`,
          Posts: {
            content: `post content ${i + 1}`,
            MemberId: member[0].id,
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
    return true;
  } catch (e) {
    sails.log.error(e);
    throw e;
  }
}
