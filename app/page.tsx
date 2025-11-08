'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Member = {
  name: string
  email: string
  color: string
  points: number
}

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [error, setError] = useState('')

  const getRandomColor = () =>
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')

  const handleAddMember = () => {
    if (!name || !email) {
      setError('Both name and email are required.')
      return
    }

    const newMember: Member = {
      name,
      email,
      color: getRandomColor(),
      points: 0,
    }

    setMembers([...members, newMember])
    setName('')
    setEmail('')
    setError('')
  }

  const handleNext = () => {
    if (members.length === 0) {
      setError('Please add at least one household member.')
      return
    }

    sessionStorage.setItem('householdMembers', JSON.stringify(members))
    router.push('/tasks')
  }

  return (
    <main className="min-h-screen bg-[#f0f8f4] flex flex-col items-center justify-center p-6 space-y-6 font-sans text-gray-700">
 

      {/* Title */}
      <h1 className="text-4xl font-bold text-[#3a7068] text-center">
        Create Your Household
      </h1>

      {/* Inputs */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border border-[#d6e6dd] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8d5ba] bg-[#f9fdfb]"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-[#d6e6dd] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8d5ba] bg-[#f9fdfb]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleAddMember}
          className="bg-[#fcd595] text-[#4c3b29] w-full py-2 rounded-lg hover:bg-[#fbc87e] transition"
        >
          Add Member
        </button>
      </div>

      {/* Members List */}
      {members.length > 0 && (
        <div className="w-full max-w-md bg-white p-4 rounded-xl shadow space-y-2">
          <h2 className="text-xl font-semibold text-[#3a7068]">Household Members:</h2>
          <ul className="space-y-1">
            {members.map((member, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: member.color }}
                />
                <span>{member.name} — {member.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="bg-[#a8d5ba] text-white px-6 py-2 rounded-lg hover:bg-[#94c7a7] transition"
      >
        Next →
      </button>
    </main>
  )
}

