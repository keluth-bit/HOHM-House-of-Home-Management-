'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Member = {
  name: string
  email: string
  color: string
}

type Task = {
  title: string
  date: string
  time: string
  assignedTo: string
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [error, setError] = useState('')

  useEffect (() => {
    const stored = sessionStorage.getItem('householdMembers')
    if (stored) {
      setMembers(JSON.parse(stored))
    } else {
      router.push('/')
    }
  }, [router])

  const handleAddTask = () => {
    if (!title || !date || !time || !assignedTo) {
      setError('Please fill in all fields.')
      return
    }

    const newTask: Task = { title, date, time, assignedTo }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    sessionStorage.setItem('householdTasks', JSON.stringify(updatedTasks))

    setTitle('')
    setDate('')
    setTime('')
    setAssignedTo('')
    setError('')
  }

  const handleNext = () => {
    if (tasks.length === 0) {
      setError('Please add at least one task.')
      return
    }
    router.push('/calendar')
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#f0f8f4] flex flex-col items-center justify-center p-6 space-y-6 font-sans text-gray-700">
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#3a7068] text-center">Assign Tasks</h1>
      <p className="text-gray-600 text-center max-w-md">
        Add tasks for your household and assign them to each member.
      </p>

      {/* Task Form */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Task Name"
          className="w-full border border-[#d6e6dd] px-4 py-2 rounded-lg bg-[#f9fdfb] focus:outline-none focus:ring-2 focus:ring-[#a8d5ba]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="w-full border border-[#d6e6dd] px-4 py-2 rounded-lg bg-[#f9fdfb]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          className="w-full border border-[#d6e6dd] px-4 py-2 rounded-lg bg-[#f9fdfb]"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <select
          className="w-full border border-[#d6e6dd] px-4 py-2 rounded-lg bg-[#f9fdfb]"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Select Member</option>
          {members.map((m, i) => (
            <option key={i} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          className="bg-[#fcd595] text-[#4c3b29] w-full py-2 rounded-lg hover:bg-[#fbc87e] transition"
        >
          ➕ Add Task
        </button>
      </div>

      {/* Task List */}
      {tasks.length > 0 && (
        <div className="w-full max-w-md bg-white p-4 rounded-xl shadow space-y-2">
          <h2 className="text-xl font-semibold text-[#3a7068]">Tasks:</h2>
          <ul className="space-y-1">
            {tasks.map((task, i) => (
              <li key={i} className="text-gray-700 flex items-center gap-2">
                <span>📌</span>
                <span>
                  <strong>{task.title}</strong> — {task.date} at {task.time} →{' '}
                  <span className="text-[#3a7068] font-medium">{task.assignedTo}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleBack}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="bg-[#a8d5ba] text-white px-6 py-2 rounded-lg hover:bg-[#94c7a7] transition"
        >
          Next →
        </button>
      </div>
    </main>
  )
}
