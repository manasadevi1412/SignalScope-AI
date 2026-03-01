const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("SignalScope AI Backend is Running 🚀");
});

// Prediction API
app.post("/api/predict-signal", async (req, res) => {
  try {
    const { location, network } = req.body;

    const strength = Math.floor(Math.random() * (-60 + 110) - 110);

    let signal;
    if (strength > -75) {
      signal = "Excellent";
    } else if (strength > -90) {
      signal = "Good";
    } else {
      signal = "Poor";
    }

    res.json({
      location,
      network,
      signal,
      strength
    });

  } catch (error) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
