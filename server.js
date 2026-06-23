const dotenv = require("dotenv");
const app = require("./src/app");
const connectDB = require("./src/db/db");

dotenv.config();
connectDB();

app.listen(3000, () => {
  console.log("Server is running on  http://localhost:3000");
});
