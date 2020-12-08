const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * A helper function to create paginated queries with the schema.
 * @param {Object} filter 
 * @param {Object} options 
 */
async function findPaginated(filter, options) {
  try {
    let defaults = {page : 0, size : 10};
    options = Object.assign({}, defaults, options);

    const skip = options.page * options.size;
    filter = Object.assign({}, filter);

    let countQuery = this.find(filter);
    let query = this.find(filter);

    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.fields) {
      query = query.select(options.fields);
    }

    query = query.limit(options.size).skip(skip);

    const numberOfDocuments = await countQuery.countDocuments();
    const documents = await query.exec();

    return { total: numberOfDocuments, documents }
  } catch (error) {
    throw error;
  }
}

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

// Attach findPaginated asynchronous function
CharacterSchema.statics.findPaginated = findPaginated;
  
const col = "characters";
const Character = mongoose.model("Character", CharacterSchema, col);

module.exports = Character;

