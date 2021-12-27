require('dotenv').config()
const express = require("express");
const path = require("path");
const hbs = require("hbs");
require("./db/conn")
const app = express();
const UserModal = require("./modal/modal");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./midlwere/auth")



const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "/public")
const templates_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path)

// console.log(__dirname,"/templates/views");


// console.log("secret key value is " + process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("home")
})
app.get("/reagistor", (req, res) => {
    // console.log(`the cookies on the secreate page is   ${req.cookies.jwt}`);
    res.render("reagistor")
})
app.post("/reagistor", async (req, res) => {
    try {

        const savedata = new UserModal({
            full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.password,
            number: req.body.number,
            gender: req.body.gender

        });

        const token = await savedata.generateToktn();


        // console.log(`token part is ${token}`);
        // const finaldata = await savedata.save();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        })
        // console.log(cookie);

        // console.log(`data part is ${savedata}`);

        res.status(201).render("home")

    } catch (error) {
        res.status(400).send(error)
    }
})

app.get("/sine", (req, res) => {
    res.render("sine")
})
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await UserModal.findOne({ email: email });
        // console.log(useremail);

        const matchPassword = await bcrypt.compare(password, useremail.password)

        const token = await useremail.generateToktn();
        // console.log(`login token is here    ${token}`);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true
            
        })

        if (matchPassword) {

            res.status(200).render("aftrlogin")
        } else {
            res.status(404).send("password not match...????")
        }
        // console.log(`${email} and password is ${password}`);
        // res.render("home")

    } catch (error) {
        res.status(400).send("invalid email ditails ?????")
        console.log("the rest part error");
    }

})

app.get("/profile", auth, (req, res) => {
    try {
        res.render("profile")
        
    } catch (error) {
        res.status(404).send("login first......????")
    }
    // console.log(`the cookies on the secreate page is   ${req.cookies.jwt}`);
})
app.get("/logout", auth, async (req, res) => {
    try {
        // console.log(req.user);

        // logout from one diviese 
        // req.user.tokens = req.user.tokens.filter((currentElement) => {
        //     return currentElement.token != req.token
        // })

        // logout from all the deviese 
        req.user.tokens =[]
        res.clearCookie("jwt");

        await req.user.save()

        console.log("sucessfully logout");
        res.render("home")


    } catch (error) {
        res.status(401).send(error)
    }



})



app.listen(port, () => {
    console.log(`app is running on the ${port}`);
})




