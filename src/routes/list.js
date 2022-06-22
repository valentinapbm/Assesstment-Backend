const router = require("express").Router();
const listController = require("../controllers/list.controller")
const {auth} = require("../../src/utils/auth")

router.route("/lists").get(auth,listController.list);
router.route("/lists/:listId").get(auth,listController.show);
router.route("/").post(auth,listController.create);
router.route("/update/:listId").put(auth, listController.update);
router.route("/delete/:listId").delete(auth,listController.destroy);

module.exports = router;