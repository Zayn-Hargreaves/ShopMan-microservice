const buildAutoCompleteQuery = (query) => ({
    name_suggest: {
      prefix: query,
      completion: {
        field: 'name.suggest',
        skip_duplicates: true,
        size: 5
      }
    }
  });
  
  module.exports = { buildAutoCompleteQuery };