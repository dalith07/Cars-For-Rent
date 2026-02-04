/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCheck, Send, ChevronDown, Trash2, Edit2, X } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { toast } from "sonner"
import Image from "next/image"

import { useCurrentUser } from "@/hooks/use-current-user"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"
import {
    deleteMessageById,
    getMessagesWithAdmin,
    sendMessage,
    updateMessageById,
} from "@/actions/chat/messages"

import { Message } from "@/lib/utils"

dayjs.extend(relativeTime)

export default function UserChatPage() {
    const user = useCurrentUser()
    useOnlineStatus() // keep the current user online/offline state synced

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)

    const [text, setText] = useState("")
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

    const messagesContainerRef = useRef<HTMLDivElement>(null)

    /* ===================== AUDIO ===================== */
    const sendAudioRef = useRef<HTMLAudioElement | null>(null)
    const receiveAudioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        sendAudioRef.current = new Audio("/sounds/send.mp3")
        receiveAudioRef.current = new Audio("/sounds/receive.mp3")

        if (sendAudioRef.current) sendAudioRef.current.volume = 0.4
        if (receiveAudioRef.current) receiveAudioRef.current.volume = 0.4
    }, [])

    /* ===================== LOAD ===================== */
    const loadMessages = async () => {
        const res: any[] = await getMessagesWithAdmin()

        const mapped: Message[] = res.map((msg) => ({
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            sender: msg.sender,
            status: msg.read ? "SEEN" : "DELIVERED",
            createdAt:
                msg.createdAt instanceof Date
                    ? msg.createdAt.toISOString()
                    : msg.createdAt,
        }))

        setMessages((prev) => {
            if (
                prev.length &&
                mapped.length > prev.length &&
                mapped[mapped.length - 1]?.senderId !== user?.id
            ) {
                receiveAudioRef.current?.play().catch(() => { })
            }
            return mapped
        })

        setLoading(false)
    }

    useEffect(() => {
        loadMessages()
        const interval = setInterval(loadMessages, 3000)
        return () => clearInterval(interval)
    }, [])

    /* ===================== SEND / UPDATE ===================== */
    const handleSendOrUpdate = async () => {
        if (!text.trim() || sending) return
        setSending(true)

        try {
            if (editingMessageId) {
                await updateMessageById(editingMessageId, text)

                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === editingMessageId
                            ? { ...m, content: text }
                            : m
                    )
                )

                // toast.success("Message updated")
                setEditingMessageId(null)
                setText("")
            } else {
                // ⏳ استنى الميساج يتبعث
                await sendMessage(text)

                // 🔊 توّا برك شغّل الصوت
                sendAudioRef.current?.play().catch(() => { })

                // toast.success("Message sent")
                setText("")
                loadMessages()
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setSending(false)
        }
    }


    /* ===================== REMOVE ===================== */
    const handleRemove = async (msgId: string) => {
        try {
            await deleteMessageById(msgId)
            setMessages((prev) => prev.filter((m) => m.id !== msgId))
            toast.success("Message deleted")
        } catch {
            toast.error("Cannot delete message")
        } finally {
            setOpenDropdownId(null)
        }
    }

    /* ===================== EDIT ===================== */
    const handleEdit = (msg: Message) => {
        setEditingMessageId(msg.id)
        setText(msg.content)
        setOpenDropdownId(null)
    }

    const cancelEdit = () => {
        setEditingMessageId(null)
        setText("")
    }

    return (
        <div className="h-full flex flex-col bg-[#0b141a] text-white rounded-lg">

            {/* HEADER */}
            <div className="px-4 py-3 bg-[#202c33] rounded-t-lg border-b border-white/20">
                <div className="flex items-center gap-2">
                    <Image src="/logo_chat.png" alt="logo" width={40} height={40} />
                    <div>
                        <h2 className="text-gray-300-300">Admin Supported</h2>
                        <p className="text-sm text-gray-400">
                            Messages auto-delete after 24 hours
                        </p>
                    </div>
                </div>
            </div>

            {/* LOADER */}
            {loading && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}

            {/* MESSAGES */}
            <div
                ref={messagesContainerRef}
                className="flex-1 min-h-0 chat-scroll overflow-y-auto px-4 py-3 space-y-2"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`max-w-[75%] p-3 rounded-xl text-sm relative group
                        ${msg.senderId === user?.id
                                ? "ml-auto bg-[#005c4b] rounded-br-none"
                                : "bg-[#202c33] rounded-bl-none"
                            }`}
                    >
                        <p>{msg.content}</p>

                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-60">
                            <span>
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                            {msg.senderId === user?.id && (
                                <CheckCheck className="w-4 h-4" />
                            )}
                        </div>

                        {msg.senderId === user?.id && (
                            <div className="absolute top-4 -left-7 opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={() =>
                                        setOpenDropdownId(
                                            openDropdownId === msg.id ? null : msg.id
                                        )
                                    }
                                >
                                    <ChevronDown size={24} className="group-hover:scale-125 duration-500" />
                                </button>

                                {openDropdownId === msg.id && (
                                    <div className="absolute bottom-8 right-4 bg-[#202c33] rounded border border-white/20">
                                        <button
                                            className="px-3 w-full py-2 flex gap-2 hover:bg-[#005c4b]"
                                            onClick={() => handleEdit(msg)}
                                        >
                                            <Edit2 size={16} /> Update
                                        </button>
                                        <button
                                            className="px-3 w-full py-2 flex gap-2 hover:bg-red-600"
                                            onClick={() => handleRemove(msg.id)}
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* INPUT */}
            <div className="p-3 bg-[#202c33] border-t border-white/20">
                {editingMessageId && (
                    <div className="text-xs text-yellow-400 mb-1 flex justify-between">
                        Editing message
                        <button onClick={cancelEdit}>
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOrUpdate()}
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-full bg-[#2a3942] outline-none"
                    />
                    <button
                        onClick={handleSendOrUpdate}
                        disabled={sending}
                        className="bg-[#00a884] overflow-hidden group p-4 rounded-full"
                    >
                        <Send
                            size={18}
                            className="group-hover:scale-125 group-hover:-translate-y-7 group-hover:translate-x-7 duration-500"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}
