const { Router } = require('express');
const controller = require('./controller')

const router = Router();

router.put("/:id", (req, res) => controller.updateBook(req, res));
router.get("/find", (req, res) => controller.findBook(req, res));
router.get("/", (req, res) => controller.getBooks(req, res));
router.get("/:id", (req, res) => controller.findBookByID(req, res));
router.delete("/:id", (req, res) => controller.deleteBook(req, res));
router.post("/", (req, res) => controller.addBook(req, res));


module.exports = router