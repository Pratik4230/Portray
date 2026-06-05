import mongoose, { type InferSchemaType, Schema } from "mongoose"

const socialLinksSchema = new Schema(
  {
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    x: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { _id: false },
)

const profileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: { type: String, required: true, trim: true },
    headline: { type: String, default: "", trim: true },
    bio: { type: String, default: "", trim: true },
    avatarUrl: { type: String, trim: true },
    location: { type: String, trim: true },
    skills: { type: [String], default: [] },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    isPublic: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

profileSchema.index({ isPublic: 1, username: 1 })

export type ProfileDocument = InferSchemaType<typeof profileSchema> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const Profile =
  (mongoose.models.Profile as mongoose.Model<ProfileDocument>) ??
  mongoose.model<ProfileDocument>("Profile", profileSchema)
