const mongoose = require("mongoose")

const evaluationSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    patientCpf: {
      type: String,
      required: true,
      trim: true
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    professional: {
      type: String,
      default: "Sistema"
    },
    status: {
      type: String,
      default: "Realizado"
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
      }
    }
  }
)

module.exports = mongoose.model("Evaluation", evaluationSchema)
