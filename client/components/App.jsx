import { useEffect, useRef, useState } from "react";
import logo from "/assets/openai-logomark.svg";
import palologo from "/assets/paloitlogo.svg";
import EventLog from "./EventLog";
import SessionControls from "./SessionControls";
import ToolPanel from "./ToolPanel";

export default function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [colorPaletteWidth, setColorPaletteWidth] = useState("780");
  const [eventLogScrollPosition, setEventLogScrollPosition] = useState(0);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const eventLogRef = useRef(null);
  const [scrollByPixelsLog, setScrollByPixelsLog] = useState(0);
  const [filterEventLog, setFilterEventLog] = useState([]);

  async function startSession() {
    // Get an ephemeral key from the Fastify server
    //Thai: เรียกใช้ key ที่ถูกสร้างขึ้นใน Fastify server
    const tokenResponse = await fetch("/token");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;

    // Create a peer connection
    //Thai: สร้าง WebRTC peer connection
    const pc = new RTCPeerConnection();

    // Set up to play remote audio from the model
    // Output audio to the audio element
    //Thai: ตั้งค่าเพื่อเล่น audio จาก model
    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

    // Add local audio track for microphone input in the browser
    // Input audio from the user's microphone
    //Thai: เพิ่ม track สําหรับ audio จาก microphone ของผู้ใช้
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    pc.addTrack(ms.getTracks()[0]);

    // Set up data channel for sending and receiving events
    //Thai: ตั้งค่า data channel สําหรับส่งและรับ events
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

    // Start the session using the Session Description Protocol (SDP)
    //Thai: เริ่ม session ด้วย Session Description Protocol (SDP)
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

    console.log({ sdpResponse });

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    console.log({ answer });
    console.log({ pc });
    //Set remote description
    //Thai: ตั้งค่า remote description
    await pc.setRemoteDescription(answer);

    peerConnection.current = pc;
  }

  // Stop current session, clean up peer connection and data channel
  function stopSession() {
    if (dataChannel) {
      dataChannel.close();
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
  }

  // Send a message to the model
  //Thai: ส่ง message ไปยัง model
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

  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    if (dataChannel) {
      // Append new server events to the list
      // Thai: เพิ่ม server events ใหม่เข้าไปใน list
      dataChannel.addEventListener("message", (e) => {
        console.log("message: ", e.data);
        setEvents((prev) => [JSON.parse(e.data), ...prev]);
      });

      // Set session active when the data channel is opened
      // Thai: เซ็ต session ให้เป็น active เมื่อ data channel เปิด
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
      });
    }
  }, [dataChannel]);

  useEffect(() => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = eventLogScrollPosition;
    }
  }, [eventLogScrollPosition]);

  // Scroll by pixels
  // Positive values will scroll down, negative values will scroll up
  const scrollByPixels = (pixels) => {
    if (eventLogRef.current) {
      setScrollByPixelsLog(pixels);
      eventLogRef.current?.scrollBy({
        top: pixels,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
    }
  };

  return (
    <>
      <nav className="sticky top-0 h-16 flex items-center ">
        <div className="flex items-center gap-4 w-full m-4 p-2 border-0 border-b border-solid border-gray-200 bg-gray-500">
          <img style={{ width: "24px" }} src={logo} />
          <img style={{ width: "44px" }} src={palologo} />
          <h1>realtime console modified by PALO IT</h1>
        </div>
      </nav>
      <main className="flex flex-col h-[calc(100vh-4rem)]">
        <section className="flex flex-1 overflow-hidden">
          <section className="flex flex-col flex-1">
            {/* Event Log Container */}
            <div className="flex-1 overflow-y-auto px-4" ref={eventLogRef}>
              <EventLog events={events} filterEventLog={filterEventLog} />
            </div>
            <div className="h-32 p-4">
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
          <section
            style={{ width: `${colorPaletteWidth}px` }}
            className={`p-4 pt-0 overflow-y-auto`}
          >
            <ToolPanel
              sendClientEvent={sendClientEvent}
              sendTextMessage={sendTextMessage}
              events={events}
              isSessionActive={isSessionActive}
              setColorPaletteWidth={setColorPaletteWidth}
              colorPaletteWidth={colorPaletteWidth}
              scrollByPixels={scrollByPixels}
              scrollToTop={scrollToTop}
              scrollToBottom={scrollToBottom}
              setFilterEventLog={setFilterEventLog}
            />
          </section>
        </section>
      </main>
    </>
  );
}
