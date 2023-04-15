var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const authenticate = require('../authenticate');
const db = require("../../database/models/index");

router.get(
  '/',
  authenticate.optional, 
  async function(req, res) {
    const page = Number(req.query.page) || 1
    const perPage = Number(req.query.per_page) || 10
    const offset = (page - 1) * perPage 

    const posts = await db.Post.scope('withUser').findAndCountAll({
      offset: offset,
      limit: perPage,
    })

    res.json(posts)
  }
);

router.post(
  '/',
  authenticate.required,
  body('title').isLength({ min: 5 }),
  body('body').isLength({ min: 5 }), 
  async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await db.Post.create({
      userId: req.auth.id,
      title: req.body.title,
      body: req.body.body
    })

    res.status(201).json(post)
  }
);

router.get(
  '/:id',
  authenticate.optional, 
  function(req, res, next) {
    db.Post.scope('withUser').findByPk(req.params.id).then((post) => {
      res.json(post)
    }).catch((err) => {
      res.status(404).json({ errors: err });
    })
  }
);

router.put(
  '/:id',
  authenticate.required,
  body('title').isLength({ min: 5 }),
  body('body').isLength({ min: 5 }), 
  async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await db.Post.update(req.body, {
      where: {
        id: req.params.id
      }
    })

    res.status(200).json(post)
  }
);

router.delete(
  '/:id',
  authenticate.required,
  function(req, res, next) {
    db.Post.destroy({
      where: { id: req.params.id }
    })
    res.status(204).send()
  }
);

module.exports = router;