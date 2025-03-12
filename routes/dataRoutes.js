const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.post("/submit", dataController.createData);
router.get("/data", dataController.getData);
router.put("/data/:id", dataController.updateData);
router.delete("/data/:id", dataController.deleteData);

module.exports = router;
