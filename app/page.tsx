export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-800 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome to HOHM</h1>
      <p className="text-lg text-center max-w-xl mb-6">
        HOHM (House of Home Management) helps roommates divide chores fairly, send friendly reminders, and keep your shared home in perfect harmony — without the drama.
      </p>

      {/* Email Sign-up Form */}
      <form
        action="https://formspree.io/f/xpwogvow" // replace with your actual Formspree link
        method="POST"
        className="w-full max-w-md space-y-4"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Sign Up for Early Access
        </button>
      </form>
    </main>
  );
}

