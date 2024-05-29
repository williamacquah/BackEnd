import express from "express";
import axios from "axios";
import bodyParser from "body-parser"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs")
});

app.post("/get-weather", async(req, res)=>{
    const city = req.body.city;
    const postcode = req.body.postcode;
    const apikey = req.body.apikey;
    const tomorrowTime = Math.floor((Date.now() + 86400000) / 1000);

    try{
        const result1 = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${postcode}&appid=${apikey}`);
        const {lat, lon} = result1.data[0];

        const result2 = await axios.get(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${tomorrowTime}&appid=${apikey}`);
        const weatherData = result2.data;

        const temperature = weatherData.data[0].temp - 273.15;
        const isRaining = weatherData.data[0].weather[0].description;
        res.render("index.ejs", {temperature: temperature.toFixed(2), isRaining: isRaining, name: city});
    }catch(error){
        res.render("index.ejs", {content: JSON.stringify(error.response.data)});
    }
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}.`)
});