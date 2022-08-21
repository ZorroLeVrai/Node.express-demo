function authentificate(req, res, next)
{
  console.log('Authenticating...');
  next();
}

module.exports = authentificate;