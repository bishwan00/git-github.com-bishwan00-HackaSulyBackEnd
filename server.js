import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`first backend app listening on port ${port}`);
});
