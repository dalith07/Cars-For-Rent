/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Send, Loader2 } from "lucide-react"

import {
    getUsersForAdminChat,
    getAdminMessagesWithUser,
    adminSendMessage,
} from "@/actions/chat/messages"

import { UserRole } from "@prisma/client"
import { updateUserStatus } from "@/actions/user/presence"
import { useSession } from "next-auth/react"

// Helper function to format relative time (like WhatsApp/Messenger)
function formatLastSeen(lastSeen: Date | null): string {
    if (!lastSeen) return "Offline"

    const now = new Date()
    const diffMs = now.getTime() - new Date(lastSeen).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)



    if (diffMins < 1) return "Last seen just now"
    if (diffMins < 60) return `Last seen ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `Last seen ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `Last seen ${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    // For older dates, show the actual date
    return `Last seen ${new Date(lastSeen).toLocaleDateString()}`
}

type ChatUser = {
    id: string
    name: string | null
    email: string | null
    image: string | null
    role: UserRole
    unreadCount: number
    isOnline: boolean
    lastSeen: Date | null
    companyName: string | null
}

export default function AdminChatPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<ChatUser[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [text, setText] = useState("")
    const [messagesLoading, setMessagesLoading] = useState(false)

    const sendSoundRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        sendSoundRef.current = new Audio("/sounds/sound_notify.mp3")
    }, [])
    const chatEndRef = useRef<HTMLDivElement>(null)

    /* ================= LOAD USERS ================= */
    useEffect(() => {
        async function loadUsers() {
            const res = await getUsersForAdminChat()
            // ✅ FIX: add lastSeen to match ChatUser type
            setUsers(res.map(u => ({ ...u, lastSeen: u.lastSeen ?? null })))
        }
        loadUsers()
    }, [])

    /* ================= LOAD MESSAGES ================= */
    useEffect(() => {
        if (!selectedUserId) return // ✅ ensure not null

        const userId = selectedUserId // Store in local variable for TypeScript
        let cancelled = false

        async function loadMessages(showLoading: boolean) {
            if (showLoading) setMessagesLoading(true)

            const msgs = await getAdminMessagesWithUser(userId)
            if (!cancelled) {
                setMessages(msgs)
                if (showLoading) setMessagesLoading(false)
                // Scroll to bottom when new messages arrive
                setTimeout(() => {
                    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
                }, 100)
            }
        }

        loadMessages(true)

        const interval = setInterval(() => {
            loadMessages(false)
        }, 2000)

        return () => {
            cancelled = true
            clearInterval(interval)
        }
    }, [selectedUserId])

    /* ================= SEND ================= */
    const handleSend = async () => {
        if (!text.trim() || !selectedUserId) return

        await adminSendMessage(selectedUserId, text)
        setText("")

        sendSoundRef.current?.play().catch(() => { })

        // Refresh messages after sending
        const msgs = await getAdminMessagesWithUser(selectedUserId)
        setMessages(msgs)

        // Scroll to bottom
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }

    const selectedUser = users.find(u => u.id === selectedUserId)

    /* ================= UPDATE CURRENT USER ONLINE STATUS ================= */
    useEffect(() => {
        if (!session?.user.id) return;

        const setOnline = async () => {
            await updateUserStatus(session.user.id, true);
            setUsers(prev =>
                prev.map(u =>
                    u.id === session.user.id ? { ...u, isOnline: true, lastSeen: null } : u
                )
            );
        };

        setOnline(); // immediately set online

        const interval = setInterval(setOnline, 10000); // keep alive

        const handleUnload = async () => {
            await updateUserStatus(session.user.id, false);
        };
        window.addEventListener("beforeunload", handleUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", handleUnload);
            updateUserStatus(session.user.id, false);
        };
    }, [session?.user.id]);


    /* ================= POLL USERS STATUS ================= */
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getUsersForAdminChat();
            // Ensure lastSeen exists and is Date
            const usersWithLastSeen = res.map(u => ({
                ...u,
                lastSeen: u.lastSeen ? new Date(u.lastSeen) : null,
            }));
            setUsers(usersWithLastSeen);
        };

        // Initial load
        fetchUsers();

        // Polling every 3 seconds for real-time updates
        const interval = setInterval(fetchUsers, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#0b141a] text-white overflow-hidden">
            <div className="flex flex-1 overflow-hidden">

                {/* ================= SIDEBAR ================= */}
                <div className="w-80 h-screen chat-scroll bg-[#111b21] border-r border-[#2a3942] flex flex-col">

                    {/* Header */}
                    <div className="p-4 bg-[#202c33] border-b border-[#2a3942] font-semibold">
                        Chats
                    </div>

                    {/* Scrollable users list */}
                    <div className="flex-1 overflow-y-auto">
                        {users.map(user => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUserId(user.id)}
                                className={`w-full flex gap-3 items-center px-4 py-3 border-b border-[#2a3942]
                                            hover:bg-[#202c33] transition
                                            ${selectedUserId === user.id ? "bg-[#2a3942]" : ""}`}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt="avatar"
                                            width={45}
                                            height={45}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-[45px] h-[45px] rounded-full bg-[#00a884] flex items-center justify-center font-bold">
                                            {user.name?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}

                                    {/* Online dot */}
                                    <span
                                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#111b21]
                                                ${user.isOnline ? "bg-green-500" : "bg-gray-500"}`}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-left">
                                    <p className="font-semibold truncate">
                                        {user.name || user.email}
                                    </p>

                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        <span className="text-xs px-2 py-0.5 rounded bg-[#005c4b]">
                                            {user.role}
                                        </span>

                                        {user.companyName && (
                                            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 truncate">
                                                {user.companyName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ================= CHAT ================= */}
                <div className="flex-1 h-screen chat-scroll flex flex-col min-h-0 bg-[#0b141a]">

                    {!selectedUser ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select a chat
                        </div>
                    ) : (
                        <>
                            {/* HEADER */}
                            <div className="flex items-center gap-3 p-4 bg-[#202c33] border-b border-[#2a3942]">
                                <div className="relative">
                                    {selectedUser.image ? (
                                        <Image
                                            src={selectedUser.image}
                                            alt="avatar"
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center">
                                            {selectedUser.name?.[0] || "U"}
                                        </div>
                                    )}
                                    {/* Online/Offline indicator */}
                                    <span
                                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#202c33]
                                            ${selectedUser?.isOnline ? "bg-green-500" : "bg-gray-500"}`}
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {selectedUser.name || selectedUser.email}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {selectedUser?.isOnline
                                            ? "Online"
                                            : formatLastSeen(selectedUser?.lastSeen ?? null)}
                                    </p>
                                </div>
                            </div>

                            {/* MESSAGES */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                                {messagesLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="animate-spin text-primary" size={28} />
                                    </div>
                                ) : (
                                    <>
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`max-w-[70%] p-3 rounded-xl text-sm
                        ${msg.senderId === selectedUserId
                                                        ? "bg-[#202c33] rounded-bl-none"
                                                        : "ml-auto bg-[#005c4b] rounded-br-none"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </>
                                )}
                            </div>

                            {/* INPUT */}
                            <div className="p-3 bg-[#202c33] flex gap-2">
                                <input
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSend()}
                                    placeholder="Type a message"
                                    className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-[#00a884] p-3 rounded-full hover:bg-[#029e7d]"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
