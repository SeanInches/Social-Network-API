const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addThought,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

// /api/user
router.route("/").get(getUsers).post(createUser);

// /api/users/:userId
router.route("/:UserId").get(getSingleUser).put(updateUser).delete(deleteUser);

// /api/users/:userId/thoughts
router.route("/:UserId/thoughts").post(addThought);

// // /api/users/:UserId/friends/:friendId
router.route("/:UserId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
