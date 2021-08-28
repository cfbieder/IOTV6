var mongoose = require("../app_be/node_modules/mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("../app_be/node_modules/passport-local-mongoose");

module.exports = function (mongoose) {
  var componentSchema = new Schema(
    {
      name: {
        type: String,
      },
      type: {
        type: String,
      },
      topic: {
        type: String,
      },
      tags: [String],
      info: [String],
    },
    {
      timestamps: true,
    }
  );

  var Component;
  try {
    Component = mongoose.model("components");
  } catch (error) {
    Component = mongoose.model("components", componentSchema);
  }
  return Component;
};
