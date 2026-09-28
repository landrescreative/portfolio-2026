import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";

function localSavePlugin() {
  return {
    name: "local-save-plugin",
    configureServer(server: any) {
      // 1. Serve static uploaded images instantly from /public/uploads/
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith("/uploads/")) {
          const filePath = path.join(process.cwd(), "public", req.url.split("?")[0]);
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              ".png": "image/png",
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".webp": "image/webp",
              ".svg": "image/svg+xml",
              ".gif": "image/gif",
            };
            res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
            return fs.createReadStream(filePath).pipe(res);
          }
        }
        next();
      });

      // 2. Save project metadata directly into projectsData.ts
      server.middlewares.use("/api/save-project", (req: any, res: any) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk: any) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const updatedProject = JSON.parse(body);
              const targetFile = path.resolve(process.cwd(), "src/data/projectsData.ts");
              let fileContent = fs.readFileSync(targetFile, "utf-8");

              const targetKey = `"${updatedProject.id}": {`;
              const keyIndex = fileContent.indexOf(targetKey);

              if (keyIndex !== -1) {
                const startIdx = keyIndex + targetKey.length - 1;
                let braceCount = 0;
                let endIdx = -1;

                for (let i = startIdx; i < fileContent.length; i++) {
                  if (fileContent[i] === "{") braceCount++;
                  else if (fileContent[i] === "}") {
                    braceCount--;
                    if (braceCount === 0) {
                      endIdx = i + 1;
                      if (fileContent[endIdx] === ",") endIdx++;
                      break;
                    }
                  }
                }

                if (endIdx !== -1) {
                  let serialized = JSON.stringify(updatedProject, null, 2);
                  serialized = serialized
                    .replace(/"coverImage": "([^"]+)"/g, (match, val) => {
                      if (val === "workVitreous" || val.includes("work-vitreous")) return `"coverImage": workVitreous`;
                      if (val === "workNexus" || val.includes("work-nexus")) return `"coverImage": workNexus`;
                      if (val === "workEditorial" || val.includes("work-editorial")) return `"coverImage": workEditorial`;
                      if (val === "workBrutalist" || val.includes("work-brutalist")) return `"coverImage": workBrutalist`;
                      return match;
                    })
                    .replace(/"src": "([^"]+)"/g, (match, val) => {
                      if (val === "workVitreous" || val.includes("work-vitreous")) return `"src": workVitreous`;
                      if (val === "workNexus" || val.includes("work-nexus")) return `"src": workNexus`;
                      if (val === "workEditorial" || val.includes("work-editorial")) return `"src": workEditorial`;
                      if (val === "workBrutalist" || val.includes("work-brutalist")) return `"src": workBrutalist`;
                      return match;
                    })
                    .replace(/"poster": "([^"]+)"/g, (match, val) => {
                      if (val === "workVitreous" || val.includes("work-vitreous")) return `"poster": workVitreous`;
                      if (val === "workNexus" || val.includes("work-nexus")) return `"poster": workNexus`;
                      if (val === "workEditorial" || val.includes("work-editorial")) return `"poster": workEditorial`;
                      if (val === "workBrutalist" || val.includes("work-brutalist")) return `"poster": workBrutalist`;
                      return match;
                    });

                  const hasComma = fileContent[endIdx - 1] === ",";
                  const replacement = `"${updatedProject.id}": ${serialized}${hasComma ? "," : ""}`;

                  const newContent =
                    fileContent.substring(0, keyIndex) +
                    replacement +
                    fileContent.substring(endIdx);
                  fs.writeFileSync(targetFile, newContent, "utf-8");
                }
              }

              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              console.error("Save Error:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });

      // 3. Upload image binary endpoint
      server.middlewares.use("/api/upload-image", (req: any, res: any) => {
        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk: any) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const { fileName, base64 } = JSON.parse(body);
              const cleanFileName = Date.now() + "-" + fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
              const uploadsDir = path.resolve(process.cwd(), "public/uploads");

              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
              const buffer = Buffer.from(base64Data, "base64");
              const filePath = path.join(uploadsDir, cleanFileName);

              fs.writeFileSync(filePath, buffer);

              const publicUrl = `/uploads/${cleanFileName}`;
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, url: publicUrl }));
            } catch (err: any) {
              console.error("Upload Error:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    server: {
      host: true,
      port: 8080,
    },
    plugins: [localSavePlugin()],
  },
});
