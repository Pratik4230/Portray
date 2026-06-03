import mongoose, { type InferSchemaType, Schema } from "mongoose"

const projectSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, trim: true },
    techStack: { type: [String], default: [] },
    repoUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

projectSchema.index({ userId: 1, slug: 1 }, { unique: true })
projectSchema.index({ userId: 1, order: 1 })

export type ProjectDocument = InferSchemaType<typeof projectSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const Project =
  (mongoose.models.Project as mongoose.Model<ProjectDocument>) ??
  mongoose.model<ProjectDocument>("Project", projectSchema)
