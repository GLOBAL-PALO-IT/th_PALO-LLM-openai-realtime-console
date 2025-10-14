import { Link } from "react-router-dom";
import logo from "/assets/openai-logomark.svg";
import paloitlogo_color from "/assets/paloitlogo_color.svg";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 h-16 flex items-center bg-white shadow">
        <div className="flex items-center gap-4 w-full m-4 p-2">
          <img style={{ width: "24px" }} src={logo} alt="OpenAI Logo" />
          <img style={{ width: "100px" }} src={paloitlogo_color} alt="PALO IT Logo" />
          <h1 className="text-xl font-semibold">PALO IT Voice Agent Dashboard</h1>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to PALO IT Voice Agent Dashboard</h2>
          <p className="text-gray-600 mb-8">
            Explore our voice agent demonstrations powered by OpenAI Realtime API with WebRTC.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Realtime Console Card */}
            <Link 
              to="/console" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <img src={logo} alt="OpenAI" className="w-12 h-12 mr-4" />
                <h3 className="text-xl font-semibold text-gray-800">Realtime Console</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Interactive console with tools for color palette, event log filtering, and real-time voice interaction.
              </p>
              <div className="text-blue-600 font-medium">
                Explore Console →
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Features:
                <ul className="list-disc list-inside mt-2">
                  <li>Voice activity detection</li>
                  <li>Event logging and filtering</li>
                  <li>Color palette tools</li>
                  <li>Push-to-talk functionality</li>
                </ul>
              </div>
            </Link>

            {/* Airplane Ticket Support Card */}
            <Link 
              to="/ticket-support" 
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 flex items-center justify-center bg-blue-100 rounded-full">
                  <span className="text-2xl">✈️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Airplane Ticket Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Voice-powered customer support agent for airplane ticket inquiries and assistance.
              </p>
              <div className="text-blue-600 font-medium">
                Try Support Agent →
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Capabilities:
                <ul className="list-disc list-inside mt-2">
                  <li>Flight booking assistance</li>
                  <li>Ticket modifications</li>
                  <li>Check-in support</li>
                  <li>General inquiries</li>
                </ul>
              </div>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">About This Dashboard</h3>
            <p className="text-gray-700">
              This dashboard showcases different voice agent implementations using OpenAI's Realtime API. 
              Each demonstration highlights different use cases and capabilities of voice AI technology.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
