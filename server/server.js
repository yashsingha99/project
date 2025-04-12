const express =  require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());


const weather = require("./routes/weather")

app.use('/api', weather)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});