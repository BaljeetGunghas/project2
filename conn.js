const mongooes =require("mongoose");

mongooes.connect(process.env.mongo_dittels).then(()=>{
    console.log("connection successfull...");
}).catch((e)=>{
    console.log(e);
})