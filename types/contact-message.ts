export type ContactMessageDTO = {
  id: string
  developerUserId: string
  senderName: string
  senderEmail: string
  subject: string
  body: string
  read: boolean
  createdAt: string
}

export type ContactActionState = {
  success: boolean
  error: string | null
}

export type MarkMessageReadState = {
  success: boolean
  error: string | null
}
