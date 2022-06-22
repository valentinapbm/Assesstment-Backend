const router = require("express").Router();
const favController = require("../controllers/fav.controller")
const {auth} = require("../../src/utils/auth")

router.route("/list").get(auth,favController.list);
router.route("/:favId").get(auth,favController.show);
router.route("/:listId").post(auth,favController.create);
router.route("/update/:favId").put(auth, favController.update);
router.route("/delete/:favId").delete(auth,favController.destroy);

module.exports = router;