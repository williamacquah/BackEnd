import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res)=>{
    try{
        const result = await axios.get("https://secrets-api.appbrewery.com/random");
        const secret = result.data.secret;
        const user = result.data.username;
        res.render("index.ejs", {secret: secret, user: user});
    }catch(error){
        res.render("index.ejs",{content: JSON.stringify(error.response.data)});
    }
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}.`);
});
