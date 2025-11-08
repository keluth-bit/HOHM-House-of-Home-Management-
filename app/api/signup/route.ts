import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  return NextResponse.json({ success: true })
}
