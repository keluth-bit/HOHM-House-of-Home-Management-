'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
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
  comments?: string[]
  completed?: boolean
  rating?: number
}

export default function CalendarPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [newComment, setNewComment] = useState('')
  const [showCompletionPopup, setShowCompletionPopup] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const storedMembers = sessionStorage.getItem('householdMembers')
    const storedTasks = sessionStorage.getItem('householdTasks')

    if (storedMembers && storedTasks) {
      setMembers(JSON.parse(storedMembers))
      setTasks(JSON.parse(storedTasks))
    } else {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedTask?.comments])

  const handleDateClick = (value: Date) => {
    setSelectedDate(value)
    const dateStr = value.toLocaleDateString('en-CA')
    const tasksForDay = tasks.filter((task) => task.date === dateStr)
    setSelectedTasks(tasksForDay)
  }

  const getMemberColor = (name: string) =>
    members.find((m) => m.name === name)?.color || '#000'

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  const handleAddComment = () => {
    if (selectedTask && newComment.trim()) {
      const updatedTasks = tasks.map((t) =>
        t.title === selectedTask.title && t.date === selectedTask.date && t.time === selectedTask.time
          ? { ...t, comments: [...(t.comments || []), newComment] }
          : t
      )
      updateTasks(updatedTasks)
      setNewComment('')
    }
  }

  const handleToggleComplete = () => {
    if (selectedTask) {
      const updatedTasks = tasks.map((t) =>
        t.title === selectedTask.title && t.date === selectedTask.date && t.time === selectedTask.time
          ? { ...t, completed: !t.completed }
          : t
      )

      updateTasks(updatedTasks)

      const taskJustCompleted = !selectedTask.completed
      if (taskJustCompleted) {
        setShowCompletionPopup(true)
        setTimeout(() => setShowCompletionPopup(false), 3000)
      }
    }
  }

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rating = parseInt(e.target.value)
    if (selectedTask && !isNaN(rating)) {
      const updatedTasks = tasks.map((t) =>
        t.title === selectedTask.title && t.date === selectedTask.date && t.time === selectedTask.time
          ? { ...t, rating }
          : t
      )
      updateTasks(updatedTasks)
    }
  }

  const updateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks)
    sessionStorage.setItem('householdTasks', JSON.stringify(updatedTasks))
    const updated = updatedTasks.find(
      (t) =>
        t.title === selectedTask?.title &&
        t.date === selectedTask?.date &&
        t.time === selectedTask?.time
    )
    setSelectedTask(updated || null)
  }

  const handleBack = () => {
    router.push('/tasks')
  }

  const tasksForMember = selectedMember
    ? tasks.filter((task) => task.assignedTo === selectedMember.name)
    : []

  const taskDates = useMemo(() => {
    return new Set(tasks.map((task) => task.date))
  }, [tasks])

  const getAverageRating = (memberName: string): string | null => {
    const ratedTasks = tasks.filter(
      (task) => task.assignedTo === memberName && typeof task.rating === 'number'
    )
    if (ratedTasks.length === 0) return null
    const total = ratedTasks.reduce((sum, t) => sum + (t.rating || 0), 0)
    const avg = total / ratedTasks.length
    return avg.toFixed(1)
  }

  return (
    <main className="min-h-screen bg-[#f0f8f4] p-6 font-sans text-gray-700">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4 max-w-6xl mx-auto">
        <button className="text-sm bg-[#a8d5ba] text-white px-4 py-2 rounded-lg hover:bg-[#94c7a7] transition">
          ← Go to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-[#3a7068]">Household Task Calendar</h1>
        <div className="w-[140px]">{/* spacer for alignment */}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Calendar */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-[#3a7068]">Select a date</span>
            <button className="text-sm bg-[#fcd595] text-[#4c3b29] px-3 py-1 rounded hover:bg-[#fbc87e]">
              📆 Integrate with Google Calendar
            </button>
          </div>

          <div className="rounded-xl shadow-md bg-white p-4">
            <Calendar
              onClickDay={handleDateClick}
              tileClassName={({ date }) => {
                const dateStr = date.toLocaleDateString('en-CA')
                return taskDates.has(dateStr)
                  ? 'bg-indigo-200 text-indigo-900 font-semibold rounded-full border border-indigo-500'
                  : ''
              }}
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const dateStr = date.toLocaleDateString('en-CA')
                  const dayTasks = tasks.filter((t) => t.date === dateStr)
                  if (dayTasks.length > 0) {
                    const allDone = dayTasks.every((t) => t.completed)
                    const icon = allDone ? '✅' : '📌'
                    return <div className="text-xs text-center mt-1">{icon}</div>
                  }
                }
                return null
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h2 className="text-xl font-semibold text-[#3a7068]">Legend</h2>
            <ul>
              {members.map((m, i) => (
                <li
                  key={i}
                  className="flex items-center space-x-2 cursor-pointer hover:underline"
                  onClick={() => setSelectedMember(m)}
                >
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <span>
                    {m.name}
                    {(() => {
                      const avg = getAverageRating(m.name)
                      return avg ? ` — ⭐ ${avg}` : ''
                    })()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {selectedDate && (
            <div className="bg-white p-4 rounded-xl shadow space-y-2">
              <h3 className="font-semibold text-[#3a7068]">
                Tasks on {selectedDate.toDateString()}:
              </h3>
              {selectedTasks.length > 0 ? (
                <ul className="space-y-1">
                  {selectedTasks.map((task, i) => (
                    <li
                      key={`${task.title}-${i}`}
                      className="cursor-pointer hover:underline"
                      style={{ color: getMemberColor(task.assignedTo) }}
                      onClick={() => handleTaskClick(task)}
                    >
                      {task.time} — {task.title} ({task.assignedTo})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No tasks for this day.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold">{selectedTask.title}</h2>
            <p><strong>Assigned:</strong> {selectedTask.assignedTo}</p>
            <p><strong>Due:</strong> {selectedTask.date} at {selectedTask.time}</p>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTask.completed || false}
                onChange={handleToggleComplete}
              />
              <span>Mark as completed</span>
            </label>

            {selectedTask.completed && (
              <div>
                <label className="block mt-2">Rate this task:</label>
                <select
                  className="border rounded px-2 py-1"
                  value={selectedTask.rating || ''}
                  onChange={handleRatingChange}
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Star{n > 1 && 's'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <h3 className="font-semibold mt-4">Comments</h3>
              <ul className="list-disc ml-4 space-y-1 max-h-24 overflow-y-auto">
                {(selectedTask.comments || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
                <div ref={commentsEndRef} />
              </ul>
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full border mt-2 px-2 py-1 rounded"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
              >
                Add Comment
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedTask(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
            <h2 className="text-xl font-bold">Tasks for {selectedMember.name}</h2>
            {tasksForMember.length > 0 ? (
              <ul className="space-y-2">
                {tasksForMember.map((task, i) => (
                  <li key={i}>
                    {task.date} at {task.time} — {task.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No tasks assigned.</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎉 Completion Popup */}
      {showCompletionPopup && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          🎉 Congratulations, your task is completed! We've added <strong>10pts</strong> to your account!
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          ← Go Back
        </button>
      </div>
    </main>
  )
}
