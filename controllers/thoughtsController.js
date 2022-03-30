const { thoughts, user } = require("../models");
//POSSIBLE CAPS ISSUE

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    thoughts
      .find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    thoughts
      .findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    thoughts
      .create(req.body)
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a thought
  deleteThought(req, res) {
    thoughts
      .findOneAndDelete({ _id: req.params.thoughtId })
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "No thought with that ID" })
          : user.deleteMany({ _id: { $in: thoughts.users } })
      )
      .then(() => res.json({ message: "Thought and user deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    thoughts
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "No thought with this id!" })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add an reaction to a thought
  createReaction(req, res) {
    console.log("You are adding a reaction");
    console.log(req.body);
    thoughts
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: "No thought found with that ID" })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },

  // remove an reaction from a thought
  deleteReaction(req, res) {
    console.log("You are removing a reaction");
    thoughts
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No thought found with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
