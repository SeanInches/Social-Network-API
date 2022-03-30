const { Schema, model } = require("mongoose");
const reactionsSchema = require("./reactions");
const userSchema = require("./user");

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
      ref: "user",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
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

const thoughts = model("thoughts", thoughtsSchema);

module.exports = thoughts;
