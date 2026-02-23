// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";

// export const runtime = "edge";
// import axios from "axios";
// export async function POST(req: NextRequest) {
//   try {
//     const { messages } = await req.json();

//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "google/gemini-2.5-flash-lite-preview-09-2025",
//         messages,
//         stream: true,
//       },
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//           "HTTP-Refrere": "http://localhost:3000",
//           "X-Title": "My Next.js App",
//         },
//         responseType: "stream",
//       },
//     );

//     const stream = response.data;

//     const readable = new ReadableStream({
//       async start(controller) {
//         stream.on("data", (chunk: any) => {
//           const payloads = chunk.toString().split("\n\n");
//           for (const payload of payloads) {
//             if (payload.includes("[DONE")) {
//               controller.close();
//               return;
//             }
//           }
//           if (payload.startWith("data")) {
//             try {
//                 const data=JSON.parse(payload.replace())
//                 const text=data.choices[0]?.delta?
//                 if (text) {
//                     controller.enqueue{encoder.encode()}
//                 }
//             } catch (err) {
//                 console.log("Error parsing stream", err)
//             }
//           }
//         });

//         stream.on("end",()=>{
//             controller.close()
//         })

//         stream.on("error",(err:any)=>{
//             console.error("Stream error",err)
//             controller.error(err)
//         })
//     },
//     });

//     return new NextResponse(readable,{})
//   } catch (error) {
//     console.error("API error:", error);
//     return new Response("Something went wrong", { status: 500 });
//   }
// }

import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "My Next.js App",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite-preview-09-2025",
          messages,
          stream: true,
        }),
      },
    );

    if (!response.body) {
      return new Response("No stream", { status: 500 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            if (line.includes("[DONE]")) {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(line.replace("data:", "").trim());
              const text = json.choices?.[0]?.delta?.content;

              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (err) {
              console.error("Parse error", err);
            }
          }
        }

        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("API error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
