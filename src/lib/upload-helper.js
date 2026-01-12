import busboy from "busboy";
import path from "path";
import { writeFile } from "fs/promises";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { Readable } from "stream";

// Ensure upload directory exists
const ensureDir = (dir) => {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
};

export const parseForm = async (req) => {
    return new Promise((resolve, reject) => {
        const fields = {};
        const files = {};
        const promises = [];

        const headers = {};
        req.headers.forEach((value, key) => {
            headers[key] = value;
        });

        const bb = busboy({ headers });

        bb.on("file", (name, file, info) => {
            const { filename, mimeType } = info;
            const folder = mimeType.startsWith("video/") ? "videos" : "thumbnails";

            const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
            ensureDir(uploadDir);

            const uniqueFilename = `${Date.now()}-${filename}`;
            const saveTo = path.join(uploadDir, uniqueFilename);
            const publicPath = `/uploads/${folder}/${uniqueFilename}`;

            const writeStream = createWriteStream(saveTo);
            file.pipe(writeStream);

            const promise = new Promise((resolveFile, rejectFile) => {
                writeStream.on("finish", () => {
                    files[name] = {
                        filepath: saveTo,
                        url: publicPath,
                        size: writeStream.bytesWritten,
                        mimetype: mimeType,
                        originalFilename: filename
                    };
                    resolveFile();
                });
                writeStream.on("error", rejectFile);
            });

            promises.push(promise);
        });

        bb.on("field", (name, val) => {
            fields[name] = val;
        });

        bb.on("close", async () => {
            try {
                await Promise.all(promises);
                resolve({ fields, files });
            } catch (err) {
                reject(err);
            }
        });

        bb.on("error", (err) => {
            reject(err);
        });

        // Convert Web Stream to Node Stream for busboy
        if (req.body) {
            Readable.fromWeb(req.body).pipe(bb);
        } else {
            reject(new Error("No body"));
        }
    });
};
