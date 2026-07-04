/* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest } from "next/server";
// import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs"; // مهم مع prisma

// export async function POST(req: NextRequest) {
//   try {
//     const { messages, userId, chatId } = await req.json();

//     if (!messages || !userId) {
//       return new Response("Missing data", { status: 400 });
//     }

//     let chat = null;

//     // ✅ create chat if not exist
//     if (chatId) {
//       chat = await prisma.aIChat.findUnique({
//         where: { id: chatId },
//       });
//     }

//     if (!chat) {
//       chat = await prisma.aIChat.create({
//         data: { userId },
//       });
//     }

//     const userMessage = messages[messages.length - 1];

//     // ✅ save USER message
//     await prisma.aIMessage.create({
//       data: {
//         chatId: chat.id,
//         sender: "USER",
//         content: userMessage.content,
//       },
//     });

//     // ✅ call AI
//     const response = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "google/gemini-2.5-flash-lite-preview-09-2025",
//           messages,
//           stream: true,
//         }),
//       },
//     );

//     if (!response.body) {
//       return new Response("No stream", { status: 500 });
//     }

//     const encoder = new TextEncoder();
//     const decoder = new TextDecoder();

//     let fullAIText = "";

//     const stream = new ReadableStream({
//       async start(controller) {
//         const reader = response.body!.getReader();

//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           const chunk = decoder.decode(value);
//           const lines = chunk.split("\n");

//           for (const line of lines) {
//             if (!line.startsWith("data:")) continue;

//             if (line.includes("[DONE]")) {
//               // ✅ save AI message
//               await prisma.aIMessage.create({
//                 data: {
//                   chatId: chat.id,
//                   sender: "AI",
//                   content: fullAIText,
//                 },
//               });

//               controller.close();
//               return;
//             }

//             try {
//               const json = JSON.parse(line.replace("data:", "").trim());
//               const text = json.choices?.[0]?.delta?.content;

//               if (text) {
//                 fullAIText += text;
//                 controller.enqueue(encoder.encode(text));
//               }
//             } catch {}
//           }
//         }

//         controller.close();
//       },
//     });

//     return new Response(stream, {
//       headers: { "Content-Type": "text/plain" },
//     });
//   } catch (e) {
//     console.error("CHAT API ERROR:", e);
//     return new Response("Server error", { status: 500 });
//   }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { NextRequest } from "next/server";
// import { prisma } from "@/lib/prisma";

// export const runtime = "nodejs";

// export async function POST(req: NextRequest) {
//   try {
//     const { messages, userId, chatId } = await req.json();

//     if (!messages || !userId) {
//       return new Response("Missing data", { status: 400 });
//     }

//     // =========================
//     // 1️⃣ create / get chat
//     // =========================
//     let chat = null;

//     if (chatId) {
//       chat = await prisma.aIChat.findUnique({
//         where: { id: chatId },
//       });
//     }

//     if (!chat) {
//       chat = await prisma.aIChat.create({
//         data: { userId },
//       });
//     }

//     const userMessage = messages[messages.length - 1];

//     // =========================
//     // 2️⃣ save USER message
//     // =========================
//     await prisma.aIMessage.create({
//       data: {
//         chatId: chat.id,
//         sender: "USER",
//         content: userMessage.content,
//       },
//     });

//     // =========================
//     // 3️⃣ extract persons
//     // =========================
//     const personsMatch = userMessage.content.match(/\d+/);
//     const persons = personsMatch ? Number(personsMatch[0]) : 1;

//     // =========================
//     // 4️⃣ get cars from DB
//     // =========================
//     const cars = await prisma.car.findMany({
//       where: {
//         status: "AVAILABLE",
//         stock: { gte: persons },
//       },
//       take: 10,
//     });

//     // =========================
//     // 5️⃣ build cars context
//     // =========================
//     // const carsContext =
//     //   cars.length > 0
//     //     ? cars
//     //         .map(
//     //           (c) =>
//     //             `${c.name} type:${c.categoryId ?? "car"} transmission:${c.transmission} price:${c.pricePerDay}`,
//     //         )
//     //         .join("\n")
//     //     : "No cars available in database";

//     const carsContext =
//       cars.length > 0
//         ? cars.map((c) => `${c.name} (id:${c.id})`).join("\n")
//         : "No cars available in database";

//     // =========================
//     // 6️⃣ system prompt
//     // =========================
//     //     const systemPrompt = `
//     // You are a car rental assistant.

//     // IMPORTANT RULES:
//     // - You MUST always recommend cars from the available database list if any exist
//     // - Do NOT say no cars available if database has cars
//     // - Choose cars suitable for the number of people mentioned
//     // - Small group (1-3): sedan or compact
//     // - Medium group (4-5): SUV
//     // - Large group (6+): van or large SUV
//     // - Respond in clean plain text
//     // - Keep answer friendly and natural
//     // - Mention car names from database

//     // Available cars:
//     // ${carsContext}
//     // `;

//     /////////////////////////////////////////////
//     //     const systemPrompt = `
//     // You are a car rental assistant.

//     // IMPORTANT:
//     // - Always recommend cars from database if available
//     // - When mentioning a car, format it exactly like this:
//     // <a href="/market-cars/CAR_ID" class="car-link">CAR_NAME</a>

//     // Example:
//     // <a href="/market-cars/abc123" class="car-link">BMW M3 Competition</a>

//     // Rules:
//     // - Replace CAR_ID with the id from database
//     // - Replace CAR_NAME with the car name
//     // - Do not invent ids
//     // - Use only cars from provided list
//     // - Respond in clean HTML text (no markdown)

//     // Available cars:
//     // ${carsContext}
//     // `;

//     /////////////////////////////////////////////
//     const systemPrompt = `
// You are a car rental assistant.

// Rules:
// - First, check the available database cars
// - If suitable cars exist, recommend ONLY database cars
// - If no suitable cars exist, suggest appropriate cars from general knowledge
// - Clearly separate database cars and external suggestions
// - Always prefer database cars when possible
// - Respond in clean natural text (no markdown)

// Available database cars:
// ${carsContext}
// `;

//     // =========================
//     // 7️⃣ call Gemini
//     // =========================
//     // const response = await fetch(
//     //   "https://openrouter.ai/api/v1/chat/completions",
//     //   {
//     //     method: "POST",
//     //     headers: {
//     //       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({
//     //       model: "google/gemini-2.5-flash-lite-preview-09-2025",
//     //       stream: true,
//     //       messages: [{ role: "system", content: systemPrompt }, ...messages],
//     //     }),
//     //   },
//     // );

//     const response = await fetch(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "google/gemma-4-31b-it:free", // lazem nestanan more 30 min routern message
//           messages: [
//             {
//               role: "system",
//               content: systemPrompt,
//             },
//             ...messages,
//           ],
//           stream: true,
//           temperature: 0.7,
//         }),
//       },
//     );

//     // مهم جدا
//     if (!response.ok) {
//       const error = await response.text();
//       console.error("OPENROUTER ERROR:", error);

//       return new Response(error, {
//         status: response.status,
//       });
//     }

//     if (!response.body) {
//       return new Response("No stream", { status: 500 });
//     }

//     const encoder = new TextEncoder();
//     const decoder = new TextDecoder();

//     let fullAIText = "";

//     // =========================
//     // 8️⃣ stream back
//     // =========================
//     const stream = new ReadableStream({
//       async start(controller) {
//         const reader = response.body!.getReader();

//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;

//           const chunk = decoder.decode(value);
//           const lines = chunk.split("\n");

//           for (const line of lines) {
//             if (!line.startsWith("data:")) continue;

//             if (line.includes("[DONE]")) {
//               // save AI message
//               await prisma.aIMessage.create({
//                 data: {
//                   chatId: chat.id,
//                   sender: "AI",
//                   content: fullAIText,
//                 },
//               });

//               controller.close();
//               return;
//             }

//             try {
//               const json = JSON.parse(line.replace("data:", "").trim());
//               const text = json.choices?.[0]?.delta?.content;

//               if (text) {
//                 fullAIText += text;
//                 controller.enqueue(encoder.encode(text));
//               }
//             } catch {}
//           }
//         }

//         controller.close();
//       },
//     });

//     return new Response(stream, {
//       headers: { "Content-Type": "text/plain" },
//     });
//   } catch (e) {
//     console.error("CHAT API ERROR:", e);
//     return new Response("Server error", { status: 500 });
//   }
// }

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages, userId, chatId } = await req.json();

    if (!messages || !userId) {
      return new Response("Missing data", { status: 400 });
    }

    // =========================
    // 1️⃣ create / get chat
    // =========================
    let chat = null;

    if (chatId) {
      chat = await prisma.aIChat.findUnique({
        where: { id: chatId },
      });
    }

    if (!chat) {
      chat = await prisma.aIChat.create({
        data: { userId },
      });
    }

    const userMessage = messages[messages.length - 1];

    // =========================
    // 2️⃣ save USER message
    // =========================
    await prisma.aIMessage.create({
      data: {
        chatId: chat.id,
        sender: "USER",
        content: userMessage.content,
      },
    });

    // =========================
    // 3️⃣ extract persons
    // =========================
    const personsMatch = userMessage.content.match(/\d+/);
    const persons = personsMatch ? Number(personsMatch[0]) : 1;

    // =========================
    // 4️⃣ get cars from DB
    // =========================
    const cars = await prisma.car.findMany({
      where: {
        status: "AVAILABLE",
        stock: { gte: persons },
      },
      take: 10,
    });

    // =========================
    // 5️⃣ build cars context
    // =========================
    const carsContext =
      cars.length > 0
        ? cars.map((c) => `${c.name} (id:${c.id})`).join("\n")
        : "No cars available in database";

    // =========================
    // 6️⃣ system prompt
    // =========================
    const systemPrompt = `
You are a car rental assistant.

Rules:
- First, check the available database cars
- If suitable cars exist, recommend ONLY database cars
- If no suitable cars exist, suggest appropriate cars from general knowledge
- Clearly separate database cars and external suggestions
- Always prefer database cars when possible
- Respond in clean natural text (no markdown)

Available database cars:
${carsContext}
`;

    // =========================
    // 7️⃣ call Gemini (Google AI Studio directly)
    // =========================
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Gemini uses "user" / "model" roles, not "user" / "assistant"
    const history = messages
      .slice(0, -1)
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const chatSession = model.startChat({ history });

    let result;
    try {
      result = await chatSession.sendMessageStream(userMessage.content);
    } catch (err: any) {
      console.error("GEMINI ERROR:", err);
      return new Response(err?.message || "Gemini error", { status: 500 });
    }

    const encoder = new TextEncoder();
    let fullAIText = "";

    // =========================
    // 8️⃣ stream back
    // =========================
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              fullAIText += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          // save AI message once stream finished
          await prisma.aIMessage.create({
            data: {
              chatId: chat.id,
              sender: "AI",
              content: fullAIText,
            },
          });

          controller.close();
        } catch (err) {
          console.error("STREAM ERROR:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e) {
    console.error("CHAT API ERROR:", e);
    return new Response("Server error", { status: 500 });
  }
}
