const buildBaseSearchQuery = ({ query, filters = {} }) => {
    const boolQuery = {
        bool: {
            must: query
                ? {
                    multi_match: {
                        query,
                        fields: ['name^3', 'desc_plain'],
                        fuzziness: 'AUTO',
                        analyzer: 'search_analyzer'
                    }
                }
                : { match_all: {} },
            filter: [
                { term: { status: 'active' } },
                filters.minPrice || filters.maxPrice
                    ? {
                        range: {
                            price: {
                                ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
                                ...(filters.maxPrice !== undefined && { lte: filters.maxPrice })
                            }
                        }
                    }
                    : {},
                filters.categoryPath && Array.isArray(filters.categoryPath)
                    ? {
                        terms: {
                            CategoryPath: filters.categoryPath
                        }
                    }
                    : {},
                filters.CategoryId
                    ? {
                        term: {
                            CategoryId: filters.CategoryId
                        }
                    }
                    : {},
                filters.ShopId
                    ? {
                        term: {
                            ShopId: filters.ShopId
                        }
                    }
                    : {}
            ].filter(f => Object.keys(f).length > 0)
        }
    };

    return boolQuery;
};

module.exports = { buildBaseSearchQuery };
