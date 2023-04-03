const auth = require("../auth");
const express = require("express");
const Top5ListController = require("../controllers/top5list-controller");
const UserController = require("../controllers/user-controller");
const CommunityListController = require("../controllers/communitylist-controller");
const router = express.Router();

router.post("/top5list", auth.verify, Top5ListController.createTop5List);
router.put("/top5list/:id", auth.verify, Top5ListController.updateTop5List);
router.delete("/top5list/:id", auth.verify, Top5ListController.deleteTop5List);
router.get("/top5list/:id", auth.verify, Top5ListController.getTop5ListById);
router.get("/top5lists", auth.verify, Top5ListController.getTop5Lists);
router.get("/top5listsUser", auth.verify, Top5ListController.getTop5ListsUser);
router.get("/top5listpairs", auth.verify, Top5ListController.getTop5ListPairs);

router.post(
	"/top5list/:id/comments",
	auth.verify,
	Top5ListController.createComment
);
router.post("/top5list/:id/views", Top5ListController.updateView);
router.post(
	"/top5list/:id/rating",
	auth.verify,
	Top5ListController.updateRating
);
// Community List
router.get("/community", CommunityListController.getCommunityLists);
router.post("/community/:id/views", CommunityListController.updateView);
router.post(
	"/community/:id/rating",
	auth.verify,
	CommunityListController.updateRating
);
router.post(
	"/community/:id/comments",
	auth.verify,
	CommunityListController.createComment
);

router.post(
	"/top5list/:id/community",
	auth.verify,
	Top5ListController.publishList
);

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.get("/loggedIn", UserController.getLoggedIn);
router.get("/logout", UserController.logoutUser);

module.exports = router;
