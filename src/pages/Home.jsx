// src/pages/Home.jsx
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import HubSection from "../components/HubSection";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Mic, StopCircle, DownloadCloud } from "lucide-react";

/**
 * Advanced DMS Assistant
 *
 * Behaviour:
 * 1) Tries POST /api/chat (server proxy) first. If available, uses it with streaming if server supports it.
 * 2) If /api/chat not available and VITE_OPENAI_API_KEY is present, uses the client-side OpenAI call (INSECURE for prod).
 * 3) Otherwise falls back to a local keyword-based assistant.
 *
 * Features:
 * - Streaming assistant responses (token-by-token) when supported.
 * - Quick-reply chips and contextual action buttons (SOS, Call 112, Open Modules).
 * - Local conversation persistence (localStorage).
 * - Export conversation to JSON.
 * - Voice input via Web Speech API (optional).
 *
 * IMPORTANT: For production, provide a secure server endpoint (e.g. /api/chat) that forwards to OpenAI.
 */

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("dmsx_conv");
      return raw ? JSON.parse(raw) : [
        {
          role: "assistant",
          text: "Hi! I'm DMS Assistant — I can help you find modules, emergency support, and quick first-aid tips. Type a question to start.",
          time: new Date().toLocaleTimeString(),
        },
      ];
    } catch {
      return [
        {
          role: "assistant",
          text: "Hi! I'm DMS Assistant — I can help you find modules, emergency support, and quick first-aid tips. Type a question to start.",
          time: new Date().toLocaleTimeString(),
        },
      ];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastStreamId, setLastStreamId] = useState(null);
  const [listAutoScroll, setListAutoScroll] = useState(true);
  const listRef = useRef(null);
  const controllerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [suggestions, setSuggestions] = useState([
    "Show modules for earthquakes",
    "How to treat a burn?",
    "Find emergency helpline",
    "Start flood preparedness module",
  ]);
  const [rateLimitSend, setRateLimitSend] = useState(false);

  // config: server endpoint & env key
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || null;
  const SERVER_CHAT = "/api/chat"; // recommended server proxy

  // persist messages to localStorage
  useEffect(() => {
    localStorage.setItem("dmsx_conv", JSON.stringify(messages));
    if (listAutoScroll && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight + 200;
    }
  }, [messages, listAutoScroll]);

  // helper: minimal local fallback assistant (India-focused)
  const localFallbackReply = (userText) => {
    const txt = (userText || "").toLowerCase();
    // emergency intent
    if (txt.match(/\b(sos|emergency|help|fire|flood|earthquake|rescue)\b/)) {
      return "If this is an emergency, call 112 immediately. For fire, call the local fire brigade. Would you like me to show SOS options or nearby relief resources?";
    }
    if (txt.includes("learn") || txt.includes("module") || txt.includes("course")) {
      return "We have modules on Earthquake, Fire Safety, Flood, Cyclone and Pandemic Safety. Would you like to open the Modules page?";
    }
    if (txt.includes("first aid") || txt.includes("first-aid")) {
      return "Basic first-aid: ensure safety, call for help, check airway/breathing/circulation, apply pressure to major bleeding. For burns: cool with water for 20 minutes and seek medical care.";
    }
    if (txt.includes("hello") || txt.includes("hi")) {
      return "Hello! I can help with modules, emergency steps, or quick first-aid tips. Try: 'Show earthquake module'.";
    }
    return "Thanks for the question — keep your phone charged and memorize emergency numbers (112). Ask me specifics like 'how to treat a burn' or 'show flood module'.";
  };

  // Intent detector for UI actions (very small)
  const detectIntent = (text) => {
    const t = (text || "").toLowerCase();
    if (t.match(/\b(sos|emergency|help|rescue)\b/)) return "emergency";
    if (t.includes("module") || t.includes("learn") || t.includes("course")) return "learning";
    if (t.includes("first aid") || t.includes("first-aid")) return "first_aid";
    return "general";
  };

  // export conversation as JSON
  const exportConversation = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dmsx_conversation_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // copy last assistant reply
  const copyLastReply = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return alert("No assistant reply to copy.");
    try {
      await navigator.clipboard.writeText(last.text);
      alert("Copied assistant reply to clipboard.");
    } catch {
      alert("Copy failed.");
    }
  };

  // abort streaming
  const abortStream = () => {
    try {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setIsStreaming(false);
      setIsLoading(false);
    } catch {}
  };

  // sendMessage: tries server proxy, else direct OpenAI key, else fallback
  const sendMessage = async (e, userTextOverride) => {
    e?.preventDefault?.();
    if (rateLimitSend) return;
    const trimmed = (userTextOverride ?? input).trim();
    if (!trimmed) return;

    // add user message
    const userMsg = { role: "user", text: trimmed, time: new Date().toLocaleTimeString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(false);
    setRateLimitSend(true);
    setTimeout(() => setRateLimitSend(false), 700); // small debounce

    // choose flow
    const useServer = true; // we'll try server first always
    try {
      if (useServer) {
        // Attempt server proxy at /api/chat
        const payload = { messages: [...messages, userMsg] };

        // start abort controller for streaming
        const controller = new AbortController();
        controllerRef.current = controller;

        const res = await fetch(SERVER_CHAT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          // server returned error - fallback to OpenAI or local
          console.warn("Server /api/chat returned", res.status);
          // try OpenAI direct if key available
          if (OPENAI_KEY) {
            await callOpenAIDirect([...messages, userMsg]);
          } else {
            // fallback local
            const reply = localFallbackReply(trimmed);
            setMessages((m) => [...m, { role: "assistant", text: reply, time: new Date().toLocaleTimeString() }]);
            pushSuggestionCandidates(trimmed);
          }
        } else {
          // server responded - try to stream text
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("text/event-stream") || contentType.includes("stream")) {
            // SSE / stream style - parse data: chunks
            setIsStreaming(true);
            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let assistantText = "";
            // create assistant message placeholder and update as we stream
            setMessages((m) => [...m, { role: "assistant", text: "", time: new Date().toLocaleTimeString() }]);
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              // naive parsing: append chunk directly (server should send plain text chunks)
              assistantText += chunk;
              // update last assistant message
              setMessages((m) => {
                // update the last assistant entry (the placeholder we added)
                const copy = [...m];
                for (let i = copy.length - 1; i >= 0; i--) {
                  if (copy[i].role === "assistant") {
                    copy[i] = { ...copy[i], text: assistantText, time: new Date().toLocaleTimeString() };
                    break;
                  }
                }
                return copy;
              });
            }
            setIsStreaming(false);
            setIsLoading(false);
            controllerRef.current = null;
            pushSuggestionCandidates(trimmed);
          } else {
            // assume JSON with assistant reply
            const data = await res.json();
            const assistantText = data?.reply || data?.message || data?.assistant || localFallbackReply(trimmed);
            setMessages((m) => [...m, { role: "assistant", text: assistantText, time: new Date().toLocaleTimeString() }]);
            pushSuggestionCandidates(trimmed);
            setIsLoading(false);
          }
        }
        return;
      }

      // unreachable: but keep safety - try direct key
      if (OPENAI_KEY) {
        await callOpenAIDirect([...messages, userMsg]);
      } else {
        const reply = localFallbackReply(trimmed);
        setMessages((m) => [...m, { role: "assistant", text: reply, time: new Date().toLocaleTimeString() }]);
        pushSuggestionCandidates(trimmed);
      }
    } catch (err) {
      console.error("sendMessage error:", err);
      // if streaming failed or aborted, ensure we have fallback
      if (OPENAI_KEY) {
        try {
          await callOpenAIDirect([...messages, userMsg]);
        } catch {
          const reply = localFallbackReply(trimmed);
          setMessages((m) => [...m, { role: "assistant", text: reply, time: new Date().toLocaleTimeString() }]);
        }
      } else {
        const reply = localFallbackReply(trimmed);
        setMessages((m) => [...m, { role: "assistant", text: reply, time: new Date().toLocaleTimeString() }]);
      }
      setIsLoading(false);
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // helper: call OpenAI directly from client (not recommended for prod)
  const callOpenAIDirect = async (conversationMessages) => {
    if (!OPENAI_KEY) throw new Error("No OpenAI key");
    // build messages for API
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant specialized in disaster preparedness and emergency guidance for India. Keep answers concise, actionable, show step-by-step when relevant, and provide emergency numbers.",
        },
        ...conversationMessages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
      ],
      max_tokens: 700,
      temperature: 0.2,
      stream: true, // try streaming
    };

    // create placeholder assistant message
    setMessages((m) => [...m, { role: "assistant", text: "", time: new Date().toLocaleTimeString() }]);
    setIsStreaming(true);
    controllerRef.current = new AbortController();
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controllerRef.current.signal,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`OpenAI error: ${res.status} ${txt}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let assistantText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // OpenAI stream comes as lines "data: {...}\n\n", parse data lines
      const lines = chunk.split("\n").filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.replace(/^data: /, "");
          if (jsonStr.trim() === "[DONE]") {
            // finished
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            assistantText += delta;
            // update last assistant message
            setMessages((m) => {
              const copy = [...m];
              for (let i = copy.length - 1; i >= 0; i--) {
                if (copy[i].role === "assistant") {
                  copy[i] = { ...copy[i], text: assistantText, time: new Date().toLocaleTimeString() };
                  break;
                }
              }
              return copy;
            });
          } catch (err) {
            // ignore JSON parse error for partial chunks
          }
        } else {
          // not data: - append raw chunk (fallback)
          assistantText += line;
          setMessages((m) => {
            const copy = [...m];
            for (let i = copy.length - 1; i >= 0; i--) {
              if (copy[i].role === "assistant") {
                copy[i] = { ...copy[i], text: assistantText, time: new Date().toLocaleTimeString() };
                break;
              }
            }
            return copy;
          });
        }
      }
    }

    setIsStreaming(false);
    setIsLoading(false);
    controllerRef.current = null;
    pushSuggestionCandidates(assistantText);
    return assistantText;
  };

  // propose suggestion chips based on user input or assistant output
  const pushSuggestionCandidates = (recentText) => {
    const intent = detectIntent(recentText);
    if (intent === "emergency") {
      setSuggestions(["Call 112", "Show SOS actions", "Find nearest relief center"]);
    } else if (intent === "learning") {
      setSuggestions(["Open Modules", "Start Earthquake Module", "Show Fire Safety Module"]);
    } else if (intent === "first_aid") {
      setSuggestions(["How to dress a wound?", "CPR steps", "When to call a doctor"]);
    } else {
      setSuggestions(["Show modules for earthquakes", "How to treat a burn?", "Emergency helpline"]);
    }
  };

  // voice input (Web Speech API)
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    // cleanup on unmount
    return () => {
      recognition.stop?.();
      recognitionRef.current = null;
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice input not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Speech start error:", err);
        setIsRecording(false);
      }
    }
  };

  // keyboard: Enter sends (shift+enter newline) handled via onKeyDown at textarea
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  // small UI action mapping for chips
  const handleChip = (chip) => {
    if (chip.toLowerCase().includes("call")) {
      // e.g., Call 112
      window.open("tel:112");
      return;
    }
    if (chip.toLowerCase().includes("modules") || chip.toLowerCase().includes("module")) {
      // navigate to modules, attempt to use Link: fallback to window location
      try {
        const el = document.createElement("a");
        el.href = "/modules";
        el.click();
      } catch {
        window.location.href = "/modules";
      }
      return;
    }
    // otherwise send chip as message
    setInput(chip);
    sendMessage(null, chip);
  };

  // quick clear conversation
  const resetConversation = () => {
    const starter = {
      role: "assistant",
      text: "Hi! I'm DMS Assistant — I can help you find modules, emergency support, and quick first-aid tips. Type a question to start.",
      time: new Date().toLocaleTimeString(),
    };
    setMessages([starter]);
    localStorage.removeItem("dmsx_conv");
  };

  return (
    <>
      <Hero />
      <HubSection />

      {/* Chatbot widget */}
      <div className="fixed right-6 bottom-6 z-50">
        <div className="flex flex-col items-end">
          <button
            aria-label="Open chatbot"
            onClick={() => setChatOpen((s) => !s)}
            className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white hover:scale-105 transition-transform"
          >
            <MessageSquare size={18} />
            <span className="font-medium">DMS Chat</span>
          </button>

          {chatOpen && (
            <div className="mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden border">
              {/* header */}
              <div className="px-3 py-3 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold">AI</div>
                  <div>
                    <div className="font-medium">DMS Assistant</div>
                    <div className="text-xs opacity-80">Quick help & tips — India</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetConversation}
                    className="text-white/90 text-xs px-2 py-1 rounded hover:bg-white/10"
                    title="Reset conversation"
                  >
                    Reset
                  </button>
                  <button onClick={() => setChatOpen(false)} className="text-white/90 px-2 py-1 rounded hover:bg-white/10">
                    ✕
                  </button>
                </div>
              </div>

              {/* messages */}
              <div ref={listRef} className="px-3 py-3 max-h-72 overflow-auto space-y-3 bg-gradient-to-b from-white to-gray-50">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "assistant" ? "flex" : "flex justify-end"}>
                    <div className={m.role === "assistant" ? "bg-indigo-50 text-indigo-900 px-3 py-2 rounded-lg max-w-[85%] shadow-sm" : "bg-gray-100 text-gray-900 px-3 py-2 rounded-lg max-w-[85%]"}>
                      <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                      {m.time && <div className="text-[10px] text-gray-400 mt-1 text-right">{m.time}</div>}
                    </div>
                  </div>
                ))}

                {isStreaming && (
                  <div className="flex">
                    <div className="bg-indigo-50 text-indigo-900 px-3 py-2 rounded-lg max-w-[65%] shadow-sm animate-pulse">✦ streaming...</div>
                  </div>
                )}

                {isLoading && !isStreaming && (
                  <div className="flex">
                    <div className="bg-indigo-50 text-indigo-900 px-3 py-2 rounded-lg max-w-[65%] shadow-sm animate-pulse">✦ thinking...</div>
                  </div>
                )}
              </div>

              {/* quick suggestion chips */}
              <div className="px-3 py-2 border-t bg-gray-50 flex flex-wrap gap-2">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChip(s)}
                    className="text-xs px-3 py-1 rounded-full bg-white border hover:shadow"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* input & controls */}
              <form onSubmit={sendMessage} className="px-3 py-3 bg-white flex items-center gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about modules, first-aid, or emergencies..."
                  className="flex-1 border rounded-md px-3 py-2 text-sm resize-none h-10 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  aria-label="Chat message input"
                />

                <div className="flex flex-col gap-2 items-center">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    title={isRecording ? "Stop recording" : "Voice input"}
                    className={`p-2 rounded-md border ${isRecording ? "bg-red-100 text-red-700" : "bg-white"}`}
                  >
                    {isRecording ? <StopCircle size={16} /> : <Mic size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // quick clear input
                      setInput("");
                    }}
                    title="Clear input"
                    className="p-2 rounded-md border bg-white"
                  >
                    ✖
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isStreaming}
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white inline-flex items-center gap-2"
                  title="Send message"
                >
                  <Send size={14} />
                  {isLoading || isStreaming ? "..." : "Send"}
                </button>
              </form>

              {/* footer controls */}
              <div className="px-3 py-2 text-xs text-gray-500 border-t bg-gray-50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {OPENAI_KEY ? (
                    <div>Direct OpenAI key available — recommended to use server proxy for production.</div>
                  ) : (
                    <div>Demo mode — using fallback or server proxy (if available).</div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button title="Export conversation" onClick={exportConversation} className="px-2 py-1 rounded bg-white border flex items-center gap-2">
                    <DownloadCloud size={14} /> Export
                  </button>
                  <button title="Copy last assistant reply" onClick={copyLastReply} className="px-2 py-1 rounded bg-white border">
                    Copy
                  </button>
                  <button title="Abort streaming" onClick={abortStream} className="px-2 py-1 rounded bg-white border">
                    Abort
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
