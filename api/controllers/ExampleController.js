export async function Test(req, res) {
  try {
    sails.log('test method on ExampleController');
    sails.log('test auto reload!!!!!!!!!!!!!!!!!!!!!!!');
    return res.ok({
      message: 'success',
      information: ExampleService.getInformation(),
    });
  } catch (e) {
    sails.log(e);
    return res.error(e);
  }
}

export default {
  Test,
};
