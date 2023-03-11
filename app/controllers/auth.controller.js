const config = require("../config/index");
const redi = require("../function/rediFunct")
const USER = require("../models/user.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const checkPhone = await USER.findOne({ phone: req.body.phone });
    if (checkPhone) {
      res.status(400).send({ message: "Số điện thoại đã tồn tại !" });
    } else {
      const user = new USER({
        fullName: req.body.fullName,
        phone: req.body.phone,
        avatar: req.body.avatar,
        password: bcrypt.hashSync(req.body.password, 8),
        createAt: redi.getTime(),
        lastAccess: redi.getTime(),
        requestContact: [],
        contacts: []
      });
      await user.save();
      res.status(200).send({ message: "Đăng ký tài khoản mới thành công !!!" });
    }
  } catch (error) {
    console.error(error);
  }
};

// Làm phần SignIn, SignOut
exports.signin = async (req, res) => {
  try {
    const user = await USER.findOne({ phone: req.body.phone });
    if (user) {

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);      
      if (passwordIsValid) {
        //Send đăng nhập ở chỗ này
        res.status(200).send({ message: "Đăng nhập thành công !", user});
      } else {
        res.status(400).send({ message: "Mật khẩu nhập sai !" });
      }

    } else {
      res.status(400).send({ message: "Số điện thoại nhập sai !" });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.signout = async (req, res) => {
    try {
      const user = await USER.findOneAndUpdate(
        { phone: req.body.phone },
        { $set: { lastAccess: redi.getTime() } },
        { new: true }
      );
      res.send({ message: "Đăng xuất thành công !"});
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "lỗi đăng xuất !" });
    }
};