const express = require("express");
const fetch = require("node-fetch");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

// Δημιουργία HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Δημιουργία WebSocket server
const wss = new WebSocket.Server({ server });

// Όταν συνδέεται ένας client
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Στέλνουμε δεδομένα κάθε 10 δευτερόλεπτα
  const interval = setInterval(async () => {
    try {
      const res = await fetch("http://app.metrolisboa.pt/status/getLinhas.php");
      const data = await res.json();
      ws.send(JSON.stringify(data));
    } catch (err) {
      console.error("Error fetching metro data:", err);
    }
  }, 10000);

  // Όταν ο client αποσυνδεθεί
  ws.on("close", () => {
    clearInterval(interval);
    console.log("WebSocket connection closed");
  });
});
