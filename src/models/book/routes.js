const { Router } = require('express');
const controller = require('./controller')

const router = Router();

router.get("/find", (req, res) => controller.findBook(req, res));
router.get("/", (req, res) => controller.getBooks(req, res));
router.get("/:id", (req, res) => controller.findBookByID(req, res));

// router.get('/findByISBN/:isbn', (req, res) => controller.findBookByISBN(req, res));
// router.get('/findByAuthor/:author', (req, res) => controller.findBookByISBN(req, res));
// router.get('/findByTitle/:title', (req, res) => controller.findBookByISBN(req, res));
router.delete("/:id", (req, res) => controller.deleteBook(req, res));

router.post("/", (req, res) => controller.addBook(req, res));

module.exports = router