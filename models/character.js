const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  height: {
    type: String,
    trim: true
  },
  mass: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    trim: true
  }
});
  
const col = "characters";
const Character = mongoose.model("Character", CharacterSchema, col);
module.exports = Character;

