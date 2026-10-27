const express = require('express');
const router = express.Router();
const { getResources, getResourceById, createResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getResources)
  .post(protect, authorize('admin'), createResource);

router.route('/:id')
  .get(getResourceById)
  .put(protect, authorize('admin'), updateResource)
  .delete(protect, authorize('admin'), deleteResource);

module.exports = router;

