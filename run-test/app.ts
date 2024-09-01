const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/out")));

// Route for the homepage
app.get("/", (req: any, res: any) => {
  res.sendFile(path.join(__dirname, "/out/index.html"));
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
