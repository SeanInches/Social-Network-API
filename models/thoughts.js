const { Schema, model } = require("mongoose");
const reactionsSchema = require("./Reactions");
const userSchema = require("./User");

const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      ref: "User",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reactions: [reactionsSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtsSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thoughts = model("thoughts", thoughtsSchema);

module.exports = Thoughts;
