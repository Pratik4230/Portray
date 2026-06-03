import mongoose, { type InferSchemaType, Schema } from "mongoose"

const contactMessageSchema = new Schema(
  {
    developerUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

contactMessageSchema.index({ developerUserId: 1, createdAt: -1 })

export type ContactMessageDocument = InferSchemaType<
  typeof contactMessageSchema
> & {
  _id: mongoose.Types.ObjectId
  createdAt: Date
}

export const ContactMessage =
  (mongoose.models.ContactMessage as mongoose.Model<ContactMessageDocument>) ??
  mongoose.model<ContactMessageDocument>(
    "ContactMessage",
    contactMessageSchema,
  )
