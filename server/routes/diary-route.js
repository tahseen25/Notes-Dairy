// src/routes/diary-route.js

const express = require('express');
const diaryRouter = express.Router();
const diaryController = require('../controllers/diary-controller');
const authMiddleware = require("../middlewares/auth-middleware");

// Apply authentication middleware to all diary routes
diaryRouter.use(authMiddleware);

// Routes for diary operations
diaryRouter.post('/create', diaryController.createDiaryEntry);
diaryRouter.get('/', diaryController.getAllDiaryEntries);
diaryRouter.patch('/:id', diaryController.updateDiaryEntry);
diaryRouter.delete('/:id', diaryController.deleteDiaryEntry);

module.exports = diaryRouter;
