const { Router } = require('express');
const controller = require('./controller')

const router = Router();

router.get("/", (req, res) => controller.getBorrowers(req, res));
router.get("/:id", (req, res) => controller.findBorrowerByID(req, res));
router.post("/", (req, res) => controller.addBorrower(req, res));
router.patch("/:id", (req, res) => controller.updateBorrower(req, res));
router.delete("/:id", (req, res) => controller.deleteBorrower(req, res));

module.exports = router;
