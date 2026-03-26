const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {  getApplications, 
  addApplication, 
  editApplication, 
  removeApplication,
  getApplicationSummary } = require('../controllers/applicationController');

router.use(protect);

router.get('/summary', getApplicationSummary);
router.get('/', getApplications);
router.post('/', addApplication);
router.put('/:id', editApplication);
router.delete('/:id', removeApplication);

module.exports = router;