DEFAULT_PAGE_NUMBER = 1;
DEFAULT_PAGE_LIMIT = 0; // return all documents

function getPagination(query) {
  // convert the string to number using the Math absolute value function
  // if the limit and page are not set assign the default values
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const page = Math.abs(query.page) || DEFAULT_PAGE_LIMIT;
  // calculate the number of documents to skip
  const skip = limit * (page - 1);

  return { limit, skip };
}

module.exports = {
  getPagination,
};
