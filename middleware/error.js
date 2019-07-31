module.exports = (error, req, res, next) => {
  // loggin'
  res.status(500).send(`Something failed: ${error.message}`);
};
