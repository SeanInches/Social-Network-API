const { Schema, model } = require("mongoose");
const thoughtSchema = require("./thoughts");
const reactionSchema = require("./reactions");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      max_length: 30,
    },
    email: {
      type: String,
      max_length: 50,
      unique: true,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thoughts",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },

  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

// virtual retrieves length of friends array.
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const user = model("user", userSchema);

module.exports = user;
