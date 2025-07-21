const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { config } = require("dotenv");
config(); // Load environment variables from .env file

const app = express();
let PORT = process.env.PORT || 3300; // Default to 3300 to match .env

// Serve static files from the md-docs directory
const mdDocsPath = path.join(__dirname, "dist", "md-docs");
app.use("/md-docs", express.static(mdDocsPath));

const corsOrigin =
  "http://localhost:" + process.env.VITE_PORT || "http://localhost:5174"; // Default to 5174 if VITE_PORT is not set
console.log("CORS Origin:", corsOrigin);

// Enable CORS for all routes
app.use(
  cors({
    origin: [corsOrigin, "https://alisafari-it.github.io"],
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

// API to get directory contents with detailed information including sizes
app.get("/api/directory-details", (req, res) => {
  try {
    const dirPath = req.query.path || "";
    console.log("Directory details requested for path:", dirPath);
    const fullPath = path.join(mdDocsPath, dirPath);
    console.log("Full path:", fullPath);

    // Check if the directory exists
    if (!fs.existsSync(fullPath)) {
      console.log("Directory not found:", fullPath);
      return res.status(404).json({ error: "Directory not found" });
    }

    // Check if it's actually a directory
    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) {
      console.log("Path is not a directory:", fullPath);
      return res.status(400).json({ error: "Path is not a directory" });
    }

    const directoryDetails = getDirectoryDetails(fullPath, dirPath);
    // console.log("Directory details result:", JSON.stringify(directoryDetails, null, 2));
    res.json(directoryDetails);
  } catch (error) {
    console.error("Error getting directory details:", error);
    res.status(500).json({ error: "Failed to get directory details" });
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

// Function to get directory details with sizes and modification dates
function getDirectoryDetails(dirPath, relativePath = "") {
  const items = fs.readdirSync(dirPath);
  const result = {
    name: path.basename(dirPath) || "Root",
    path: relativePath,
    type: "folder",
    children: []
  };

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, "/");

    if (stats.isDirectory()) {
      const folderSize = calculateFolderSize(itemPath);
      result.children.push({
        name: item,
        path: itemRelativePath,
        type: "folder",
        size: folderSize,
        lastModified: stats.mtime.toISOString(),
        itemCount: countItemsInFolder(itemPath)
      });
    } else if (item.endsWith(".md")) {
      result.children.push({
        name: item,
        path: itemRelativePath,
        type: "file",
        size: stats.size,
        lastModified: stats.mtime.toISOString(),
        extension: path.extname(item).toLowerCase().slice(1)
      });
    }
  }

  // Sort: folders first, then files, both alphabetically
  result.children.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

  return result;
}

// Function to calculate total size of a folder recursively
function calculateFolderSize(folderPath) {
  let totalSize = 0;

  try {
    const items = fs.readdirSync(folderPath);
    
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += calculateFolderSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    console.error(`Error calculating folder size for ${folderPath}:`, error);
  }

  return totalSize;
}

// Function to count total items in a folder (files and subfolders)
function countItemsInFolder(folderPath) {
  let count = 0;

  try {
    const items = fs.readdirSync(folderPath);
    
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        count += 1 + countItemsInFolder(itemPath); // 1 for the folder itself + its contents
      } else {
        count += 1;
      }
    }
  } catch (error) {
    console.error(`Error counting items in folder ${folderPath}:`, error);
  }

  return count;
}
