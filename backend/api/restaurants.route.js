import express from "express"

const router = express.Router()

router.route("/").get ((request, response) => response.send("hello world"));

export default router