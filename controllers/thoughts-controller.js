const { Thought, User } = require("../models");

const thoughtController = {
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "thoughts",
      })
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  //get thought by _id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .populate({
        path: "thoughts",
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Thought not found." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  //post a thought
  addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        console.log(_id);
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: "User not found." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // update thought by _id
  updateThought({ params, body }, res) {
    console.log(params.thoughtId);
    console.log(body);
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Thought not found." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  //delete thought by _id
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({ message: "Thought not found." });
        }
        console.log(deletedThought);
        User.findOneAndUpdate(
          { username: deletedThought.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        ).then((dbUserData) => {
          if (!dbUserData) {
            res.status(404).json({ message: "User not found." });
            return;
          }
          res.json(dbUserData);
        });
      })
      .catch((err) => res.json(err));
  },
  //post a reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "User not found." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  //Delete a reaction by id
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;