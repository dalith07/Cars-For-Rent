// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { Loader2, Send } from "lucide-react";
// import { useSession } from "next-auth/react";

// import { AnimatePresence, motion } from "framer-motion";

// type Msg = { type: "user" | "ai"; text: string };

// export default function AIPage() {
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState<Msg[]>([]);
//     const [loading, setLoading] = useState(false);

//     const messagesRef = useRef<HTMLDivElement>(null);
//     const { data: session } = useSession();

//     // auto scroll
//     useEffect(() => {
//         const el = messagesRef.current;
//         if (!el) return;

//         el.scrollTo({
//             top: el.scrollHeight,
//             behavior: "smooth",
//         });
//     }, [messages, loading]);

//     const sendMessage = async () => {
//         if (!input.trim() || loading) return;

//         const userText = input;
//         setInput("");

//         setMessages((p) => [...p, { type: "user", text: userText }]);
//         setLoading(true);

//         try {
//             const res = await fetch("/api/chat", {
//                 method: "POST",
//                 body: JSON.stringify({
//                     userId: session?.user?.id,
//                     messages: [{ role: "user", content: userText }],
//                 }),
//             });

//             if (!res.body) throw new Error("No stream");

//             const reader = res.body.getReader();
//             const decoder = new TextDecoder();

//             let aiText = "";

//             setMessages((p) => [...p, { type: "ai", text: "" }]);

//             while (true) {
//                 const { done, value } = await reader.read();
//                 if (done) break;

//                 const chunk = decoder.decode(value);
//                 aiText += chunk;

//                 setMessages((p) => {
//                     const copy = [...p];
//                     copy[copy.length - 1] = { type: "ai", text: aiText };
//                     return copy;
//                 });
//             }
//         } catch (e) {
//             console.error(e);
//             setMessages((p) => [
//                 ...p,
//                 { type: "ai", text: "Error generating response" },
//             ]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="h-[calc(95vh-68px)] mt-20 w-full flex justify-center">
//             {/* chat container */}
//             <div className="relative flex flex-col w-full max-w-5xl h-full">

//                 {/* messages */}
//                 <div
//                     ref={messagesRef}
//                     className="
//         flex-1
//         overflow-y-auto
//         scroll-smooth
//         flex flex-col gap-3
//         p-3 sm:p-4 md:p-6
//         pb-28
//         custom-scrollbar
//         bg-accent dark:bg-blue-950/15
//         sm:rounded-2xl
//     "
//                 >
//                     {/* {messages.map((m, i) => (
//                         <div
//                             key={i}
//                             className={
//                                 m.type === "user"
//                                     ? "self-end bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
//                                     : "self-start bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
//                             }
//                         >
//                             {m.text}
//                         </div>
//                     ))} */}

//                     {/* {messages.map((m, i) => (
//                         <div
//                             key={i}
//                             className={
//                                 m.type === "user"
//                                     ? "self-end bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
//                                     : "self-start bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[70%]"
//                             }
//                         >
//                             {m.type === "ai" ? (
//                                 <span dangerouslySetInnerHTML={{ __html: m.text }} />
//                             ) : (
//                                 m.text
//                             )}
//                         </div>
//                     ))} */}

//                     <AnimatePresence>
//                         {messages.map((m, i) => (
//                             <motion.div
//                                 key={i}
//                                 initial={{
//                                     opacity: 0,
//                                     y: 20,
//                                     scale: 0.95,
//                                 }}
//                                 animate={{
//                                     opacity: 1,
//                                     y: 0,
//                                     scale: 1,
//                                 }}
//                                 exit={{ opacity: 0 }}
//                                 transition={{
//                                     duration: 0.25,
//                                 }}
//                                 className={
//                                     m.type === "user"
//                                         ? "self-end"
//                                         : "self-start"
//                                 }
//                             >
//                                 <motion.div
//                                     className={`flex ${m.type === "user" ? "justify-end" : "justify-start"
//                                         }`}
//                                 >
//                                     <div
//                                         className={`inline-block w-fit max-w-[80%] px-4 py-2 whitespace-pre-wrap overflow-wrap-anywhere ${m.type === "user"
//                                             ? "rounded-3xl rounded-br-md bg-blue-600 text-white"
//                                             : "rounded-3xl rounded-bl-md border border-blue-500/20 bg-slate-900 text-white"
//                                             }`}
//                                     >
//                                         {m.type === "ai" ? (
//                                             <span dangerouslySetInnerHTML={{ __html: m.text }} />
//                                         ) : (
//                                             m.text
//                                         )}
//                                     </div>
//                                 </motion.div>
//                             </motion.div>
//                         ))}
//                     </AnimatePresence>

//                     {loading && (
//                         // <div className="self-start bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-2xl animate-pulse">
//                         //     AI is typing...
//                         // </div>

