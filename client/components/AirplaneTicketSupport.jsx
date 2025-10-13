import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "react-feather";
import logo from "/assets/openai-logomark.svg";
import paloitlogo_color from "/assets/paloitlogo_color.svg";
import EventLog from "./EventLog";
import SessionControls from "./SessionControls";
import Button from "./Button";

export default function AirplaneTicketSupport() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [transcription, setTranscription] = useState("");
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const eventLogRef = useRef(null);
  const [toggleEventLog, setToggleEventLog] = useState(true);

  // System instruction for airplane ticket support
  const SYSTEM_INSTRUCTION = `You are a helpful and friendly airplane ticket customer support agent. Your role is to assist customers with:

1. Flight booking and reservations
2. Ticket modifications (date changes, seat selection, upgrades)
3. Check-in assistance
4. Baggage policies and fees
5. Flight status and delays
6. Cancellations and refunds
7. Frequent flyer program inquiries
8. General travel information

Be professional, empathetic, and efficient. Always confirm important details with the customer before making changes. If you need information you don't have, politely ask the customer to provide it.

Speak in a natural, conversational tone. Keep your responses concise but informative.`;

  async function startSession() {
    // Get an ephemeral key from the Fastify server
    const tokenResponse = await fetch("/token");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;

    // Create a peer connection
    const pc = new RTCPeerConnection();

    // Set up to play remote audio from the model
    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

    // Add local audio track for microphone input
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    pc.addTrack(ms.getTracks()[0]);

    // Set up data channel for sending and receiving events
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    
    await pc.setRemoteDescription(answer);
    peerConnection.current = pc;
  }

  // Stop current session
  function stopSession() {
    if (dataChannel) {
      dataChannel.close();
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsSessionActive(false);
    setDataChannel(null);
    setTranscription("");
    peerConnection.current = null;
  }

  // Send a message to the model
  function sendClientEvent(message) {
    if (dataChannel) {
      message.event_id = message.event_id || crypto.randomUUID();
      dataChannel.send(JSON.stringify(message));
      setEvents((prev) => [message, ...prev]);
    } else {
      console.error(
        "Failed to send message - no data channel available",
        message,
      );
    }
  }

  function pushToTalk() {
    console.log("push to talk");
    sendClientEvent({ type: "input_audio_buffer.clear" });
  }

  function pushToTalkRelease() {
    console.log("push to talk release");
    sendClientEvent({ type: "input_audio_buffer.commit" });
    sendClientEvent({ type: "response.create" });
  }

  // Send a text message to the model
  function sendTextMessage(message) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  // Attach event listeners to the data channel
  useEffect(() => {
    if (dataChannel) {
      dataChannel.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        console.log("message: ", e.data);
        setEvents((prev) => [event, ...prev]);

        // Update transcription for output
        if (event.type === "response.audio_transcript.delta") {
          setTranscription((prev) => prev + event.delta);
        } else if (event.type === "response.audio_transcript.done") {
          setTranscription((prev) => prev + "\n\n");
        } else if (event.type === "conversation.item.input_audio_transcription.completed") {
          setTranscription((prev) => prev + "User: " + event.transcript + "\n");
        }
      });

      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        setTranscription("");
        
        // Send session update with system instruction
        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: SYSTEM_INSTRUCTION,
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1",
            },
            turn_detection: null, // Disable VAD for push-to-talk
            temperature: 0.8,
          },
        };
        
        sendClientEvent(sessionUpdateEvent);
      });
    }
  }, [dataChannel]);

  const scrollToBottom = () => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
    }
  };

  return (
    <>
      <nav className="sticky top-0 h-16 flex items-center bg-white shadow">
        <div className="flex items-center gap-4 w-full mx-4 p-2">
          <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Home size={20} />
          </Link>
          <img style={{ width: "24px" }} src={logo} alt="OpenAI Logo" />
          <img style={{ width: "100px" }} src={paloitlogo_color} alt="PALO IT Logo" />
          <h1 className="text-xl font-semibold">Airplane Ticket Support Agent</h1>
        </div>
      </nav>

      <main className="flex flex-col h-[calc(100vh-4rem)]">
        <section className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <section className="flex flex-col flex-1 p-4">
            {/* Support Agent Description */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold mb-2 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">✈️</span>
                Customer Support Assistant
              </h2>
              <p className="text-gray-700 text-sm">
                This voice agent can help you with flight bookings, ticket modifications, check-in, 
                baggage inquiries, and general travel questions. Click "Start Session" to begin.
              </p>
            </div>

            {/* Transcription Display */}
            {transcription && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Conversation:</h3>
                <div className="text-sm text-gray-600 whitespace-pre-wrap">{transcription}</div>
              </div>
            )}

            {/* Event Log Container */}
            <div className="flex-1 overflow-y-auto" ref={eventLogRef}>
              {toggleEventLog && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-700">Event Log</h3>
                    <Button 
                      onClick={() => setToggleEventLog(false)}
                      className="text-xs bg-gray-200"
                    >
                      Hide
                    </Button>
                  </div>
                  <EventLog events={events} filterEventLog={[]} />
                </>
              )}
              {!toggleEventLog && (
                <Button 
                  onClick={() => setToggleEventLog(true)}
                  className="text-xs bg-gray-200 mb-2"
                >
                  Show Event Log
                </Button>
              )}
            </div>

            {/* Session Controls */}
            <div className="h-32 pt-4">
              <SessionControls
                startSession={startSession}
                stopSession={stopSession}
                sendClientEvent={sendClientEvent}
                sendTextMessage={sendTextMessage}
                events={events}
                isSessionActive={isSessionActive}
                pushToTalk={pushToTalk}
                pushToTalkRelease={pushToTalkRelease}
              />
            </div>
          </section>

          {/* Side Panel - Tips & Information */}
          <section className="w-80 p-4 bg-gray-50 border-l border-gray-200 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Support Tips</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">How to Use:</h4>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Click "Start Session" to connect</li>
                <li>Click "Push to Talk" and speak your question</li>
                <li>Release when done speaking</li>
                <li>Wait for the agent to respond</li>
                <li>You can also type your message</li>
              </ol>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">Example Requests:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="p-2 bg-white rounded border border-gray-200">
                  "I need to change my flight date"
                </li>
                <li className="p-2 bg-white rounded border border-gray-200">
                  "What's the baggage allowance?"
                </li>
                <li className="p-2 bg-white rounded border border-gray-200">
                  "Can I upgrade to business class?"
                </li>
                <li className="p-2 bg-white rounded border border-gray-200">
                  "I need help with online check-in"
                </li>
                <li className="p-2 bg-white rounded border border-gray-200">
                  "What's the status of my flight?"
                </li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> This is a demonstration. The agent uses AI and may not have access to real flight data.
              </p>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
