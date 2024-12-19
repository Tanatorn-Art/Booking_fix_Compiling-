import { db } from '../../utils/db'
import type { NextApiRequest, NextApiResponse } from 'next'

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = req.body
    const sessionId = generateSessionId()
    await db.insertSession({
      sessionId,
      userId: user.id,
      createdAt: new Date(),
    })

    res.status(200).json({ sessionId })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}