const express = require("express");
const router = express.Router();
const Character = require("../models/character");
const fetch = require('node-fetch');

/**
 * GET - /characters
 * Fetch all the characters
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const characters = await Character.findPaginated({}, {
      page,
      size
    });
    res.json({
      documents: characters.documents,
      total: characters.total,
      size: size,
      page: page
    })
  } catch (err) {
    res.status(500).json({message: err.message})
  }
});

/**
 * GET - /characters/seeds
 * Load the database with 50 characters.
 * Here we use swapi (Star Wars API) to fetch star wars characters.
 * The api limit is 10000 fetches per day.
 */
router.get("/seeds", async (req, res) => {
  try {
    let maxIndex = 50;
    let insertedCharacters = [];
    for (let index = 1; index <= maxIndex; index++) {
      const characterFetch = await fetch(`https://swapi.dev/api/people/${index}/`);
      const characterJson = await characterFetch.json();
      if(!characterJson.name) maxIndex++;
      else {
        const character = new Character({
          name: characterJson.name,
          height: characterJson.height,
          mass: characterJson.mass,
          gender: characterJson.gender
        });
        const findCharacter = await Character.findOne({ name: character.name })
        if(!findCharacter) {
          const savedDoc = await character.save();
          insertedCharacters.push(savedDoc.name);
        }
      }
    }
    res.status(200).json({ inserted_characters: insertedCharacters, quantity: insertedCharacters.length });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: err.message});
  }
});
 
/**
 * POST - /characters
 * Create a new character.
 */
router.post("/", async (req, res) => {
  const character = new Character({
    name: req.body.name,
    height: req.body.height,
    mass: req.body.mass,
    gender: req.body.gender
  });
  try {
    const newCharacter = await character.save();
    res.status(201).json({ newCharacter });
  } catch (err) {
    res.status(400).json({ message: err.message});
  }
});

/**
 * GET - /characters/:id
 * Fetch a single character by id.
 */
router.get("/:id", getCharacter, (req, res) => {
  res.json(res.character);
});

/**
 * PATCH - /characters
 * Update the sent attributes.
 */
router.patch("/:id", getCharacter, async (req, res) => {
  if (req.body.name != null) {
    res.name = req.body.name; //replace old entry with new entry
  }
  if (req.body.height != null) {
    res.height = req.body.height;
  }
   if (req.body.mass != null) {
    res.mass = req.body.mass;
  }
  if (req.body.gender != null) {
    res.gender = req.body.gender;
  }
  
  try {
    const updatedCharacter = await res.character.save();
    res.json(updatedCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * PUT - /characters
 * Update the entire character.
 */
router.put("/:id", getCharacter, async (req, res) => {
  try {
    Object.assign(res.character, req.body);
    const updatedCharacter = await res.character.save();
    res.json(updatedCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE - /characters
 * Delete a character by id.
 */
router.delete("/:id", getCharacter, async (req, res) => {
  try {
    await res.character.deleteOne();
    res.json({ message: "Character record has been deleted"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

 /**
  * Middleware to get the character.
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
async function getCharacter(req, res, next) {
  let character;
  try {
    character = await Character.findById(req.params.id);
    if (character == null) {
      return res.status(404).json({message: "Cannot find that Character record."});
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  
  res.character = character;
  next();
}

module.exports = router;