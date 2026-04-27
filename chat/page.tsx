export default function ChatPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold text-blue-600">SaveMom AI</h2>
        <div className="mt-6 space-y-3">
          <button className="w-full p-3 bg-blue-100 rounded">Register User</button>
          <button className="w-full p-3 bg-blue-100 rounded">Upload Report</button>
          <button className="w-full p-3 bg-blue-100 rounded">Add Vitals</button>
          <button className="w-full p-3 bg-blue-100 rounded">Book Appointment</button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-4">
            <div className="bg-white p-3 rounded w-fit">
              Hello 👶 I am SaveMom AI. How can I help you today?
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white flex gap-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Type your message..."
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
