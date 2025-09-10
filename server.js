const express = require("express");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Δημιουργούμε HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

// Σερβίρουμε τη βασική HTML στη ρίζα
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "transportlisbon.html"));
});

// Σερβίρουμε static αρχεία
app.use(express.static(__dirname));

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  const interval = setInterval(async () => {
    try {
      const res = await fetch("https://app.metrolisboa.pt/status/getLinhas.php");
      const data = await res.json();

      // Αν υπάρχει κάποιο μήνυμα διακοπής
      if (data.mensagem) {
        data.mensagem_en = "There are disruptions in service. Waiting times may be longer than usual. Thank you for your understanding.";
      }

      ws.send(JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching metro data:", err);
    }
  }, 10000); // κάθε 10 δευτερόλεπτα

  ws.on("close", () => {
    clearInterval(interval);
    console.log("WebSocket connection closed");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




