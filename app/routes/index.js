var express = require("express");
var router = express.Router();
var fomidable = require("formidable");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/upload", (req, res) => {
  let form = new fomidable.IncomingForm({
    uploadDir: "./upload",
    KeepExtensions: true, // para manter a extenssão
  });

  form.parse(req, (err, fields, files) => {
    res.json({
      files,
    });
  });
});

module.exports = router;
