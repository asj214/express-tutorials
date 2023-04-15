require('dotenv').config();

const { JWT_SECRET } = process.env;

module.exports = {
  secret: process.env.JWT_SECRET
};