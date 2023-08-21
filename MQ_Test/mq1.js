var mqtt = require("mqtt");
var mongoose = require("mongoose");
var MQTTPattern = require("mqtt-pattern");

//Load confif parameters
var config = require("./config");

//get MQTT client
var client = mqtt.connect(config.mqttUrl,config.options);
var pattern_messageType = "+type/#other";
var pattern_messageSensor = "sensor/+component/+mac";
var pattern_messageDevice = "device/+info/+mac";
///get standard list of topics to subsribe to
var topics = config.topics;

//***************************************
// Connect to Mongo
//***************************************

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;

var Device = require("../models/device")(mongoose);
var Component = require("../models/component")(mongoose);
var Log = require("../models/log")(mongoose);

console.log(Device);
var User = require("../models/user");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Info:", "Connected correctly to mongo server");
  connectToMQTT();
});

client.on("connect", function () {
  console.log("Info:", "Connected correctly to MQTT server");
});

const connectToMQTT = () => {
  mqtt_Subsribe();
};

//***************************************
//subsribe to each topics
//***************************************
const mqtt_Subsribe = () => {
  topics.forEach((topic) => {
    client.subscribe(topic);
    console.log("Info:", "subsribed to: " + topic);
  });
};

//***************************************
//set up MQTT
//***************************************

client.on("error", function (error) {
  console.log("Error", "Can't connect" + error);
});

client.on("message", function (topic, message) {
  try {
    obj = JSON.parse(message.toString());
    var params = MQTTPattern.exec(pattern_messageType, topic);
    console.log("Info:", "Component Message received: " + params.type);
    if (params.type == "sensor") mqtt_message_sensor(topic, obj);
    if (params.type == "device") mqtt_message_device(topic, obj);
  } catch (err) {
    console.log("Error:", "Can not parse: " + message);
  }
});

//test

const unsubscribe = () => {
  //client.unsubscribe(topic, function () {
  //  console.log("Unsubsribed");
  //});
};

//***************************************
//Process messages received
//***************************************

const mqtt_message_sensor = (topic, message) => {
  var params = MQTTPattern.exec(pattern_messageSensor, topic);
  log = {
    MAC: params.mac,
    component: params.component,
    data: message,
  };
  Log.create(log, function (err, res) {
    if (err) console.log("Error", "Error entering new log");
    else
      console.log(
        "Info:",
        "Logged " + params.component + " from " + params.mac
      );
  });
};

const mqtt_message_device = (topic, message) => {
  var params = MQTTPattern.exec(pattern_messageDevice, topic);
  pmac = params.mac;
  //Check if mac exists in db
  if (message.device.MAC) {
    dmac = message.device.MAC;
    //Check if mac from topic == mac stored in entry
    if (dmac != pmac) console.log("Error", "MAC on message not consistent");
    //Check if device exists
    Device.findOne({ MAC: dmac }, function (err, res) {
      components = [];
      //Check if each component of device exists
      message.components.forEach((component) => {
        console.log(
          "Info:",
          "Device contains :" +
            component.name +
            " with topic " +
            component.topic
        );
        components.push(component.name);
        Component.findOne({ name: component.name }, function (err, res) {
          if (!res) db_create_new_component(component);
          else
            console.log(
              "Info:",
              "Component " +
                component.name +
                " already exists in db with topic " +
                component.topic
            );
        });
      });
      if (!res) {
        db_create_new_device(dmac, message.device, components);
      } else {
        console.log("Info:", dmac + " posted config, already in db");
        db_update_device_components(dmac, components);
      }
      //Update compoents attached to Device
    });
  }
};

//***************************************
// Database Updates
//***************************************
const db_create_new_device = (mac, device, components) => {
  console.log("Info", "create new DEVICE entry for " + mac);
  Device.create(device, function (err, res) {
    if (err) console.log("Error", "Entry creation error");
    if (res) {
      console.log("Info:", "Entry for new device completed");
      db_update_device_components(mac, components);
    }
  });
};

const db_update_device_components = (mac, components) => {
  Device.findOneAndUpdate(
    { MAC: mac },
    { components: components },
    { returnOriginal: false },
    function (err, res) {
      if (err) console.log("Error", "Entry updating component list");
      console.log("Info:", "Component list for " + mac + " updated");
    }
  );
};

const db_create_new_component = (component) => {
  console.log("Info:", "create new component entry for " + component.name);
  Component.create(component, function (err, res) {
    console.log("Info:", res, err);
  });
};
