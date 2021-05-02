const TodoItem = require("../models/todoItem");
const { body, validationResult } = require("express-validator");

module.exports.index = (req, res) => {
  const { id } = req.params;
  if (!!id) {
    TodoItem.findById(id).exec((err, todo) => {
      if (err) {
        console.error(err, "查询失败");
        res.status(500);
      } else {
        res.send({
          meta: {
            code: 0,
            errors: [""],
          },
          data: todo && todo.toJSON({ virtuals: true }),
        });
      }
    });
  } else {
    const { keyword } = req.query;

    TodoItem.find({ content: new RegExp(keyword || "") })
      .sort({ _id: -1 })
      .exec((err, todoItems) => {
        if (err) {
          console.error(err, "查询失败");
          res.status(500);
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
      return res.status(400).json({
        meta: {
          code: -1,
          errors: errors.array(),
        },
        data: null,
      });
    } else {
      const { content } = req.body;
      TodoItem.create({ content }, (err, todo) => {
        if (err) {
          console.error(err, "保存失败");
          res.status(500);
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
  body("content")
    .not()
    .isEmpty()
    .withMessage("content 不能为空")
    .trim()
    .escape(),
  (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        meta: {
          code: -1,
          errors: errors.array(),
        },
        data: null,
      });
    } else {
      const { content, id } = req.body;
      TodoItem.findByIdAndUpdate(id, { content }, {}, (err, todo) => {
        if (err) {
          console.error(err, "更新失败");
          res.status(500);
        }
        res.json({
          meta: { code: 0, errors: [""] },
          data: null,
        });
      });
    }
  },
];

module.exports.delete_todoItem = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      meta: {
        code: -1,
        errors: ["id 为必传参数"],
      },
      data: null,
    });
  } else {
    TodoItem.findByIdAndRemove(id, {}, (err, todo) => {
      if (err) {
        console.error(err, "删除失败");
        res.status(500);
      } else {
        res.json({
          meta: { code: 0, errors: [""] },
          data: "删除chengg",
        });
      }
    });
  }
};
