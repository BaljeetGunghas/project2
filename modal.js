const mongooes = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const UserSchema = new mongooes.Schema({
    full_name: {
        type: String,
        minlength: 3,
        require: true,
        uppercase: true
    },
    email: {
        email: 1,
        type: String,
        unique: [true, "Email is already present.."],
        require: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter valid email id..")
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: [3, "Password is Short ?????"]
    },
    number: {
        type: Number,
        number: 1,
        require: true,
        unique: [true, "number is already present.."],
        minlength: [10, "Number is Short ?????"]
    },
    gender: {
        type: String,
        require: true,

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
UserSchema.methods.generateToktn = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token });
        this.save()
        return (token);                                                            
    } catch (error) {
        console.log(error);
    }
}


UserSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);

    }

    next();
})

const UserModal = new mongooes.model("yourdata", UserSchema);

module.exports = UserModal;




