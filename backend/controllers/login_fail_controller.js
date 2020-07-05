module.exports.fail = function (req, res) {
  let m = req.flash("message")[0];
  console.log("fail arrived with", m);
  return res.send(m);
};
