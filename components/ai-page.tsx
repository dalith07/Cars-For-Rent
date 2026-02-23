// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useRef, } from "react";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import { Send } from "lucide-react";
// import { toast } from "sonner";
// import { v4 as uuidv4 } from "uuid";

// export default function AIPage() {
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState<{ type: "user" | "ai"; text: string }[]>([]);
//     const [loading, setLoading] = useState(false);
//     const messagesEndRef = useRef<HTMLDivElement>(null);

//     // auto scroll to bottom
//     // useEffect(() => {
//     //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     // }, [messages, loading]);

//     // const handleSend = async () => {
//     //     if (!input.trim()) return;

//     //     const prompt = input;

//     //     // add user message
//     //     setMessages((prev) => [...prev, { type: "user", text: prompt }]);
//     //     setInput("");
//     //     setLoading(true);

//     //     try {
//     //         const aiResponse = await sendAIMessage(userId, prompt);

//     //         setMessages((prev) => [...prev, { type: "ai", text: aiResponse }]);
//     //     } catch (err) {
//     //         console.error(err);
//     //         setMessages((prev) => [
//     //             ...prev,
//     //             { type: "ai", text: "حدث خطأ، حاول مرة أخرى." },
//     //         ]);
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const sendMessage = async (e?: React.FormEvent) => {

//     };

//     return (
//         <div className="min-h-screen mt-17 flex justify-center">
//             {/* Chat Card */}
//             <div className="flex flex-col p-4 w-full h-screen rounded-2xl">

//                 {/* Title */}
//                 <h1 className="text-2xl font-bold mb-4 text-center text-purple-600">
//                     Ask AI Question Cars
//                 </h1>

//                 {/* Messages area (scrollable) */}
//                 <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2 p-2 bg-blue-950/20 rounded-lg custom-scrollbar">
//                     {messages.map((msg, idx) => (
//                         <div
//                             key={idx}
//                             className={
//                                 msg.type === "user"
//                                     ? "self-end bg-blue-500 text-white p-3 rounded-xl max-w-[70%] wrap-break-word"
//                                     : "self-start bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-xl max-w-[70%] wrap-break-word"
//                             }
//                         >
//                             {msg.text}
//                         </div>
//                     ))}

//                     {loading && (
//                         <div className="self-start bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-xl max-w-[70%] animate-pulse">
//                             AI is typing...
//                         </div>
//                     )}

//                     <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input area */}
//                 <div className="flex gap-2 sticky bottom-0 bg-purple-900/10 backdrop-blur-sm rounded-lg p-2">
//                     <Input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder="Ask about a car..."
//                         className="flex-1 p-6 rounded-lg border border-purple-950/80 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                     />

//                     <Button
//                         onClick={handleSend}
//                         size="lg"
//                         className="group bg-blue-500 text-white py-6 rounded-lg hover:bg-blue-600 duration-500"
//                     >
//                         <Send
//                             size={30}
//                             className="group-hover:-translate-y-2 group-hover:translate-x-1.5 duration-500 group-hover:scale-125"
//                         />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import { useState, } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

export default function AIPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<
        { type: "user" | "ai"; text: string }[]
    >([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userText = input;
        setInput("");

        // add user msg
        setMessages((prev) => [...prev, { type: "user", text: userText }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    messages: [{ role: "user", content: userText }],
                }),
            });

            if (!res.body) throw new Error("No stream");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let aiText = "";

            // add empty AI bubble
            setMessages((prev) => [...prev, { type: "ai", text: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                aiText += chunk;

                // update last AI message
                setMessages((prev) => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { type: "ai", text: aiText };
                    return copy;
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-17 flex justify-center">
            <div className="flex flex-col p-4 w-full h-screen rounded-2xl">
                <h1 className="text-2xl font-bold mb-4 text-center text-purple-600">
                    Ask AI Question Cars
                </h1>

                <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2 p-2 bg-blue-950/20 rounded-lg">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={
                                msg.type === "user"
                                    ? "self-end bg-blue-500 text-white p-3 rounded-xl max-w-[70%]"
                                    : "self-start bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-3 rounded-xl max-w-[70%]"
                            }
                        >
                            {msg.text}
                        </div>
                    ))}

                    {loading && (
                        <div className="self-start bg-gray-200 dark:bg-gray-800 p-3 rounded-xl">
                            AI is typing...
                        </div>
                    )}
                </div>

                <div className="flex gap-2 sticky bottom-0 bg-purple-900/10 rounded-lg p-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a car..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />

                    <Button
                        onClick={sendMessage}
                        size="lg"
                        className="bg-blue-500 text-white"
                    >
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
