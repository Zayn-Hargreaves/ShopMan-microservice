const { getClient } = require("../edb");
const { buildAutoCompleteQuery } = require("../queries/search/autocompleteQuery");
const { buildBaseSearchQuery } = require("../queries/search/baseSearchQuery");
const { buildReRankingFunctions } = require("../scripts/reRankingScripts");

class ProductRepositoryEdb {
  async searchProducts({
    // query, // Từ khóa tìm kiếm (tùy chọn)
    // filters = {}, // Bộ lọc: minPrice, maxPrice, category, shop, status
    // sortBy, // Sắp xếp: { field: 'price', order: 'asc' }
    lastSortValues, // Giá trị search_after cho infinite scroll
    pageSize = 10, // Kích thước trang
    isAndroid = false // Xác định client Android
  }) {
    const client = await getClient();

    // Xây dựng body query
    const body = {
      size: pageSize,
      query: {
        function_score: {
          // query: buildBaseSearchQuery({ query, filters }),
          functions: buildReRankingFunctions(),
          score_mode: 'sum',
          boost_mode: 'multiply'
        }
      },
      // sort: [
      //   sortBy ? { [sortBy.field]: sortBy.order || 'asc' } : '_score',
      //   { '_id': 'asc' } // Tie-breaker
      // ],
      _source: isAndroid
        ? ['name', 'desc', 'price', 'thumb', 'rating', 'ShopId', 'CategoryId', 'sale_count', 'discount_percentage', 'createdAt','slug','categoryPath',]
        : ['name', 'desc', 'desc_plain', 'price', 'thumb', 'rating', 'ShopId', 'CategoryId', 'sale_count', 'discount_percentage', 'createdAt','slug','categoryPath'],
      // suggest: query ? buildAutoCompleteQuery(query) : undefined
    };

    // Thêm search_after nếu có
    if (lastSortValues) {
      body.search_after = lastSortValues;
    }

    // Thực hiện tìm kiếm
    const response = await client.search({ index: 'products', body });

    return {
      results: response.hits.hits.map(hit => ({
        ...hit._source,
        id: hit._id,
        score: hit._score,
        sortValues: hit.sort
      })),
      total: response.hits.total.value,
      suggest: response.suggest ? response.suggest.name_suggest[0].options.map(opt => opt.text) : []
    };
  }
}

module.exports = new ProductRepositoryEdb();