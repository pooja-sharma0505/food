const express = require('express');
const router = express.Router();

/**
 * GET /api/config
 * Returns application-level configuration that is not user-specific.
 *
 * Food preferences are fetched from /api/categories (which reads from
 * the database), and diet tags are served from this endpoint.
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      diet_tags: ['Vegetarian', 'Vegan', 'Non-veg'],
    },
  });
});

module.exports = router;
