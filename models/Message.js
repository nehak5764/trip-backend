const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      default: "",
    },
    // 📷 Attachments (image or other files)
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "file", "video"], // extended for flexibility
          default: "image",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Optional: automatically delete empty "attachments" arrays if text is empty too
messageSchema.pre("validate", function (next) {
  if (!this.text && (!this.attachments || this.attachments.length === 0)) {
    next(new Error("Message must have text or an attachment"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Message", messageSchema);
