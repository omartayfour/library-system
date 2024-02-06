const { Router } = require('express');
const controller = require('./controller')

const router = Router();

router.post("/:borrowerId/checkout/:bookId", (req, res) => controller.borrowBook(req, res));
router.post("/:borrowerId/return/:bookId", (req, res) => controller.returnBook(req, res));
router.get("/:borrowerId/checkedout", (req, res) => controller.checkBooks(req, res));
router.get("/overdue", (req, res) => controller.getOverdue(req, res));

module.exports = router;
