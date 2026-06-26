"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";

type Msg = { type: "user" | "ai"; text: string };

export default function AIPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [loading, setLoading] = useState(false);

    const messagesRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    // auto scroll
    useEffect(() => {
        const el = messagesRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userText = input;
        setInput("");

        setMessages((p) => [...p, { type: "user", text: userText }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    userId: session?.user?.id,
                    messages: [{ role: "user", content: userText }],
                }),
            });

            if (!res.body) throw new Error("No stream");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let aiText = "";

            setMessages((p) => [...p, { type: "ai", text: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                aiText += chunk;

                setMessages((p) => {
                    const copy = [...p];
                    copy[copy.length - 1] = { type: "ai", text: aiText };
                    return copy;
                });
            }
        } catch (e) {
            console.error(e);
            setMessages((p) => [
                ...p,
                { type: "ai", text: "Error generating response" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-68px)] mt-20 w-full flex justify-center">
            {/* chat container */}
            <div className="relative flex flex-col w-full max-w-5xl h-full">

                {/* messages */}
                <div
                    ref={messagesRef}
                    className="
            absolute inset-0 custom-scrollbar 
            overflow-y-auto
            flex flex-col gap-3
            p-3 sm:p-4 md:p-6
            pb-28
            bg-accent dark:bg-blue-950/20
            sm:rounded-2xl"
                >
                    {/* {messages.map((m, i) => (
                        <div
                            key={i}
                            className={
                                m.type === "user"
                                    ? "self-end bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
                                    : "self-start bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
                            }
                        >
                            {m.text}
                        </div>
                    ))} */}

                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={
                                m.type === "user"
                                    ? "self-end bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
                                    : "self-start bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
                            }
                        >
                            {m.type === "ai" ? (
                                <span dangerouslySetInnerHTML={{ __html: m.text }} />
                            ) : (
                                m.text
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="self-start bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-2xl animate-pulse">
                            AI is typing...
                        </div>
                    )}
                </div>

                {/* input fixed */}
                <div
                    className="
            absolute bottom-0 left-0 right-0
            p-2 sm:p-3
            bg-linear-to-t from-background via-background/80 to-transparent
          "
                >
                    <div className="flex gap-2 items-center bg-background/80 backdrop-blur-xl border rounded-xl p-2 shadow-lg">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about cars..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            className="border-0 focus-visible:ring-0 text-sm sm:text-base"
                        />

                        <Button
                            onClick={sendMessage}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white shrink-0"
                        >
                            <Send size={18} />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
