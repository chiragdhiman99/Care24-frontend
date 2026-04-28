import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMe, getuserbyid } from "../../services/AuthService";
import { getMessagesbyId } from "../../services/MessageService";
import { getConversationbyCaregiverId } from "../../services/ConversationService";
import socket from "../../utils/socket";
import { useRef } from "react";
import { getunreadcounts } from "../../services/MessageService";
import { sendimage } from "../../services/MessageService";
import {
  MessageCircle,
  Stethoscope,
  FileText,
  Smile,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function MessagesTab({ caregiverId, onUnreadChange }) {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [conversationData, setConversationData] = useState(null);
  const [caregiversData, setCaregiversData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineusers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [istyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [selectedfile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [totalunread, setTotalUnread] = useState(0);

  const IMAGE_BASE = "https://care24-backend.onrender.com";

  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = [
    "😊",
    "😂",
    "😍",
    "🥰",
    "😎",
    "😭",
    "😅",
    "🤣",
    "👍",
    "🙏",
    "💪",
    "🔥",
    "❤️",
    "💯",
    "🎉",
    "✅",
    "😆",
    "🤩",
    "😘",
    "🥳",
    "😇",
    "🤔",
    "😴",
    "🤯",
    "👏",
    "🫶",
    "✌️",
    "🤞",
    "💀",
    "👀",
    "🫠",
    "🙈",
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stopTyping", () => {
      setIsTyping(false);
    });
  }, []);

  const handledownload = async (url) => {
    const fileName = url.replace("https://care24-backend.onrender.com/uploads/", "");
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  useEffect(() => {
    socket.emit("getOnlineUsers");

    socket.on("onlineUsersList", (usersMap) => {
      const onlineMap = {};
      Object.keys(usersMap).forEach((uid) => {
        onlineMap[uid] = true;
      });
      setOnlineUsers(onlineMap);
    });

    socket.on("userStatus", (data) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [data.userId]: data.online,
      }));
    });

    return () => {
      socket.off("userStatus");
      socket.off("onlineUsersList");
    };
  }, []);

  useEffect(() => {
    getMe()
      .then((data) => {
        setUserId(data.userId);
      })
      .catch(() => {
        toast.error("Something went wrong, please try again.");
      });
  }, []);

  useEffect(() => {
    if (!conversationData) return;
    const patientlist = [];
    conversationData.forEach((conv) => {
      getuserbyid(conv.patientId).then((data) => {
        patientlist.push({
          ...data,
          conversationId: conv._id,
        });
        setCaregiversData([...patientlist]);
      });
      getunreadcounts(conv._id).then((data) => {
        setUnreadCounts((prev) => ({
          ...prev,
          [conv._id]: data.count,
        }));
      });
    });
  }, [conversationData]);

  const selectedCaregiver = caregiversData?.find((c) => c._id === selected);
  useEffect(() => {
    if (caregiversData && caregiversData.length > 0 && !selected) {
      setSelected(caregiversData[0]._id);
    }
  }, [caregiversData]);

  useEffect(() => {
    socket.on("messageseen", () => {
      setMessages((messages) => messages.map((m) => ({ ...m, isRead: true })));
    });

    return () => socket.off("messageseen");
  }, []);

  useEffect(() => {
    if (!selectedCaregiver) return;
    socket.emit("joinconversation", selectedCaregiver.conversationId);
    socket.emit("markseen", selectedCaregiver.conversationId);
    setUnreadCounts((prev) => ({
      ...prev,
      [selectedCaregiver.conversationId]: 0,
    }));
    setMessages([]);
    getMessagesbyId(selectedCaregiver.conversationId).then((data) => {
      setMessages(data);
    });
  }, [selected]);

  useEffect(() => {
    const total = Object.values(unreadCounts).reduce(
      (sum, c) => sum + (c || 0),
      0,
    );
    setTotalUnread(total);
    onUnreadChange?.(total);
  }, [unreadCounts]);

  useEffect(() => {
    if (!caregiverId) return;
    getConversationbyCaregiverId(caregiverId).then((data) => {
      setConversationData(data);
    });
  }, [caregiverId]);

  const handleTyping = (text) => {
    if (text) {
      socket.emit("typing", selectedCaregiver.conversationId);
    } else {
      socket.emit("stopTyping", selectedCaregiver.conversationId);
    }
  };

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji);
  };

  const sendMessage = async () => {
    if (input.trim() === "" && !selectedfile) return;
    setShowEmojis(false);

    let fileUrl = null;
    let fileType = null;

    if (selectedfile) {
      const formData = new FormData();
      formData.append("file", selectedfile);
      const res = await sendimage(formData);
      fileUrl = res.fileUrl;
      fileType = res.fileType;
    }

    socket.emit("sendmessage", {
      conversationId: selectedCaregiver.conversationId,
      senderId: userId,
      senderType: "caregiver",
      content: input,
      fileUrl,
      fileType,
    });

    socket.emit("stopTyping", selectedCaregiver.conversationId);
    setInput("");
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  useEffect(() => {
    socket.on("newmessage", (data) => {
      if (
        selectedCaregiver &&
        data.conversationId === selectedCaregiver.conversationId
      ) {
        setMessages((prev) => [...prev, data]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.conversationId]: (prev[data.conversationId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.off("newmessage");
    };
  }, [selectedCaregiver]);

  return (
    <div className="flex gap-5 h-[calc(100vh-160px)] min-h-[500px]">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className={`w-full md:w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1 ${selected ? "hidden md:flex" : "flex"}`}
      >
        {caregiversData &&
          caregiversData.map((c, i) => (
            <motion.div
              key={c._id}
              variants={fadeUp}
              custom={i}
              onClick={() => {
                setSelected(c._id);
                setUnreadCounts((prev) => ({
                  ...prev,
                  [c.conversationId]: 0,
                }));
              }}
              className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                selected === c._id
                  ? "bg-[#0D6B5E] shadow-md "
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm
  ${selected === c._id ? "bg-white/20" : "bg-[#0D6B5E]"}`}
                >
                  {c.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
  ${onlineusers[c._id] ? "bg-emerald-400" : "bg-gray-400"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm truncate ${selected === c._id ? "text-white" : "text-gray-800"}`}
                >
                  {c.name}
                </p>
                <p
                  className={`text-xs truncate ${selected === c._id ? "text-white/60" : "text-gray-400"}`}
                >
                  {c.email}
                </p>
              </div>
              {unreadCounts[c.conversationId] > 0 && (
                <span className="bg-[#E8642A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCounts[c.conversationId]}
                </span>
              )}
            </motion.div>
          ))}
        {(!caregiversData || caregiversData.length === 0) && (
          <div className="flex flex-col items-center -mt-10 justify-center h-full py-10 text-center">
            <div className="text-4xl mb-3">
              <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            </div>
            <p className="font-bold text-gray-700 text-sm">
              No conversations yet
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Clients will reach out to you once they book your services
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 bg-white rounded-2xl -mt-3 flex-col overflow-hidden"
        style={{
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: selected ? "flex" : "none",
        }}
      >
        {!selectedCaregiver ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="text-5xl mb-4">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            </div>
            <p className="font-bold text-gray-700 text-base">
              No chat selected
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Select a caregiver from the left to start a conversation
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <button
                onClick={() => setSelected(null)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 flex-shrink-0"
              >
                ←
              </button>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ backgroundColor: selectedCaregiver?.color }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-[#0D6B5E] flex-shrink-0">
                  {selectedCaregiver?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {selectedCaregiver?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedCaregiver?.role} ·{" "}
                  {onlineusers[selectedCaregiver?._id]
                    ? "🟢 Online"
                    : "⚫ Offline"}{" "}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      m.senderId === userId
                        ? m.fileUrl && !m.content
                          ? "bg-gray-100  rounded-br-sm"
                          : "bg-[#0D6B5E] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {m.fileUrl && m.fileType === "image" && (
                      <div className="relative">
                        <img
                          src={`${IMAGE_BASE}${m.fileUrl}`}
                          loading="lazy" decoding="async"
                          className="w-40 h-40 rounded-xl object-cover"
                        />
                        <a
                          onClick={() =>
                            handledownload(`${IMAGE_BASE}${m.fileUrl}`)
                          }
                          className="absolute cursor-pointer top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                      </div>
                    )}
                    {m.fileUrl && m.fileType === "pdf" && (
                      <div className="relative flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-xl">
                        📄 <span className="text-sm">PDF File</span>
                        <a
                          onClick={() =>
                            handledownload(`${IMAGE_BASE}${m.fileUrl}`)
                          }
                          className="absolute cursor-pointer top-10  -right-2 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </a>
                      </div>
                    )}
                    <p>{m.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        m.senderId === userId
                          ? m.fileUrl && !m.content
                            ? "text-gray-400"
                            : "text-white/50"
                          : "text-gray-400"
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {m.senderId === userId && (
                        <span className="text-[10px] ml-1">
                          {m.isRead ? (
                            <span className="text-green-400">✓✓</span>
                          ) : (
                            <span className="text-gray-400">✓✓</span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="w-100 absolute bottom-20 bg-amber-50 p-2 rounded-bl-none rounded-3xl"
                >
                  {emojis.map((e, i) => (
                    <span key={i} onClick={() => handleEmojiClick(e)}>
                      <span className="inline-block cursor-pointer hover:scale-125 transition-transform text-2xl">
                        {e}
                      </span>
                    </span>
                  ))}
                </motion.div>
              )}
              {istyping && (
                <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-2xl w-fit">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            <div className=" relative px-5 mb-4 ml-14  py-4 border-t border-gray-100 flex gap-3 items-center">
              <div className="absolute bottom-20 -left-10">
                {previewUrl && (
                  <div className="relative w-20 h-20">
                    <img
                      src={previewUrl}
                      loading="lazy" decoding="async"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-[#0D6B5E]"
                    />

                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setInput("");
                      }}
                      className="absolute cursor-pointer -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <span
                onClick={() => fileInputRef.current.click()}
                className="absolute text-[42px] cursor-pointer bottom-2 -left-12 "
              >
                +
              </span>
              <input
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }}
                type="file"
              />
              <span
                onClick={() => setShowEmojis(!showEmojis)}
                className=" absolute hover:scale-125 transition-all text-[22px] cursor-pointer top-4 -left-4"
              >
                😊
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleTyping(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                    setShowEmojis(false);
                  }
                }}
                placeholder="Type a message..."
                className="w-130 bg-gray-100  rounded-xl px-2 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#0D6B5E]/20"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-[#0D6B5E] rounded-xl flex items-center justify-center text-white hover:bg-[#0a5a4e] transition-colors flex-shrink-0"
              >
                ➤
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
