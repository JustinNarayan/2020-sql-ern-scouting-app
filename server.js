/// Enable the server

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Init app
const app = express();

// Define routes

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
   // Set static folder
   app.use(express.static("client/build"));
   app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
   });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
