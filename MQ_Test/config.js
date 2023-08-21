module.exports = {
  secretKey: "12345-67890-09876-54321",
  mongoUrl: "mongodb://localhost:27017/resourceMgr",
  mqttUrl: "mqtt://127.0.0.1",
  topics: ["sensor/#", "test/#", "device/#", "cmd/#"],
  ports: { update: 8000, appin: 8001 }, //port 8000 used to send change notification from devices to apps
  debug_mode: true,
  options : { username:"cfbieder", password:"PSi4y!S43i"},
};
