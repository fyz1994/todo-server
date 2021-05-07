const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const RefreshToken = require("../models/refreshTokens");

const EXPIRE_TIME = "7 days";

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
  body("mobile").not().isEmpty().withMessage("手机号不能为空").trim().escape(),
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
      const { mobile, password } = req.body;
      User.findOne({ mobile }, {}, {}, (err, user) => {
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
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: EXPIRE_TIME }
            );
            const refreshToken = jwt.sign(
              { username: user.account, id: user.id },
              process.env.REFRESH_TOKEN_SECRET
            );

            // refreshTokens.push(refreshToken);
            RefreshToken.create({ token: refreshToken }, (err, token) => {
              if (err) {
                console.error(err, "refreshToken 保存失败");
              } else {
                console.log(token, "refreshToken 保存成功");
              }
            });

            res.json({
              meta: {
                code: 0,
                errors: [""],
              },
              data: {
                name: user.account,
                id: user.id,
                email: user.email,
                mobile: user.mobile,
                token: accessToken,
                refreshToken,
              },
            });
          } else {
            res.json({
              meta: {
                code: -1,
                errors: ["手机号或密码错误"],
              },
              data: null,
            });
          }
        }
      });
    }
  },
];

/**
 * 当令牌到期时，我们还应该有一个策略，以便在到期时生成一个新的令牌。为此，我们将创建一个单独的 JWT 令牌，称为刷新令牌，可以用它来生成一个新的令牌。
 * @param {*} req
 * @param {*} res
 */
module.exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  RefreshToken.findOne({ token }).exec((err, curToken) => {
    if (err || !curToken) {
      return res.sendStatus(403);
    } else {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
          { username: user.account, id: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: EXPIRE_TIME }
        );

        res.json({
          meta: {
            code: 0,
            errors: [],
          },
          data: accessToken,
        });
      });
    }
  });
};

/**
 * 销毁刷新令牌（因为如果刷新令牌从用户那里被盗，那么可以使用它来生成任意多的新令牌）
 * @param {*} req
 * @param {*} res
 */
module.exports.signout = (req, res) => {
  const { token } = req.body;
  RefreshToken.findOneAndRemove({ token }, {}, (err, token) => {
    if (err) {
      console.error("移除 refreshToken 出错");
    } else {
      res.json({
        meta: {
          code: 0,
          errors: [],
        },
        data: null,
      });
    }
  });
};
