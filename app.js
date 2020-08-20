const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const apiKey = require(__dirname + "/apikey.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("index",{
        flag: null,
        temp: null,
        image: null,
        description: null,
        city: null
    });
});

app.post("/",function(req, res){
    const query = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric"
    https.get(url, function (response) {
        console.log(response);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const cityName = weatherData.name;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.render("index",{
                flag: 1,
                image: imageUrl,
                temp:temp,
                description: weatherDescription,
                city: cityName
            });
        })
    })
    console.log("post request recieved::");
});



app.listen(3000, function(){
    console.log("Server is running in port 3000");
});