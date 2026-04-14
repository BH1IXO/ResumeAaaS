import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "./prisma"
import type { User } from "@prisma/client"

export async function getOrCreateUser(): Promise<User> {
  const { userId } = auth()
  if (!userId) throw new Error("Unauthorized")

  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error("Unauthorized")

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@noemail.local`

  return prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: { email },
  })
}
