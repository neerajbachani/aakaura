import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

export async function findOrCreateGuidanceUser(data: {
  email: string;
  name: string;
  phone: string;
}) {
  const email = data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: data.name || existing.name,
        phone: data.phone || existing.phone,
      },
    });
  }

  const randomPassword = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await hashPassword(randomPassword);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
    },
  });
}
