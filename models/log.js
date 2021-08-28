var mongoose = require("../app_be/node_modules/mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("../app_be/node_modules/passport-local-mongoose");

module.exports = function (mongoose) {
  var logSchema = new Schema(
    {
      MAC: { type: String },
      component: { type: String },
      data: { type: Schema.Types.Mixed },
    },
    {
      timestamps: true,
    }
  );

  var Log;
  try {
    Log = mongoose.model("logs");
  } catch (error) {
    Log = mongoose.model("logs", logSchema);
  }
  return Log;
};
