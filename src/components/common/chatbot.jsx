import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { getMe } from "../../services/AuthService";
import { getOrCreateChatbot } from "../../services/ChatbotService";
import { saveMessages } from "../../services/ChatbotService";
import Draggable from "react-draggable";
import ReactMarkdown from "react-markdown";
import { getuserbyid } from "../../services/AuthService";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [Username, SetUsername] = useState(null);

  const messegeref = useRef(null);
  const chatref = useRef(null);
  const dragref = useRef(null);

  const handleSend = async () => {
    if (selectedImage) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: selectedImage.url, type: "image" },
      ]);
      saveMessages(patientId, "user", selectedImage.url);
      if (input.trim() !== "") {
        setMessages((prev) => [
          ...prev,
          { role: "user", text: input, type: "text" },
        ]);
        saveMessages(patientId, "user", input);
      }
      setSelectedImage(null);
      setInput("");
      setLoading(true);

      const response = await axios.post("http://127.0.0.1:8000/analyze-image", {
        img_url: selectedImage.url,
        query: input.trim() || "",
      });

      saveMessages(patientId, "bot", response.data.answer);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: response.data.answer, type: "text" },
      ]);
      setLoading(false);
      return;
    }

    if (selectedFile) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: `📄 ${selectedFile.name}`, type: "text" },
      ]);
      saveMessages(patientId, "user", `📄 ${selectedFile.name}`);

      if (input.trim() !== "") {
        setMessages((prev) => [
          ...prev,
          { role: "user", text: input, type: "text" },
        ]);
        saveMessages(patientId, "user", input);
      }
      setSelectedFile(null);
      setInput("");
      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile.file);
      formData.append("query", input.trim() || "");

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-pdf",
        formData,
      );

      saveMessages(patientId, "bot", response.data.answer);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: response.data.answer, type: "text" },
      ]);

      setInput("");
      setLoading(false);
      return;
    }

    if (input.trim() === "") return;
    const userMsg = input;
    saveMessages(patientId, "user", userMsg);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg, type: "text" },
    ]);
    setInput("");
    setLoading(true);
    const response = await axios.post("http://127.0.0.1:8000/ask", {
      query: userMsg,
chat_history: [...messages, { role: "user", text: userMsg, type: "text" }],
      user_id: patientId,
      user_name: Username,
    });
    saveMessages(patientId, "bot", response.data.answer).then((data) => {});
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: response.data.answer, type: "text" },
    ]);
    setLoading(false);
  };

  const handlePdfUpload = async (file) => {
    setSelectedFile({
      file,
      name: file.name,
    });
  };
  const handleImageUpload = async (file) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("upload_preset", "Care-24");

    const url = await axios.post(
      "https://api.cloudinary.com/v1_1/dvk6auu6m/image/upload",
      formdata,
    );

    const realurl = url.data.secure_url;

    setSelectedImage({
      file,
      url: realurl,
    });
  };

  useEffect(() => {
    getMe().then((data) => {
      setPatientId(data.userId);
      getuserbyid(data.userId).then((user) => {
        SetUsername(user.name);
      });
    });
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    setOpen(!open);

    if (!open) {
      getOrCreateChatbot(patientId).then((data) => {
        const formatted = data.messages.map((msg) => ({
          role: msg.role,
          text: msg.content,
          type: msg.content.startsWith("https://res.cloudinary.com")
            ? "image"
            : "text",
        }));
        setMessages(formatted);
      });
    }
  };

  const renderedMessages = useMemo(() => {
    return messages.map((msg, i) => (
      <div
        key={i}
        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
            msg.role === "user"
              ? "bg-[#0b7d6e] text-white rounded-tr-none"
              : msg.type === "image"
                ? "bg-green-50 border border-green-200 rounded-tl-none"
                : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
          }`}
        >
          {msg.type === "image" ? (
            <img
              src={msg.text}
              alt="uploaded"
              loading="lazy" decoding="async"
              className="cursor-pointer max-w-[220px] max-h-[200px] w-auto h-auto object-cover rounded-xl"
            />
          ) : (
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          )}
        </div>
      </div>
    ));
  }, [messages]);

  useEffect(() => {
    const handleclickoutside = (e) => {
      if (chatref.current && !chatref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleclickoutside);
    return () => document.removeEventListener("click", handleclickoutside);
  }, []);

  useEffect(() => {
    messegeref.current?.scrollTo({
      top: messegeref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  return (
    <>
      

      <div className="fixed inset-0 pointer-events-none z-50">
        <Draggable
          nodeRef={dragref}
          defaultPosition={{
            x: window.innerWidth - 120,
            y: window.innerHeight - 90,
          }}
        >
          <div
            ref={dragref}
            onClick={(e) => handleToggle(e)}
            className="pointer-events-auto w-fit cursor-grab active:cursor-grabbing bg-[#0b7d6e] p-4 rounded-2xl rounded-tl-none shadow-lg"
          >
            <div className="relative w-9 h-9 bg-white rounded-xl rounded-tl-none">
              <div className="absolute h-[3px] top-3 left-2 rounded-full w-5 bg-[#0b7d6e]"></div>
              <div className="absolute h-[3px] top-5 left-2 rounded-full w-4 bg-[#0b7d6e]"></div>
            </div>
          </div>
        </Draggable>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/10 z-40" />
          <motion.div
            ref={chatref}
            initial={{ opacity: 0, scale: 0.85, y: 80 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 80 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-5  w-[460px] h-[420px] bg-white rounded-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
          >
            
            <div className="bg-[#0b7d6e] text-white px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></div>
              <span
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-lg font-semibold"
              >
                Care{" "}
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#E8622A",
                  }}
                >
                  24
                </span>
              </span>
              <span className="text-xs text-green-200 ml-1 mt-1.5">
                Medical Assistant
              </span>
            </div>

            
            <div
              ref={messegeref}
              className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-3 bg-gray-50"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-25">
                  <span>Hii 👋</span>
                  <br></br>
                  Ask me anything about your health ?
                </div>
              )}
              {renderedMessages}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedImage && (
              <div className="absolute bottom-16 left-3 w-28 h-28 rounded-xl overflow-hidden border-2 border-[#0b7d6e] shadow-md">
                <img
                  src={selectedImage.url}
                  alt="preview"
                  loading="lazy" decoding="async"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    (e.stopPropagation(), setSelectedImage(null));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex  cursor-pointer items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            {selectedFile && (
              <div className="absolute bottom-16 left-3 flex items-center gap-2 bg-white border-2 border-[#0b7d6e] rounded-xl px-3 py-2 shadow-md">
                <span className="text-2xl">📄</span>
                <span className="text-xs text-gray-700 max-w-[120px] truncate">
                  {selectedFile.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex cursor-pointer items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            
            <div className=" relative p-3 border-t bg-white flex gap-2">
              <div className="relative">
                <label className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-[30px] text-gray-500">+</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file.type === "application/pdf") {
                        handlePdfUpload(file);
                      } else {
                        handleImageUpload(file);
                      }
                    }}
                  />
                </label>
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a medical question..."
                className="flex-1  border   border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0b7d6e] transition-colors"
              />
              <button
                onClick={handleSend}
                className="bg-[#0b7d6e] cursor-pointer text-white px-4 rounded-xl text-sm active:scale-95 active:bg-[#085f52] transition-all"
              >
                Send
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}

