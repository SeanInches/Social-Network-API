const { user, thoughts } = require("../models");

const reaction = async (username) =>
  user.aggregate([
    {
      //creates a copy of each user with a unique reaction in each document
      $unwind: "$reactions",
    },
    {
      //group doucment by id
      $group: { _id: username, reaction: reactionBody },
    },
  ]);

module.exports = {
  // get all users
  getUsers(req, res) {
    user
      .find()
      .then(async (users) => {
        const userObj = {
          users,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // get a single user
  getSingleUser(req, res) {
    user
      .findOne({ _id: req.params.UserId })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that user ID" })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  //update user
  updateUser(req, res) {
    user
      .findOneAndUpdate(
        { _id: req.params.UserId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that user ID" })
          : res.json({
              user,
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    user
      .create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // delete a user
  deleteUser(req, res) {
    user
      .findOneAndRemove({ _id: req.params.UserId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No such user exists" })
          : thoughts.findOneAndUpdate(
              { users: req.params.UserId },
              { $pull: { users: req.params.UserId } },
              { new: true }
            )
      )
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({
              message: "User deleted, but no thoughts found",
            })
          : res.json({ message: "User successfully deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add thought
  addThought(req, res) {
    console.log("You are adding a thought");
    console.log(req.body);
    user
      .findOneAndUpdate(
        { _id: req.params.UserId },
        { $addToSet: { thoughts: req.body } },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add friend
  addFriend(req, res) {
    console.log("You are adding a friend");
    console.log(req.body);
    user
      .findOneAndUpdate(
        { _id: req.params.UserId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // remove friend
  removeFriend(req, res) {
    console.log("You are removing a friend");
    console.log(req.body);
    user
      .findOneAndUpdate(
        { _id: req.params.UserId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
