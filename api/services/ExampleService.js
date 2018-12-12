module.exports = {
  /**
   * Method Can be merge on ExampleService.js file on your sails server
   * @param {Any} just data
   * @returns {Any} Return Inputs
   */
  test(data) {
    try {
      sails.log('test method on ExampleService');
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   *
   * @returns {Object} App Information
   */
  getInformation() {
    try {
      // console.log('sails.hooks=>', sails.hooks);
      const hook = sails.hooks['sails-app-example'];
      return {
        identity: hook.identity,
        config: hook.config,
      };
    } catch (e) {
      throw e;
    }
  },
};
