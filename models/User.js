const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      default: 'user'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at'
    }
  }
);

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;