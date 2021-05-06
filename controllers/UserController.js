const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

module.exports.signup = [
  body("name").not().isEmpty().withMessage("用户名不能为空").trim().escape(),
  body("email")
    .not()
    .isEmpty()
    .withMessage("邮箱不能为空")
    .trim()
    .escape()
    .isEmail()
    .withMessage("邮箱格式不正确"),
  body("mobile")
    .not()
    .isEmpty()
    .withMessage("手机号不能为空")
    .trim()
    .escape()
    .isMobilePhone()
    .withMessage("手机号格式不正确"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("密码不能为空")
    .isLength({ min: 6 })
    .withMessage("密码不能小于6位")
    .trim()
    .escape(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        meta: {
          code: -1,
          errors: errors.array(),
        },
        data: null,
      });
    } else {
      const { name, email, mobile, password } = req.body;
      User.findOne({ mobile }, {}, {}, (err, user) => {
        if (!!user) {
          res.json({
            meta: {
              code: -1,
              errors: ["该用户已经存在！"],
            },
            data: null,
          });
        } else {
          User.create(
            { account: name, password, email, mobile },
            (err, user) => {
              if (err) {
                console.error(err, "创建用户失败");
                res.status(500);
              } else {
                res.json({
                  meta: {
                    code: 0,
                    errors: [""],
                  },
                  data: null,
                });
              }
            }
          );
        }
      });
    }
  },
];

module.exports.signin = [
  body("name").not().isEmpty().withMessage("用户名不能为空").trim().escape(),
  body("password").not().isEmpty().withMessage("密码不能为空").trim().escape(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        meta: {
          code: -1,
          errors: errors.array(),
        },
        data: null,
      });
    } else {
      const { name, password } = req.body;
      User.findOne({ account: name }, {}, {}, (err, user) => {
        if (err) {
          console.error(err, "查找用户失败");
          res.status(500);
        }

        if (!user) {
          res.json({
            meta: {
              code: -1,
              errors: ["此用户不存在"],
            },
            data: null,
          });
        } else {
          if (user.password === password) {
            const accessToken = jwt.sign(
              { username: user.account, id: user.id },
              process.env.ACCESS_TOKEN_SECRET
            );

            res.json({
              meta: {
                code: 0,
                errors: [""],
              },
              data: accessToken,
            });
          } else {
            res.json({
              meta: {
                code: -1,
                errors: ["用户名或密码错误"],
              },
              data: null,
            });
          }
        }
      });
    }
  },
];
