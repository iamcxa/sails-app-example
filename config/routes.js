module.exports.routes = {
  'get /test': 'ExampleController.Test',
  'get /api/example/test': 'ExampleController.Test',

  'get /api/app/topics': 'TopicController.Query',
  'get /api/app/topic/:id': 'TopicController.Detail',
  'post /api/app/topic': 'TopicController.Create',
  'put /api/app/topic/:id': 'TopicController.Update',
  'delete /api/app/topics': 'TopicController.Destroy',
};
