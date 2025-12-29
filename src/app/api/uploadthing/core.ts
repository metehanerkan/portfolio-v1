import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    // Resim ve PDF yüklemeye izin veriyoruz (Max 4MB)
    clientAttachment: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "4MB" } })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Dosya yüklendi:", file.url);
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;