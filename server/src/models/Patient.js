const mongoose = require("mongoose")

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    cpf: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    birthDate: {
      type: String,
      default: ""
    },
    gender: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    clinic: {
      type: String,
      default: ""
    },
    age: {
      type: Number,
      default: null
    },
    weight: {
      type: Number,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    calf: {
      type: Number,
      default: null
    },
    lastEvaluation: {
      type: String,
      default: "Sem avaliação"
    },
    updatedAt: {
      type: String,
      default: () => new Date().toISOString().split("T")[0]
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

module.exports = mongoose.model("Patient", patientSchema)
