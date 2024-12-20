import { NextApiRequest, NextApiResponse } from 'next'
import { decrypt } from '@/app/lib/session'

async function getSession(req: NextApiRequest) {
  const sessionCookie = req.cookies.session;
  if (!sessionCookie) return null;
  return decrypt(sessionCookie);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req)

  // Check if the user is authenticated
  if (!session) {
    res.status(401).json({
      error: 'User is not authenticated',
    })
    return
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== 'admin') {
    res.status(401).json({
      error: 'Unauthorized access: User does not have admin privileges.',
    })
    return
  }

  // Proceed with the route for authorized users
  // ... implementation of the API Route
}