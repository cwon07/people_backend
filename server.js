// IMPORT DEPENDENCIES
require("dotenv").config();
const { PORT = 8000, DATABASE_URL} = process.env 
// Import Express
const express = require("express");
// Create Application Object
const app = express();
// Import Mongoose
const mongoose = require("mongoose");
// Import Cors
const cors = require("cors");
// Import Morgan
const morgan = require("morgan");

// DATABASE CONNECTION
// Establish Connection
mongoose.connect(DATABASE_URL)

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error) => console.log(error))

// MODELS = PascalCase, singlar "People"
// collections & tables = snake_case, plural "peoples"

const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})
// schema is used as a filter in the database; this is what the person looks like, has the following properties

const People = mongoose.model("People", peopleSchema)

// MIDDLEWARE
// cors for preventing cors errors (allows all requests from other origins)
app.use(cors())
// morgan for logging requests
app.use(morgan("dev"))
// express functionality to recognize incoming request objects as JSON objects
app.use(express.json())

// ROUTES
// "/people"
// INDUCES - Index, New, Delete, Update, Create, Edit, Show
// IDUCS - Index, Destroy, Update, Create, Show (for an JSON API)

// INDEX - GET - /people - gets all people
app.get("/people", async (req, res) => {
    try {
        // fetch all people from database
        const people = await People.find({})
        // it's empty because you want all the people on the list! if you wanted to find names, then you'd put ({name: "josh"}) etc.
        res.json(people);
    } catch(error) {
        // send error as JSON
        res.status(400).json({error})
    }
});

// CREATE - POST - /people - create a new person
app.post("/people", async (req, res) => {
    try{
        // create the new person
        const person = await People.create(req.body)
        res.json(person)
    }
    catch(error){
        res.status(400).json({error})
    }
});

// SHOW - GET - /people/:id - get a single person
app.get("/people/:id", async (req, res) => {
    try{
        // get a person from the database
        const person = await People.findById(req.params.id) // find the person with the same id
        // return the person as json
        res.json(person);
    } catch(error){
        res.status(400).json({error})
    }
});

// UPDATE - PUT - /people/:id - update a single person
app.put("/people/:id", async (req, res) => {
    try{
        // update the person
        const person = await People.findByIdAndUpdate(req.params.id, req.body, {new: true})
        // new:true is necessary to get the updated information, otherwise you'll get the old info
        // send the updated person as json
        res.json(person)
    }catch (error){
        res.status(400).json({error})
    }
});

// DESTROY - DELETE - /people/:id - delete a single person
app.delete("/people/:id", async (req, res) => {
    try{
        // delete the person
        const person = await People.findByIdAndDelete(req.params.id)
        // send deleted person as json
        res.status(204).json(person)
    }catch(error){
        res.status(400).json({error})
    }
});

app.get("/", (req, res) => {
    res.json({hello: "world"})
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))