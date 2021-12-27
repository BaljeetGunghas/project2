const jwt = require("jsonwebtoken");

const UserModal = require("../modal/modal");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);

       

        const user = await UserModal.findOne({ _id: verifyUser._id })
        // console.log(user.token);

        req.token = token;
        req.user = user;
        next();


    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;