//                         <div className="self-start rounded-3xl rounded-bl-md bg-slate-900 px-5 py-3 shadow-lg">
//                             <div className="flex gap-1">
//                                 <span className="h-2 w-2 rounded-full bg-white animate-bounce" />
//                                 <span
//                                     className="h-2 w-2 rounded-full bg-white animate-bounce"
//                                     style={{ animationDelay: ".2s" }}
//                                 />
//                                 <span
//                                     className="h-2 w-2 rounded-full bg-white animate-bounce"
//                                     style={{ animationDelay: ".4s" }}
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* input fixed */}
//                 <div
//                     className="
//             absolute bottom-0 left-0 right-0
//             p-2 sm:p-3
//             bg-linear-to-t from-background via-background/80 to-transparent
//           "
//                 >
//                     <div className="flex gap-2 items-center bg-background/80 backdrop-blur-xl border rounded-xl p-2 shadow-lg">
//                         <Input
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             placeholder="Ask about cars..."
//                             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                             className="
// border border-white/10 bg-slate-900/60 text-white
// focus-visible:ring-2 focus-visible:ring-blue-500/10
// focus-visible:border-blue-500/20
// focus:outline-none
// transition-all
// "                        />

//                         {/* <Button
//                             onClick={sendMessage}
//                             disabled={loading}
//                             className="bg-blue-500 hover:bg-blue-600 text-white shrink-0"
//                         >
//                             <Send size={18} />
//                         </Button> */}

//                         <Button
//                             onClick={sendMessage}
//                             disabled={loading}
//                             className="
//         h-11
//         w-11
//         rounded-full
//         bg-blue-600
//         hover:bg-blue-700
//         transition-all
//         duration-300
//     "
//                         >
//                             {loading ? (
//                                 <Loader2 className="animate-spin" size={18} />
//                             ) : (
//                                 <Send size={18} className="text-white" />
//                             )}
//                         </Button>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// }


"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

type Msg = { type: "user" | "ai"; text: string };

export default function AIPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [loading, setLoading] = useState(false);

    const messagesRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    // auto scroll — runs after DOM paints, using a real anchor element
    useLayoutEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, loading]);

    const sendMessage = async () => {
        const userText = input.trim();
        if (!userText || loading) return;

        setInput("");
        setMessages((p) => [...p, { type: "user", text: userText }]);
        setLoading(true);
        setMessages((p) => [...p, { type: "ai", text: "" }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    messages: [{ role: "user", content: userText }],
                }),
            });

            if (!res.ok || !res.body) {
                const errText = await res.text().catch(() => "Request failed");
                throw new Error(errText || "No stream");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let aiText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                aiText += decoder.decode(value, { stream: true });

                setMessages((p) => {
                    const copy = [...p];
                    copy[copy.length - 1] = { type: "ai", text: aiText };
                    return copy;
                });
            }

            aiText += decoder.decode();
            const cleanText = aiText
                .replace(/\n{3,}/g, "\n\n")
                .replace(/[ \t]+\n/g, "\n")
                .trim();

            setMessages((p) => {
                const copy = [...p];
                copy[copy.length - 1] = {
                    type: "ai",
                    text: cleanText || "No response received.",
                };
                return copy;
            });
        } catch (e) {
            console.error(e);
            setMessages((p) => {
                const copy = [...p];
                copy[copy.length - 1] = {
                    type: "ai",
                    text: "⚠️ Error generating response. Please try again.",
                };
                return copy;
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(95vh-68px)] mt-20 w-full flex justify-center">
            <div className="relative flex flex-col w-full max-w-5xl h-full">
                {/* messages */}
                <div
                    ref={messagesRef}
                    className="
                        flex-1 mb-22
                        overflow-y-auto
                        scroll-smooth
                        flex flex-col gap-3
                        p-3 sm:p-4 md:p-6
                        pb-28
                        custom-scrollbar
                        bg-accent dark:bg-blue-950/15
                        sm:rounded-2xl
                    "
                >
                    <AnimatePresence initial={false}>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className={m.type === "user" ? "self-end" : "self-start"}
                            >
                                <div
                                    className={`flex ${m.type === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`inline-block w-fit max-w-[80%] px-4 py-2.5 whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base ${m.type === "user"
                                            ? "rounded-3xl rounded-br-md bg-blue-600 text-white"
                                            : "rounded-3xl rounded-bl-md border border-blue-500/20 bg-slate-900 text-white"
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="self-start rounded-3xl rounded-bl-md bg-slate-900 px-5 py-3 shadow-lg">
                            <div className="flex gap-1">
                                <span className="h-2 w-2 rounded-full bg-white animate-bounce" />
                                <span
                                    className="h-2 w-2 rounded-full bg-white animate-bounce"
                                    style={{ animationDelay: ".2s" }}
                                />
                                <span
                                    className="h-2 w-2 rounded-full bg-white animate-bounce"
                                    style={{ animationDelay: ".4s" }}
                                />
                            </div>
                        </div>
                    )}

                    {/* scroll anchor */}
                    <div ref={bottomRef} />
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            className="
                                border border-white/10 bg-slate-900/60 text-white
                                focus-visible:ring-2 focus-visible:ring-blue-500/10
                                focus-visible:border-blue-500/20
                                focus:outline-none
                                transition-all
                            "
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Send size={18} className="text-white" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}