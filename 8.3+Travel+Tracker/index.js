import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Willit18@gg",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted(){
  const result = await db.query("SELECT country_code FROM visited_countries");
  const countries = result.rows.map(row => row.country_code);
  return countries;
}

app.get("/", async (req, res) => {
  //Write your code here.
  try{
    const countries = await checkVisisted();
    res.render("index.ejs", {countries: countries.join(","), total: countries.length});
  }catch (err){
    console.error("Error executing query", err.stack);
    res.status(500).send("Error fetching data from the database");
  }
});

app.post("/add", async(req, res) =>{
  const newCountry  = req.body.country;
  try{
    const countryResult  = await db.query("SELECT country_code FROM countries WHERE country_name ILIKE '%'|| $1 || '%'", [newCountry]);
    if(countryResult.rows.length === 0){
      const countries = await checkVisisted();
      res.render("index.ejs", { countries: countries.join(","), total: countries.length, error: "Country does not exist, try again."});
    }

    if(countryResult.rows.length !== 0){
      try{
        const countryCode = countryResult.rows[0].country_code;
        await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
        res.redirect("/");
      }catch (err){
        const countries = await checkVisisted();
        res.render("index.ejs", { countries: countries.join(","), total: countries.length, error: "Country has already been added, try again."});
      }
    }

  }catch (err){
    const countryResult  = await db.query("SELECT country_code FROM countries WHERE country_name ILIKE '%'|| $1 || '%'", [newCountry]);
    if(countryResult.rows.length === 0){
      const countries = await checkVisisted();
      res.render("index.ejs", { countries: countries.join(","), total: countries.length, error: "Country does not exist, try again."});
    }
    }    
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
