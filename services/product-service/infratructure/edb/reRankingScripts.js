const buildReRankingFunctions = () => [
    {
      field_value_factor: {
        field: 'sale_count',
        factor: 1.2,
        modifier: 'log1p',
        missing: 0
      },
      weight: 2
    },
    {
      field_value_factor: {
        field: 'rating',
        factor: 2,
        modifier: 'none',
        missing: 3
      },
      weight: 1
    },
    {
        field_value_factor: {
          field: 'sort',
          factor: 1.5,
          modifier: 'none',
          missing: 2
        },
        weight: 1
      },
    {
      field_value_factor: {
        field: 'discount_percentage',
        factor: 0.1,
        modifier: 'none',
        missing: 0
      },
      weight: 1.5
    },
    {
      gauss: {
        createdAt: {
          origin: 'now',
          scale: '30d',
          offset: '0d',
          decay: 0.5
        }
      },
      weight: 1
    }
  ];
  
  module.exports = { buildReRankingFunctions };