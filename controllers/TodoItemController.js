const { body, validationResult } = require("express-validator");
const TodoItem = require("../models/todoItem");

module.exports.index = (req, res) => {
  const { id } = req.params;
  const { user } = req;

  if (!!id) {
    TodoItem.findOne({ _id: id, author: user.id }).exec((err, todo) => {
      if (err) {
        console.error(err, "查询失败");
        res.sendStatus(500);
      } else {
        if (!todo) {
          res.json({
            meta: {
              code: -1,
              errors: ["找不到该待办事项"],
            },
            data: null,
          });
        } else {
          res.send({
            meta: {
              code: 0,
              errors: [""],
            },
            data: todo && todo.toJSON({ virtuals: true }),
          });
        }
      }
    });
  } else {
    const { keyword } = req.query;

    TodoItem.find({ author: user.id, content: new RegExp(keyword || "") })
      .sort({ _id: -1 })
      .exec((err, todoItems) => {
        if (err) {
          console.error(err, "查询失败");
          res.sendStatus(500);
        }

        res.send({
          meta: { code: 0, errors: [] },
          data: todoItems.map(
            (todo) => todo && todo.toJSON({ virtuals: true })
          ),
        });
      });
  }
};
module.exports.add_todoItem = [
  body("content")
    .not()
    .isEmpty()
    .withMessage("content 不能为空")
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        meta: {
          code: -1,
          errors: errors.array().map((item) => item.msg),
        },
        data: null,
      });
    } else {
      const { content } = req.body;
      const { user } = req;
      TodoItem.create({ content, author: user.id }, (err, todo) => {
        if (err) {
          console.error(err, "保存失败");
          res.sendStatus(500);
        } else {
          res.json({
            meta: {
              code: 0,
              errors: [""],
            },
            data: todo && todo.toJSON({ virtuals: true }),
          });
        }
      });
    }
  },
];
module.exports.update_todoItem = [
  body("id").not().isEmpty().withMessage("id 不能为空").trim().escape(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        meta: {
          code: -1,
          errors: errors.array().map((item) => item.msg),
        },
        data: null,
      });
    } else {
      const { content, complete, id } = req.body;
      const { user } = req;

      TodoItem.findOneAndUpdate(
        { _id: id, author: user.id },
        { content, complete },
        {},
        (err, todo) => {
          if (err) {
            console.error(err, "定位该待办事项失败");
            res.sendStatus(500);
          } else if (!todo) {
            res.json({
              meta: { code: -1, errors: ["定位该待办事项失败"] },
              data: null,
            });
          } else {
            res.json({
              meta: { code: 0, errors: [""] },
              data: null,
            });
          }
        }
      );
    }
  },
];

module.exports.delete_todoItem = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res.json({
      meta: {
        code: -1,
        errors: ["id 为必传参数"],
      },
      data: null,
    });
  } else {
    const { user } = req;

    TodoItem.findOne({ author: user.id, _id: id }).exec((err, todo) => {
      if (err || !todo) {
        console.error(err, "定位该待办事项失败");
        res.sendStatus(500);
      } else {
        todo
          .remove()
          .then(
            res.json({
              meta: { code: 0, errors: [""] },
              data: "删除成功",
            })
          )
          .catch((err) => {
            console.error(err, "删除失败");
            res.sendStatus(500);
          });
      }
    });
  }
};
