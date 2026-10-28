import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please provide a valid email address').max(200),
  subject: z.string().trim().max(150).optional().or(z.literal('')),
  body: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000),
})

/**
 * POST /api/contact
 * Validates and stores a contact message in PostgreSQL.
 */
export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = contactSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parsed.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      )
    }

    const message = await db.message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        body: parsed.data.body,
      },
    })

    return NextResponse.json(
      { ok: true, id: message.id, message: 'Message sent successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/contact failed:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
