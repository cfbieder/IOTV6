var mongoose = require("../app_be/node_modules/mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("../app_be/node_modules/passport-local-mongoose");

module.exports = function (mongoose) {
  var componentSchema = new Schema(
    {
      MAC: { type: String },
      name: { type: String },
      topic: { type: String },
      tags: [String],
      info: [String],
      components: [String],
      location: { type: String },
    },
    {
      timestamps: true,
    }
  );

  var Device;
  try {
    Device = mongoose.model("devices");
  } catch (error) {
    Device = mongoose.model("devices", componentSchema);
  }
  return Device;
};
