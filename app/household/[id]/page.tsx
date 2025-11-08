import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Props {
  params: {
    id: string
  }
}

export default async function HouseholdPage({ params }: Props) {
  const householdId = parseInt(params.id)

  const household = await prisma.household.findUnique({
    where: { id: householdId },
  })

  if (!household) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl text-red-500">Household not found.</h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">🏡 {household.name}</h1>
      <p className="text-gray-600">Household ID: {household.id}</p>
      <p className="text-gray-600">Created: {new Date(household.createdAt).toLocaleString()}</p>

      {/* Optional: Add more features below later */}
    </main>
  )
}
