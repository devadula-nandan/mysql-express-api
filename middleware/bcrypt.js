const bcrypt = require("bcryptjs");

const saltRounds = 10;

module.exports = {
  encrypt: (req, res, next) => {
    bcrypt
      .hash(req.body.password, saltRounds)
      .then((hash) => {
        req.body.password = hash;
        next();
      })
      .catch(next);
  },
  match: bcrypt.compareSync,
};
