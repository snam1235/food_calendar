module.exports.fail = function (req, res, next) {
  console.log("go to login fail!");

  let m = req.flash("message")[0];
  console.log("fail arrived with", m);
  return res.send(m);
};
