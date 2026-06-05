import mongoose, { type InferSchemaType, Schema } from "mongoose"

const experienceSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, default: null, trim: true },
    description: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

experienceSchema.index({ userId: 1, order: 1 })

export type ExperienceDocument = InferSchemaType<typeof experienceSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const Experience =
  (mongoose.models.Experience as mongoose.Model<ExperienceDocument>) ??
  mongoose.model<ExperienceDocument>("Experience", experienceSchema)
