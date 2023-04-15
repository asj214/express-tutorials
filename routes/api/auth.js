var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const { body, validationResult } = require('express-validator');
const db = require("../../database/models/index");
const jwt = require("jsonwebtoken");
const { secret } = require("../../configs/index");
const authenticate = require('../authenticate');

/* GET users listing. */
router.post(
  '/register',
  body('email').isEmail(),
  body('name').not().isEmpty(),
  body('password').isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const exists = await db.User.findOne({
        where: {
          email: req.body.email
        }
      });
      if (exists) return res.status(400).json({ errors: 'Same Email' });

      const user = db.User.create({
        email: req.body.email,
        name: req.body.name,
        password: await argon2.hash(req.body.password)
      });
      return res.status(201).json(user.toJSON());

    } catch (e) {
      console.log(e);
    }
  }
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  async function(req, res) {
    const user = await db.User.scope('withPassword').findOne({
      where: {
        email: req.body.email
      }
    })

    if (!await argon2.verify(user.password, req.body.password)) {
      return res.status(400).json({ errors: 'Not Found' });
    }

    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    const token = jwt.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      exp: parseInt(exp.getTime() / 1000),
    }, secret);

    res.json({'token': token})

  }
);

router.get('/me', authenticate.required, 
  async function(req, res, next) {
  const user = await db.User.findByPk(req.auth.id)
  res.json(user);
});


module.exports = router;
