module.exports.index = function (req, res) {
 
  if (!req.user) {
    res.send(null);
  } else {
    
    let user = {
      username: req.user.email
    };
   
    res.send(user);
  }
};
