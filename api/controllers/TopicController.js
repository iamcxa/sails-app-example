import moment from 'moment';

const modelName = 'Topic';
const message = 'success';
const dateFormat = 'YYYY-MM-DD HH:mm';

export async function Detail(req, res) {
  sails.log(`=== API:${modelName}Controller:detail ===`);
  try {
    const {
      id,
      langCode = res.langCode(),
    } = req.allParams();
    const inputHasNull = ValidatorHelper.checkNull({
      id,
    });
    if (inputHasNull) {
      throw Error(MESSAGE.BAD_REQUEST.NO_REQUIRED_PARAMETER({ inputHasNull }));
    }
    const include = [
      { model: Post },
      { model: Member },
    ];
    const data = await QueryHelper.getDetail({
      langCode,
      modelName,
      where: { id },
      attributes: null,
      include,
    }, {
      view: false,
      required: null,
      readonly: null,
      format: null,
      formatCb: e => ({
        ...e,
        createdAt: moment(e.createdAt).format('YYYY-MM-DD'),
        updatedAt: moment(e.updatedAt).format('YYYY-MM-DD'),
        deletedAt: moment(e.deletedAt).format('YYYY-MM-DD'),
      }),
    });
    return res.ok({
      message,
      data: {
        ...data,
      },
    });
  } catch (e) {
    return res.error(e);
  }
}

export async function Query(req, res) {
  sails.log(`=== API:${modelName}Controller:query ===`);
  try {
    const {
      search,
      curPage,
      perPage,
      fields,
      sort,
      sortBy,
    } = req.allParams();
    const include = [
      { model: Post },
      { model: Member },
    ];
    const data = await QueryHelper.findBy({
      // target model name, in string format.
      modelName,
      // query within model associations.
      include,
    }, {
      // the filter object is define how QueryHelper will get you data.
      filter: {
        // pairs of model column-value that want to filter.
        // e.g. [{ key: 'Topic.title', value: 'title 1' }]
        fields,
        search: {
          // The Keyword wants to search
          keyword: search,
          // The table column wants to search
          fields: null,
          // Extra Association columns will be search, include model name.
          // and need to be inside include object.
          // e.g. ['Post.content']
          extra: [],
        },
      },
      curPage,
      perPage,
      sort,
      sortBy,
    }, {
      // to disable QueryHelper output view component config,
      // this is default set to false.
      view: false,
      formatCb: e => ({
        ...e,
        createdAt: moment(e.createdAt).format(dateFormat),
        updatedAt: moment(e.updatedAt).format(dateFormat),
      }),
    });
    return res.ok({
      message,
      data,
    });
  } catch (e) {
    sails.log.error(e.stack);
    return res.error(e);
  }
}

export async function Create(req, res) {
  sails.log(`=== API:${modelName}Controller:create ===`);
  try {
    const bodyData = req.param('data');
    const {
      langCode = res.langCode(),
    } = req.allParams();
    const inputHasNull = ValidatorHelper.checkNull({
      bodyData,
    });
    if (inputHasNull) {
      throw Error(MESSAGE.BAD_REQUEST.NO_REQUIRED_PARAMETER({ inputHasNull }));
    }
    const include = [
      { model: Post },
    ];
    const data = await QueryHelper.create({
      langCode,
      modelName,
      input: bodyData,
      include,
    }, {
      format: [
        'title',
        'content',
        'deletedAt',
        'MemberId',
        'Posts',
      ],
      formatCb: null,
    });
    return res.ok({
      langCode,
      message,
      data,
    });
  } catch (e) {
    return res.error(e);
  }
}

export async function Update(req, res) {
  sails.log(`=== API:${modelName}Controller:update ===`);
  try {
    const bodyData = req.param('data');
    const {
      id,
      langCode = res.langCode(),
    } = req.allParams();
    const inputHasNull = ValidatorHelper.checkNull({
      bodyData,
      id,
    });
    if (inputHasNull) {
      throw Error(MESSAGE.BAD_REQUEST.NO_REQUIRED_PARAMETER({ inputHasNull }));
    }
    await QueryHelper.update({
      langCode,
      modelName,
      where: { id },
      input: bodyData,
      include: null,
    }, {
      format: null,
      formatCb: null,
      updateCb: null,
    });
    return await this['topic/detail'](req, res);
  } catch (e) {
    return res.error(e);
  }
}

export async function Destroy(req, res) {
  sails.log(`=== API:${modelName}Controller:delete ===`);
  const ids = req.param('data');
  try {
    sails.log('delete ids=>', ids);
    const inputHasNull = ValidatorHelper.checkNull({
      ids,
    });
    if (inputHasNull) {
      throw Error(MESSAGE.BAD_REQUEST.NO_REQUIRED_PARAMETER({ inputHasNull }));
    }
    const data = await QueryHelper.destroy({
      modelName,
      ids,
    });
    return res.ok({
      message,
      data,
    });
  } catch (e) {
    return res.error(e);
  }
}
