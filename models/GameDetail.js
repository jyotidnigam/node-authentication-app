const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameDetailSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    gameName: {
      type: String,
      required: true
    },
    gameJson: {
      type: String,
      required: true
    },
    gameSlug: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at'
    }
  }
);

const GameDetailModel = mongoose.model('GameDetail', GameDetailSchema);
module.exports = GameDetailModel;