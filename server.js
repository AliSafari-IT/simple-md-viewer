const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
let PORT = 3500;
// Serve static files from the dist/md-docs directory
const mdDocsPath = path.join(__dirname, "md-docs");
app.use("/md-docs", express.static(mdDocsPath));

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://localhost:3501", "https://alisafari-it.github.io"],
    credentials: false,
  })
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving markdown files from: ${mdDocsPath}`);
});

// API to get the folder structure
app.get("/api/folder-structure", (req, res) => {
  try {
    const folderStructure = getFolderStructure(mdDocsPath);
    res.json({ nodes: folderStructure });
  } catch (error) {
    console.error("Error getting folder structure:", error);
    res.status(500).json({ error: "Failed to get folder structure" });
  }
});

// API to get file content
app.get("/api/file", (req, res) => {
  try {
    const filePath = req.query.path;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const fullPath = path.join(mdDocsPath, filePath);

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Read the file content
    const content = fs.readFileSync(fullPath, "utf-8");
    res.json({ content, path: filePath });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Function to get folder structure
function getFolderStructure(dirPath, relativePath = "") {
  const items = fs.readdirSync(dirPath);
  const result = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, "/");

    if (stats.isDirectory()) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: "folder",
        children: getFolderStructure(itemPath, itemRelativePath),
      });
    } else if (item.endsWith(".md")) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: "file",
      });
    }
  }

  return result;
}
