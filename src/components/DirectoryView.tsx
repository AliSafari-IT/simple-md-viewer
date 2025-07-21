import React, { useState, useMemo } from "react";
import { FileNode } from "../types";
import "./DirectoryView.css";

export type DirectoryViewStyle = "list" | "grid" | "detailed";
export type SortBy = "name" | "type" | "size" | "lastModified";
export type SortOrder = "asc" | "desc";

interface DirectoryViewProps {
  directory: FileNode;
  onFileSelect: (path: string) => void;
  onDirectorySelect?: (path: string) => void;
  viewStyle?: DirectoryViewStyle;
  showBreadcrumbs?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  className?: string;
}

interface Breadcrumb {
  name: string;
  path: string;
}

const DirectoryView: React.FC<DirectoryViewProps> = ({
  directory,
  onFileSelect,
  onDirectorySelect,
  viewStyle = "list",
  showBreadcrumbs = true,
  enableSorting = true,
  enableFiltering = true,
  className = "",
}) => {
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedViewStyle, setSelectedViewStyle] =
    useState<DirectoryViewStyle>(viewStyle);

  // Generate breadcrumbs from directory path
  const breadcrumbs = useMemo((): Breadcrumb[] => {
    if (!directory.path) return [{ name: "Root", path: "" }];

    const pathParts = directory.path.split("/").filter(Boolean);
    const crumbs: Breadcrumb[] = [{ name: "Root", path: "" }];

    let currentPath = "";
    pathParts.forEach((part) => {
      currentPath += (currentPath ? "/" : "") + part;
      crumbs.push({ name: part, path: currentPath });
    });

    return crumbs;
  }, [directory.path]);

  // Filter and sort directory contents
  const sortedAndFilteredContents = useMemo(() => {
    if (!directory.children) return [];

    let filtered = directory.children;

    // Apply filter
    if (filterQuery && enableFiltering) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filterQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (enableSorting) {
      filtered = [...filtered].sort((a, b) => {
        let compareResult = 0;

        switch (sortBy) {
          case "name":
            compareResult = a.name.localeCompare(b.name);
            break;
          case "type":
            // Folders first, then files
            if (a.type !== b.type) {
              compareResult = a.type === "folder" ? -1 : 1;
            } else {
              compareResult = a.name.localeCompare(b.name);
            }
            break;
          case "size":
            // Size comparison (folders are treated as 0 size)
            const aSize = a.type === "file" ? (a as any).size || 0 : 0;
            const bSize = b.type === "file" ? (b as any).size || 0 : 0;
            compareResult = aSize - bSize;
            break;
          case "lastModified":
            // Date comparison
            const aDate = (a as any).lastModified || "0";
            const bDate = (b as any).lastModified || "0";
            compareResult = aDate.localeCompare(bDate);
            break;
        }

        return sortOrder === "asc" ? compareResult : -compareResult;
      });
    }

    return filtered;
  }, [
    directory.children,
    filterQuery,
    sortBy,
    sortOrder,
    enableFiltering,
    enableSorting,
  ]);

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handleItemClick = (item: FileNode) => {
    if (item.type === "folder") {
      onDirectorySelect?.(item.path);
    } else {
      onFileSelect(item.path);
    }
  };

  const getFileIcon = (item: FileNode) => {
    if (item.type === "folder") {
      return "📁";
    }

    const extension = item.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "md":
      case "markdown":
        return "📝";
      case "txt":
        return "📄";
      case "pdf":
        return "📕";
      case "doc":
      case "docx":
        return "📘";
      case "xls":
      case "xlsx":
        return "📗";
      case "ppt":
      case "pptx":
        return "📙";
      case "zip":
      case "rar":
      case "7z":
        return "📦";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return "🖼️";
      case "mp4":
      case "avi":
      case "mov":
        return "🎥";
      case "mp3":
      case "wav":
      case "flac":
        return "🎵";
      default:
        return "📄";
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "-";

    const units = ["B", "KB", "MB", "GB"];
    let unitIndex = 0;
    let fileSize = size;

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  return (
    <div className={`directory-view ${className}`}>
      {showBreadcrumbs && breadcrumbs.length > 1 && (
        <nav className="directory-breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              <button
                className="breadcrumb-item"
                onClick={() => onDirectorySelect?.(crumb.path)}
                disabled={index === breadcrumbs.length - 1}
              >
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="directory-toolbar">
        <div className="directory-info">
          <h2 className="directory-title">
            {directory.name || "Root Directory"}
          </h2>
          <span className="directory-count">
            {sortedAndFilteredContents.length} item
            {sortedAndFilteredContents.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="directory-controls">
          {enableFiltering && (
            <div className="directory-filter">
              <input
                type="text"
                placeholder="Filter files..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="filter-input"
              />
            </div>
          )}

          <div className="view-style-selector">
            <button
              className={`view-style-btn ${
                selectedViewStyle === "list" ? "active" : ""
              }`}
              onClick={() => setSelectedViewStyle("list")}
              title="List view"
            >
              ☰
            </button>
            <button
              className={`view-style-btn ${
                selectedViewStyle === "grid" ? "active" : ""
              }`}
              onClick={() => setSelectedViewStyle("grid")}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-style-btn ${
                selectedViewStyle === "detailed" ? "active" : ""
              }`}
              onClick={() => setSelectedViewStyle("detailed")}
              title="Detailed view"
            >
              ☷
            </button>
          </div>
        </div>
      </div>
      <div
        className={`directory-content directory-content-${selectedViewStyle}`}
      >
        {sortedAndFilteredContents.length === 0 ? (
          <div className="directory-empty">
            {filterQuery
              ? "No items match your filter"
              : "This directory is empty"}
          </div>
        ) : selectedViewStyle === "detailed" ? (
          <div className="directory-table-wrapper">
            <div className="directory-table-header">
              <div className="table-cell icon-cell" />
              <div
                className="table-cell name-cell"
                onClick={() => handleSort("name")}
              >
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </div>
              <div
                className="table-cell size-cell"
                onClick={() => handleSort("size")}
              >
                Size {sortBy === "size" && (sortOrder === "asc" ? "↑" : "↓")}
              </div>
              <div
                className="table-cell modified-cell"
                onClick={() => handleSort("lastModified")}
              >
                Modified{" "}
                {sortBy === "lastModified" && (sortOrder === "asc" ? "↑" : "↓")}
              </div>
            </div>
            <div className="directory-table-body">
              {sortedAndFilteredContents.map((item) => (
                <div
                  key={item.path}
                  className={`directory-table-row directory-item-${item.type}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="table-cell icon-cell">
                    {getFileIcon(item)}
                  </div>
                  <div className="table-cell name-cell" title={item.name}>
                    {item.name}
                  </div>
                  <div className="table-cell size-cell">
                    {item.type === "file"
                      ? formatFileSize((item as any).size)
                      : "-"}
                  </div>
                  <div className="table-cell modified-cell">
                    {formatDate((item as any).lastModified)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          sortedAndFilteredContents.map((item) => (
            <div
              key={item.path}
              className={`directory-item directory-item-${item.type}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="item-icon">{getFileIcon(item)}</div>
              <div className="item-details">
                <div className="item-name" title={item.name}>
                  {item.name}
                </div>
                {selectedViewStyle === "grid" && (
                  <div className="item-type">{item.type}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DirectoryView;
