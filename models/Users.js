const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 2,
    trim: true,
  },
  connections: [
    {
      id: { type: String, required: true },
      relation: { type: String, maxlength: 50, required: true },
    },
  ],
});

UserSchema.methods.isConnectedTo = function (idx) {
  return model("Users").findOne({ id: idx, connections: { id: this.id } });
};

const Users = model("Users", UserSchema);

module.exports = Users;
