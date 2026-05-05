/**
 * Paginate results for a Mongoose query
 * @param {Object} model - Mongoose model
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Paginated result
 */
const paginate = async (model, query = {}, page = 1, limit = 10, populate = '') => {
  const skip = (page - 1) * limit;

  const results = await model.find(query)
    .populate(populate)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await model.countDocuments(query);

  return {
    data: results,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = paginate;
