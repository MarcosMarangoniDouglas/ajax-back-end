//med.js

//mongoose requirements
const mongoose = require('mongoose');

//create mongoose schema object
const Schema = mongoose.Schema;

//create schema for our collection (meds_col)
const CharacterSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  height: {
    type: String,
    trim: true,
  },
  mass: {
    type: String,
    trim: true,
  }
  
//}, {collection : 'meds_col'});
	});
//reference existing collection
const col = "characters";
//const Med = mongoose.model("Med", MedSchema);
//prepare model
const Character = mongoose.model("Character", CharacterSchema, col);

//export model
module.exports = Character;

