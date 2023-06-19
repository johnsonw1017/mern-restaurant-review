import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express();

app.use(cors());
app.use(express.json());

//specify routes
app.use("/api/v1/restaurants", restaurants);

//if route does not exist - *
app.use("*", (request, response) => response.status(404).json({error: "not found"}));

export default app