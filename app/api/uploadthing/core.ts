/* eslint-disable @typescript-eslint/no-unused-vars */
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" });

export const ourFileRouter = {
  // Allow up to 4 images per request, 8MB each (matches UI helper text)
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    // .onUploadComplete(async ({ metadata, file }) => {
    //   console.log("file url", file.ufsUrl);

    //   const { configId } = metadata.input;
    //   return { configId };
    // }),
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file urrrrrrl😭", file.ufsUrl);
      const { configId } = metadata.input;

      return {
        configId,
        imageUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
