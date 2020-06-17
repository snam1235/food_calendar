module.exports.index = function (req, res) {
  //flash message coming from different routes
  m = req.flash("message")[0];

  if (m) {
    //send message to view
    return res.render("index", { message: m });
  } else {
    return res.render("index", { message: "none" });
  }
};
