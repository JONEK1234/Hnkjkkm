import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=43d388fa"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=43d388fa"; const useState = __vite__cjsImport1_react["useState"]; const useMemo = __vite__cjsImport1_react["useMemo"]; const useEffect = __vite__cjsImport1_react["useEffect"]; const useRef = __vite__cjsImport1_react["useRef"];
import { formatBytes } from "/src/utils.ts";
import { Copy, Check, Download, Search, Eye, EyeOff, AlertCircle } from "/node_modules/.vite/deps/lucide-react.js?v=43d388fa";
export function JSONViewer({ chunk }) {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightSyntax, setHighlightSyntax] = useState(true);
  const [searchIndex, setSearchIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState([]);
  const containerRef = useRef(null);
  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(chunk.content);
      } else {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = chunk.content;
        tempTextArea.style.top = "0";
        tempTextArea.style.left = "0";
        tempTextArea.style.position = "fixed";
        tempTextArea.style.opacity = "0";
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        if (!success) {
          throw new Error("execCommand copy failed");
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  const handleDownload = () => {
    try {
      const blob = new Blob([chunk.content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `chunk_${chunk.index + 1}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download: ", err);
    }
  };
  useEffect(() => {
    setSearchTerm("");
    setSearchIndex(-1);
    setSearchResults([]);
  }, [chunk.index]);
  const highlightedHtml = useMemo(() => {
    const raw = chunk.content;
    if (!highlightSyntax) {
      return escapeHtml(raw);
    }
    if (raw.length > 7e5) {
      return escapeHtml(raw);
    }
    const escaped = escapeHtml(raw);
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = "text-amber-600 dark:text-amber-300 font-mono";
        if (match.startsWith('"')) {
          if (match.endsWith(":")) {
            cls = "text-indigo-600 dark:text-pink-400 font-semibold font-mono";
          } else {
            cls = "text-emerald-700 dark:text-green-400 font-mono";
          }
        } else if (match === "true" || match === "false") {
          cls = "text-purple-600 dark:text-orange-300 font-medium font-mono";
        } else if (match === "null") {
          cls = "text-gray-400 font-mono italic";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }, [chunk.content, highlightSyntax]);
  const contentToSearch = chunk.content;
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      setSearchIndex(-1);
      return;
    }
    const escapeRegex = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const escapedTerm = escapeRegex(searchTerm);
    const regex = new RegExp(escapedTerm, "gi");
    const matches = [];
    let match;
    while ((match = regex.exec(contentToSearch)) !== null) {
      matches.push(match.index);
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }
    setSearchResults(matches);
    setSearchIndex(matches.length > 0 ? 0 : -1);
  }, [searchTerm, contentToSearch]);
  const handleNextSearch = () => {
    if (searchResults.length === 0) return;
    const nextIdx = (searchIndex + 1) % searchResults.length;
    setSearchIndex(nextIdx);
    scrollToPosition(searchResults[nextIdx]);
  };
  const handlePrevSearch = () => {
    if (searchResults.length === 0) return;
    const prevIdx = (searchIndex - 1 + searchResults.length) % searchResults.length;
    setSearchIndex(prevIdx);
    scrollToPosition(searchResults[prevIdx]);
  };
  const scrollToPosition = (charIdx) => {
    const preElement = containerRef.current?.querySelector("pre");
    if (!preElement) return;
    const containerHeight = preElement.scrollHeight;
    const ratio = charIdx / contentToSearch.length;
    const scrollTarget = containerHeight * ratio - 100;
    preElement.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: "smooth"
    });
  };
  const isTooBigToHighlight = chunk.content.length > 7e5;
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col flex-1 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden h-full", id: "json-viewer-container", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 gap-3 border-b border-gray-250 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50", id: "json-viewer-header", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2.5", children: /* @__PURE__ */ jsxDEV("div", { className: "flex-col", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-mono text-gray-500 font-semibold uppercase tracking-wider", children: "VIEWING PART:" }, void 0, false, {
            fileName: "/app/applet/src/components/JSONViewer.tsx",
            lineNumber: 187,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-mono font-semibold text-white bg-blue-600 px-2.5 py-0.5 rounded shadow-sm", children: (chunk.index + 1).toString().padStart(2, "0") }, void 0, false, {
            fileName: "/app/applet/src/components/JSONViewer.tsx",
            lineNumber: 188,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 186,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] text-gray-400 font-mono mt-0.5 block", children: [
          "Size: ",
          formatBytes(chunk.sizeBytes),
          " | ",
          chunk.isValidJSON ? "Valid syntax" : "Raw content"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 192,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 185,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 184,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between sm:justify-end gap-3 sm:self-auto self-stretch", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex space-x-1 hover:opacity-80 transition-all duration-300", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" }, void 0, false, {
            fileName: "/app/applet/src/components/JSONViewer.tsx",
            lineNumber: 201,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80" }, void 0, false, {
            fileName: "/app/applet/src/components/JSONViewer.tsx",
            lineNumber: 202,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-green-500 opacity-80" }, void 0, false, {
            fileName: "/app/applet/src/components/JSONViewer.tsx",
            lineNumber: 203,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 200,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-4 w-[1px] bg-gray-350 dark:bg-zinc-800 hidden sm:block" }, void 0, false, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 206,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5", children: [
          !isTooBigToHighlight && /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setHighlightSyntax(!highlightSyntax),
              className: "p-2 border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center cursor-pointer",
              title: highlightSyntax ? "Disattiva colori" : "Attiva colori",
              id: "btn-toggle-highlight",
              style: { minWidth: "38px", minHeight: "38px" },
              children: highlightSyntax ? /* @__PURE__ */ jsxDEV(EyeOff, { size: 15 }, void 0, false, {
                fileName: "/app/applet/src/components/JSONViewer.tsx",
                lineNumber: 218,
                columnNumber: 36
              }, this) : /* @__PURE__ */ jsxDEV(Eye, { size: 15 }, void 0, false, {
                fileName: "/app/applet/src/components/JSONViewer.tsx",
                lineNumber: 218,
                columnNumber: 59
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/JSONViewer.tsx",
              lineNumber: 211,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleCopy,
              className: `flex items-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all active:scale-95 shadow-xs cursor-pointer ${copied ? "bg-green-50 text-green-700 border-green-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50" : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 border-gray-250 dark:border-zinc-700 hover:bg-gray-50"}`,
              id: "btn-copy-chunk",
              style: { minHeight: "38px" },
              children: [
                copied ? /* @__PURE__ */ jsxDEV(Check, { size: 13, className: "stroke-[3]" }, void 0, false, {
                  fileName: "/app/applet/src/components/JSONViewer.tsx",
                  lineNumber: 233,
                  columnNumber: 25
                }, this) : /* @__PURE__ */ jsxDEV(Copy, { size: 13 }, void 0, false, {
                  fileName: "/app/applet/src/components/JSONViewer.tsx",
                  lineNumber: 233,
                  columnNumber: 70
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: copied ? "Copied" : "Copy" }, void 0, false, {
                  fileName: "/app/applet/src/components/JSONViewer.tsx",
                  lineNumber: 234,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/JSONViewer.tsx",
              lineNumber: 223,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleDownload,
              className: "flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all active:scale-95 shadow-sm border border-transparent cursor-pointer",
              id: "btn-download-chunk",
              style: { minHeight: "38px" },
              children: [
                /* @__PURE__ */ jsxDEV(Download, { size: 13 }, void 0, false, {
                  fileName: "/app/applet/src/components/JSONViewer.tsx",
                  lineNumber: 244,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: "Save" }, void 0, false, {
                  fileName: "/app/applet/src/components/JSONViewer.tsx",
                  lineNumber: 245,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/JSONViewer.tsx",
              lineNumber: 238,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 208,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 199,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/JSONViewer.tsx",
      lineNumber: 181,
      columnNumber: 7
    }, this),
    isTooBigToHighlight && /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-2.5 text-xs border-b border-amber-100 dark:border-amber-950/40", children: [
      /* @__PURE__ */ jsxDEV(AlertCircle, { size: 14, className: "mt-0.5 shrink-0" }, void 0, false, {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 254,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("span", { children: [
        "Questo blocco è enorme (",
        formatBytes(chunk.content.length),
        "). Highlight sintattico spento per evitare lag sul telefono."
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 255,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/JSONViewer.tsx",
      lineNumber: 253,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 py-2 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2", id: "search-bar-container", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative flex-1 min-w-[150px]", children: [
        /* @__PURE__ */ jsxDEV(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }, void 0, false, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 264,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            type: "text",
            placeholder: "Cerca in questo blocco...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-250 dark:border-zinc-700 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-neutral-150",
            id: "search-input-field",
            style: { minHeight: "36px" }
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/JSONViewer.tsx",
            lineNumber: 265,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 263,
        columnNumber: 9
      }, this),
      searchResults.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500 dark:text-zinc-400 font-mono", children: [
          searchIndex + 1,
          " of ",
          searchResults.length
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 278,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1", id: "search-nav-buttons", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handlePrevSearch,
              className: "p-1 px-2.5 border border-gray-200 dark:border-zinc-755 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 text-gray-700 bg-white",
              style: { minHeight: "34px" },
              children: "←"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/JSONViewer.tsx",
              lineNumber: 282,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: handleNextSearch,
              className: "p-1 px-2.5 border border-gray-200 dark:border-zinc-755 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-zinc-800 active:scale-95 text-gray-700 bg-white",
              style: { minHeight: "34px" },
              children: "→"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/JSONViewer.tsx",
              lineNumber: 289,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/JSONViewer.tsx",
          lineNumber: 281,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 277,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/JSONViewer.tsx",
      lineNumber: 262,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: containerRef,
        className: "flex-1 overflow-hidden relative bg-[#1E293B] rounded-b-2xl border border-gray-800",
        id: "code-viewport",
        children: /* @__PURE__ */ jsxDEV(
          "pre",
          {
            className: "w-full h-[60vh] max-h-[80vh] overflow-auto p-5 text-[12px] leading-relaxed font-mono whitespace-pre text-blue-300 select-text outline-none scrollbar-hide",
            dangerouslySetInnerHTML: highlightSyntax && !isTooBigToHighlight ? { __html: highlightedHtml } : void 0,
            id: "raw-code-block",
            children: highlightSyntax && !isTooBigToHighlight ? void 0 : chunk.content
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/JSONViewer.tsx",
            lineNumber: 307,
            columnNumber: 9
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/JSONViewer.tsx",
        lineNumber: 302,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/JSONViewer.tsx",
    lineNumber: 179,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpTT05WaWV3ZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlTWVtbywgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBKU09OQ2h1bmsgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBmb3JtYXRCeXRlcyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IENvcHksIENoZWNrLCBEb3dubG9hZCwgU2VhcmNoLCBFeWUsIEV5ZU9mZiwgQWxlcnRDaXJjbGUgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuXG5pbnRlcmZhY2UgSlNPTlZpZXdlclByb3BzIHtcbiAgY2h1bms6IEpTT05DaHVuaztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEpTT05WaWV3ZXIoeyBjaHVuayB9OiBKU09OVmlld2VyUHJvcHMpIHtcbiAgY29uc3QgW2NvcGllZCwgc2V0Q29waWVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3NlYXJjaFRlcm0sIHNldFNlYXJjaFRlcm1dID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbaGlnaGxpZ2h0U3ludGF4LCBzZXRIaWdobGlnaHRTeW50YXhdID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFtzZWFyY2hJbmRleCwgc2V0U2VhcmNoSW5kZXhdID0gdXNlU3RhdGUoLTEpO1xuICBjb25zdCBbc2VhcmNoUmVzdWx0cywgc2V0U2VhcmNoUmVzdWx0c10gPSB1c2VTdGF0ZTxudW1iZXJbXT4oW10pO1xuICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuXG4gIC8vIEVzY2FwZXMgSFRNTCB0YWdzXG4gIGZ1bmN0aW9uIGVzY2FwZUh0bWwodGV4dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICB9XG5cbiAgLy8gQ29weSBoZWxwZXJcbiAgY29uc3QgaGFuZGxlQ29weSA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKG5hdmlnYXRvci5jbGlwYm9hcmQgJiYgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQpIHtcbiAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoY2h1bmsuY29udGVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGYWxsYmFjayBmb3Igbm9uLXNlY3VyZSBjb250ZXh0cyAvIG9sZGVyIHNtYXJ0cGhvbmUgYnJvd3NlcnMgLyBmaWxlOi8vLyBwcm90b2NvbHNcbiAgICAgICAgY29uc3QgdGVtcFRleHRBcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgdGVtcFRleHRBcmVhLnZhbHVlID0gY2h1bmsuY29udGVudDtcbiAgICAgICAgdGVtcFRleHRBcmVhLnN0eWxlLnRvcCA9ICcwJztcbiAgICAgICAgdGVtcFRleHRBcmVhLnN0eWxlLmxlZnQgPSAnMCc7XG4gICAgICAgIHRlbXBUZXh0QXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgIHRlbXBUZXh0QXJlYS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRlbXBUZXh0QXJlYSk7XG4gICAgICAgIHRlbXBUZXh0QXJlYS5mb2N1cygpO1xuICAgICAgICB0ZW1wVGV4dEFyZWEuc2VsZWN0KCk7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRlbXBUZXh0QXJlYSk7XG4gICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXhlY0NvbW1hbmQgY29weSBmYWlsZWQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2V0Q29waWVkKHRydWUpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXRDb3BpZWQoZmFsc2UpLCAyMDAwKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjb3B5IHRleHQ6ICcsIGVycik7XG4gICAgfVxuICB9O1xuXG4gIC8vIERvd25sb2FkIGhlbHBlclxuICBjb25zdCBoYW5kbGVEb3dubG9hZCA9ICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtjaHVuay5jb250ZW50XSwgeyB0eXBlOiAnYXBwbGljYXRpb24vanNvbicgfSk7XG4gICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICAgIGxpbmsuZG93bmxvYWQgPSBgY2h1bmtfJHtjaHVuay5pbmRleCArIDF9Lmpzb25gO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobGluayk7XG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZG93bmxvYWQ6ICcsIGVycik7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlc2V0IHNlYXJjaCBzdGF0ZXMgd2hlbiBhY3RpdmUgY2h1bmsgY2hhbmdlc1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFNlYXJjaFRlcm0oJycpO1xuICAgIHNldFNlYXJjaEluZGV4KC0xKTtcbiAgICBzZXRTZWFyY2hSZXN1bHRzKFtdKTtcbiAgfSwgW2NodW5rLmluZGV4XSk7XG5cbiAgLy8gU3ludGF4IGhpZ2hsaWdodGluZyBoZWxwZXJcbiAgY29uc3QgaGlnaGxpZ2h0ZWRIdG1sID0gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgcmF3ID0gY2h1bmsuY29udGVudDtcbiAgICBpZiAoIWhpZ2hsaWdodFN5bnRheCkge1xuICAgICAgcmV0dXJuIGVzY2FwZUh0bWwocmF3KTtcbiAgICB9XG5cbiAgICAvLyBTZSBpbCBibG9jY28gw6ggdHJvcHBvIGdyYW5kZSAoZXMuID4gMSBNQiksIGRpc2F0dGl2aWFtbyBpbCBzeW50YXggaGlnaGxpZ2h0aW5nIHBlciBpbXBvc3RhemlvbmUgcHJlZGVmaW5pdGFcbiAgICAvLyBwZXIgbm9uIGJsb2NjYXJlIGlsIHRocmVhZCBwcmluY2lwYWxlIHN1aSBjZWxsdWxhcmkgZGkgZmFzY2lhIGJhc3NhXG4gICAgaWYgKHJhdy5sZW5ndGggPiA3MDAwMDApIHtcbiAgICAgIHJldHVybiBlc2NhcGVIdG1sKHJhdyk7XG4gICAgfVxuXG4gICAgY29uc3QgZXNjYXBlZCA9IGVzY2FwZUh0bWwocmF3KTtcbiAgICAvLyBVbiByZWdleCBwZXJmb3JtYW50ZSBwZXIgY29sb3JhcmUgaSB0b2tlbiBKU09OXG4gICAgcmV0dXJuIGVzY2FwZWQucmVwbGFjZShcbiAgICAgIC8oXCIoXFxcXHVbYS16QS1aMC05XXs0fXxcXFxcW151XXxbXlxcXFxcIl0pKlwiKFxccyo6KT98XFxiKHRydWV8ZmFsc2V8bnVsbClcXGJ8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrLV0/XFxkKyk/KS9nLFxuICAgICAgKG1hdGNoKSA9PiB7XG4gICAgICAgIGxldCBjbHMgPSAndGV4dC1hbWJlci02MDAgZGFyazp0ZXh0LWFtYmVyLTMwMCBmb250LW1vbm8nOyAvLyBOdW1lcm9cbiAgICAgICAgaWYgKG1hdGNoLnN0YXJ0c1dpdGgoJ1wiJykpIHtcbiAgICAgICAgICBpZiAobWF0Y2guZW5kc1dpdGgoJzonKSkge1xuICAgICAgICAgICAgY2xzID0gJ3RleHQtaW5kaWdvLTYwMCBkYXJrOnRleHQtcGluay00MDAgZm9udC1zZW1pYm9sZCBmb250LW1vbm8nOyAvLyBDaGlhdmVcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xzID0gJ3RleHQtZW1lcmFsZC03MDAgZGFyazp0ZXh0LWdyZWVuLTQwMCBmb250LW1vbm8nOyAvLyBTdHJpbmdhXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID09PSAndHJ1ZScgfHwgbWF0Y2ggPT09ICdmYWxzZScpIHtcbiAgICAgICAgICBjbHMgPSAndGV4dC1wdXJwbGUtNjAwIGRhcms6dGV4dC1vcmFuZ2UtMzAwIGZvbnQtbWVkaXVtIGZvbnQtbW9ubyc7IC8vIEJvb2xlYW5cbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgY2xzID0gJ3RleHQtZ3JheS00MDAgZm9udC1tb25vIGl0YWxpYyc7IC8vIE51bGxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYDxzcGFuIGNsYXNzPVwiJHtjbHN9XCI+JHttYXRjaH08L3NwYW4+YDtcbiAgICAgIH1cbiAgICApO1xuICB9LCBbY2h1bmsuY29udGVudCwgaGlnaGxpZ2h0U3ludGF4XSk7XG5cbiAgLy8gR2VzdGlvbmUgcmljZXJjYSBhbGwnaW50ZXJubyBkZWwgdGVzdG9cbiAgY29uc3QgY29udGVudFRvU2VhcmNoID0gY2h1bmsuY29udGVudDtcbiAgXG4gIC8vIFRyb3ZhIGdsaSBpbmRpY2kgZGkgY29ycmlzcG9uZGVuemEgcGVyIGxhIHJpY2VyY2FcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXNlYXJjaFRlcm0gfHwgc2VhcmNoVGVybS5sZW5ndGggPCAyKSB7XG4gICAgICBzZXRTZWFyY2hSZXN1bHRzKFtdKTtcbiAgICAgIHNldFNlYXJjaEluZGV4KC0xKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlc2NhcGVSZWdleCA9IChzOiBzdHJpbmcpID0+IHMucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gICAgY29uc3QgZXNjYXBlZFRlcm0gPSBlc2NhcGVSZWdleChzZWFyY2hUZXJtKTtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoZXNjYXBlZFRlcm0sICdnaScpO1xuICAgIGNvbnN0IG1hdGNoZXM6IG51bWJlcltdID0gW107XG4gICAgbGV0IG1hdGNoO1xuXG4gICAgd2hpbGUgKChtYXRjaCA9IHJlZ2V4LmV4ZWMoY29udGVudFRvU2VhcmNoKSkgIT09IG51bGwpIHtcbiAgICAgIG1hdGNoZXMucHVzaChtYXRjaC5pbmRleCk7XG4gICAgICAvLyBFdml0aWFtbyBsb29wIGluZmluaXRpIHNlIGxhIHJpY2VyY2EgZMOgIG1hdGNoIGRpIGx1bmdoZXp6YSB6ZXJvXG4gICAgICBpZiAobWF0Y2guaW5kZXggPT09IHJlZ2V4Lmxhc3RJbmRleCkge1xuICAgICAgICByZWdleC5sYXN0SW5kZXgrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTZWFyY2hSZXN1bHRzKG1hdGNoZXMpO1xuICAgIHNldFNlYXJjaEluZGV4KG1hdGNoZXMubGVuZ3RoID4gMCA/IDAgOiAtMSk7XG4gIH0sIFtzZWFyY2hUZXJtLCBjb250ZW50VG9TZWFyY2hdKTtcblxuICAvLyBTY29ycmkgZmlubyBhbCBtYXRjaCBkaSByaWNlcmNhIGF0dGl2b1xuICBjb25zdCBoYW5kbGVOZXh0U2VhcmNoID0gKCkgPT4ge1xuICAgIGlmIChzZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IG5leHRJZHggPSAoc2VhcmNoSW5kZXggKyAxKSAlIHNlYXJjaFJlc3VsdHMubGVuZ3RoO1xuICAgIHNldFNlYXJjaEluZGV4KG5leHRJZHgpO1xuICAgIHNjcm9sbFRvUG9zaXRpb24oc2VhcmNoUmVzdWx0c1tuZXh0SWR4XSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlUHJldlNlYXJjaCA9ICgpID0+IHtcbiAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBwcmV2SWR4ID0gKHNlYXJjaEluZGV4IC0gMSArIHNlYXJjaFJlc3VsdHMubGVuZ3RoKSAlIHNlYXJjaFJlc3VsdHMubGVuZ3RoO1xuICAgIHNldFNlYXJjaEluZGV4KHByZXZJZHgpO1xuICAgIHNjcm9sbFRvUG9zaXRpb24oc2VhcmNoUmVzdWx0c1twcmV2SWR4XSk7XG4gIH07XG5cbiAgY29uc3Qgc2Nyb2xsVG9Qb3NpdGlvbiA9IChjaGFySWR4OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBwcmVFbGVtZW50ID0gY29udGFpbmVyUmVmLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3IoJ3ByZScpO1xuICAgIGlmICghcHJlRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgLy8gUGVyIHNjb3JyZXJlIG5lbCBwcmUgaW4gbW9kbyBvdHRpbWFsZSBzdSBtb2JpbGUsIHBvc3NpYW1vIGFwcHJvc3NpbWFyZSBsYSBsaW5lYSBvIHRyb3ZhcmUgaWwgdGVzdG8sXG4gICAgLy8gbWEgdW5hIHNvbHV6aW9uZSBzZW1wbGljaXNzaW1hIGVkIGVzdHJlbWFtZW50ZSBhZmZpZGFiaWxlIMOoIGNhbGNvbGFyZSBsYSBwZXJjZW50dWFsZSBkZWxsYSBzdHJpbmdhXG4gICAgLy8gZSBzY29ycmVyZSBwcm9wb3J6aW9uYWxtZW50ZSBsJ2FsdGV6emEgZGVsIHByZS5cbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBwcmVFbGVtZW50LnNjcm9sbEhlaWdodDtcbiAgICBjb25zdCByYXRpbyA9IGNoYXJJZHggLyBjb250ZW50VG9TZWFyY2gubGVuZ3RoO1xuICAgIGNvbnN0IHNjcm9sbFRhcmdldCA9IGNvbnRhaW5lckhlaWdodCAqIHJhdGlvIC0gMTAwOyAvLyBDZW50cmEgdW4gcG8nIHN1IHNjaGVybW9cblxuICAgIHByZUVsZW1lbnQuc2Nyb2xsVG8oe1xuICAgICAgdG9wOiBNYXRoLm1heCgwLCBzY3JvbGxUYXJnZXQpLFxuICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuICAgIH0pO1xuICB9O1xuXG4gIC8vIEZvcnphIGRpc2F0dGl2YXppb25lIGhpZ2hsaWdodGluZyBzZSBsYSBzdHJpbmdhIMOoIGdpZ2FudGVzY2EgcGVyIHR1dGVsYXJlIGkgdGVsZWZvbmlcbiAgY29uc3QgaXNUb29CaWdUb0hpZ2hsaWdodCA9IGNodW5rLmNvbnRlbnQubGVuZ3RoID4gNzAwMDAwO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGZsZXgtMSBiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgc2hhZG93LXNtIG92ZXJmbG93LWhpZGRlbiBoLWZ1bGxcIiBpZD1cImpzb24tdmlld2VyLWNvbnRhaW5lclwiPlxuICAgICAgey8qIFRhYiBiYXIgLyBCYXJyYSBjb21hbmRpIGluc3BpcmVkIGJ5IENsZWFuIENodW5rZXIgU2xhdGUgZGVzaWduICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIHNtOmZsZXgtcm93IGl0ZW1zLXN0cmV0Y2ggc206aXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTQgZ2FwLTMgYm9yZGVyLWIgYm9yZGVyLWdyYXktMjUwIGRhcms6Ym9yZGVyLXppbmMtODAwIGJnLWdyYXktNTAgZGFyazpiZy16aW5jLTkwMC81MFwiIGlkPVwianNvbi12aWV3ZXItaGVhZGVyXCI+XG4gICAgICAgIFxuICAgICAgICB7LyogSW5mbyBibG9jY28gKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIuNVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC1jb2xcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1vbm8gdGV4dC1ncmF5LTUwMCBmb250LXNlbWlib2xkIHVwcGVyY2FzZSB0cmFja2luZy13aWRlclwiPlZJRVdJTkcgUEFSVDo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tb25vIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZSBiZy1ibHVlLTYwMCBweC0yLjUgcHktMC41IHJvdW5kZWQgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICAgICAgeyhjaHVuay5pbmRleCArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LWdyYXktNDAwIGZvbnQtbW9ubyBtdC0wLjUgYmxvY2tcIj5cbiAgICAgICAgICAgICAgU2l6ZToge2Zvcm1hdEJ5dGVzKGNodW5rLnNpemVCeXRlcyl9IHwge2NodW5rLmlzVmFsaWRKU09OID8gJ1ZhbGlkIHN5bnRheCcgOiAnUmF3IGNvbnRlbnQnfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogbWFjT1Mgc3R5bGUgdHJhZmZpYyBkb3RzIGluc2lkZSBwYW5lbCBhbmQgcXVpY2sgYWN0aW9ucyAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gc206anVzdGlmeS1lbmQgZ2FwLTMgc206c2VsZi1hdXRvIHNlbGYtc3RyZXRjaFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzcGFjZS14LTEgaG92ZXI6b3BhY2l0eS04MCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0yLjUgaC0yLjUgcm91bmRlZC1mdWxsIGJnLXJlZC01MDAgb3BhY2l0eS04MFwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTIuNSBoLTIuNSByb3VuZGVkLWZ1bGwgYmcteWVsbG93LTUwMCBvcGFjaXR5LTgwXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMi41IGgtMi41IHJvdW5kZWQtZnVsbCBiZy1ncmVlbi01MDAgb3BhY2l0eS04MFwiPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTQgdy1bMXB4XSBiZy1ncmF5LTM1MCBkYXJrOmJnLXppbmMtODAwIGhpZGRlbiBzbTpibG9ja1wiPjwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCI+XG4gICAgICAgICAgICB7LyogVG9nZ2xlIFN5bnRheCBIaWdobGlnaHQgKi99XG4gICAgICAgICAgICB7IWlzVG9vQmlnVG9IaWdobGlnaHQgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SGlnaGxpZ2h0U3ludGF4KCFoaWdobGlnaHRTeW50YXgpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMiBib3JkZXIgYm9yZGVyLWdyYXktMjUwIGRhcms6Ym9yZGVyLXppbmMtODAwIGJnLXdoaXRlIGRhcms6YmctemluYy04NTAgcm91bmRlZC1sZyB0ZXh0LWdyYXktNTAwIGRhcms6dGV4dC16aW5jLTMwMCBob3ZlcjpiZy1ncmF5LTUwIGRhcms6aG92ZXI6YmctemluYy04MDAgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICB0aXRsZT17aGlnaGxpZ2h0U3ludGF4ID8gJ0Rpc2F0dGl2YSBjb2xvcmknIDogJ0F0dGl2YSBjb2xvcmknfVxuICAgICAgICAgICAgICAgIGlkPVwiYnRuLXRvZ2dsZS1oaWdobGlnaHRcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1pbldpZHRoOiAnMzhweCcsIG1pbkhlaWdodDogJzM4cHgnIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7aGlnaGxpZ2h0U3ludGF4ID8gPEV5ZU9mZiBzaXplPXsxNX0gLz4gOiA8RXllIHNpemU9ezE1fSAvPn1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICB7LyogQ29waWEgKi99XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNvcHl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHB4LTMgcHktMS41IHRleHQteHMgZm9udC1tZWRpdW0gYm9yZGVyIHJvdW5kZWQtbGcgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1IHNoYWRvdy14cyBjdXJzb3ItcG9pbnRlciAke1xuICAgICAgICAgICAgICAgIGNvcGllZFxuICAgICAgICAgICAgICAgICAgPyAnYmctZ3JlZW4tNTAgdGV4dC1ncmVlbi03MDAgYm9yZGVyLWdyZWVuLTIwMCBkYXJrOmJnLWVtZXJhbGQtOTUwLzMwIGRhcms6dGV4dC1lbWVyYWxkLTQwMCBkYXJrOmJvcmRlci1lbWVyYWxkLTkwMC81MCdcbiAgICAgICAgICAgICAgICAgIDogJ2JnLXdoaXRlIGRhcms6YmctemluYy04MDAgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0yMDAgYm9yZGVyLWdyYXktMjUwIGRhcms6Ym9yZGVyLXppbmMtNzAwIGhvdmVyOmJnLWdyYXktNTAnXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICBpZD1cImJ0bi1jb3B5LWNodW5rXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAnMzhweCcgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2NvcGllZCA/IDxDaGVjayBzaXplPXsxM30gY2xhc3NOYW1lPVwic3Ryb2tlLVszXVwiIC8+IDogPENvcHkgc2l6ZT17MTN9IC8+fVxuICAgICAgICAgICAgICA8c3Bhbj57Y29waWVkID8gJ0NvcGllZCcgOiAnQ29weSd9PC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgIHsvKiBTY2FyaWNhICovfVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVEb3dubG9hZH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgcHgtMyBweS0xLjUgYmctYmx1ZS02MDAgdGV4dC13aGl0ZSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1tZWRpdW0gaG92ZXI6YmctYmx1ZS03MDAgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1IHNoYWRvdy1zbSBib3JkZXIgYm9yZGVyLXRyYW5zcGFyZW50IGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgaWQ9XCJidG4tZG93bmxvYWQtY2h1bmtcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6ICczOHB4JyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RG93bmxvYWQgc2l6ZT17MTN9IC8+XG4gICAgICAgICAgICAgIDxzcGFuPlNhdmU8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFdhcm5pbmcgc2UgaWwgZmlsZSDDqCB0cm9wcG8gZ3JhbmRlIHBlciBsJ2V2aWRlbnppYXppb25lICovfVxuICAgICAge2lzVG9vQmlnVG9IaWdobGlnaHQgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQgZ2FwLTIgYmctYW1iZXItNTAgZGFyazpiZy1hbWJlci05NTAvMjAgdGV4dC1hbWJlci04MDAgZGFyazp0ZXh0LWFtYmVyLTQwMCBwLTIuNSB0ZXh0LXhzIGJvcmRlci1iIGJvcmRlci1hbWJlci0xMDAgZGFyazpib3JkZXItYW1iZXItOTUwLzQwXCI+XG4gICAgICAgICAgPEFsZXJ0Q2lyY2xlIHNpemU9ezE0fSBjbGFzc05hbWU9XCJtdC0wLjUgc2hyaW5rLTBcIiAvPlxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgUXVlc3RvIGJsb2NjbyDDqCBlbm9ybWUgKHtmb3JtYXRCeXRlcyhjaHVuay5jb250ZW50Lmxlbmd0aCl9KS4gSGlnaGxpZ2h0IHNpbnRhdHRpY28gc3BlbnRvIHBlciBldml0YXJlIGxhZyBzdWwgdGVsZWZvbm8uXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBCYXJyYSBkaSByaWNlcmNhIGxvY2FsZSBkZWwgYmxvY2NvICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHB5LTIgYmctd2hpdGUgZGFyazpiZy16aW5jLTkwMCBib3JkZXItYiBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgZmxleCBmbGV4LXdyYXAgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtMlwiIGlkPVwic2VhcmNoLWJhci1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4LTEgbWluLXctWzE1MHB4XVwiPlxuICAgICAgICAgIDxTZWFyY2ggc2l6ZT17MTR9IGNsYXNzTmFtZT1cImFic29sdXRlIGxlZnQtMyB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1ncmF5LTQwMFwiIC8+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkNlcmNhIGluIHF1ZXN0byBibG9jY28uLi5cIlxuICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFRlcm19XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFNlYXJjaFRlcm0oZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHBsLTkgcHItNCBweS0xLjUgYmctZ3JheS01MCBkYXJrOmJnLXppbmMtODAwIGJvcmRlciBib3JkZXItZ3JheS0yNTAgZGFyazpib3JkZXItemluYy03MDAgcm91bmRlZC1sZyB0ZXh0LXhzIHBsYWNlaG9sZGVyOnRleHQtZ3JheS00MDAgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLWJsdWUtNTAwIHRleHQtemluYy05MDAgZGFyazp0ZXh0LW5ldXRyYWwtMTUwXCJcbiAgICAgICAgICAgIGlkPVwic2VhcmNoLWlucHV0LWZpZWxkXCJcbiAgICAgICAgICAgIHN0eWxlPXt7IG1pbkhlaWdodDogJzM2cHgnIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICB7c2VhcmNoUmVzdWx0cy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDAgZGFyazp0ZXh0LXppbmMtNDAwIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICB7c2VhcmNoSW5kZXggKyAxfSBvZiB7c2VhcmNoUmVzdWx0cy5sZW5ndGh9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTFcIiBpZD1cInNlYXJjaC1uYXYtYnV0dG9uc1wiPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUHJldlNlYXJjaH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEgcHgtMi41IGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy03NTUgcm91bmRlZC1sZyB0ZXh0LXhzIGhvdmVyOmJnLWdyYXktMTAwIGRhcms6aG92ZXI6YmctemluYy04MDAgYWN0aXZlOnNjYWxlLTk1IHRleHQtZ3JheS03MDAgYmctd2hpdGVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1pbkhlaWdodDogJzM0cHgnIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICDihpBcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVOZXh0U2VhcmNofVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMSBweC0yLjUgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci16aW5jLTc1NSByb3VuZGVkLWxnIHRleHQteHMgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpob3ZlcjpiZy16aW5jLTgwMCBhY3RpdmU6c2NhbGUtOTUgdGV4dC1ncmF5LTcwMCBiZy13aGl0ZVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAnMzRweCcgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIOKGklxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBBcmVhIENvZGljZSAvIFByZSBuZXN0ZWQgd2l0aGluIGAjMUUyOTNCYCBhcyBpbiBtaW5pbWFsaXN0IG1vY2t1cCAqL31cbiAgICAgIDxkaXYgXG4gICAgICAgIHJlZj17Y29udGFpbmVyUmVmfVxuICAgICAgICBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3ctaGlkZGVuIHJlbGF0aXZlIGJnLVsjMUUyOTNCXSByb3VuZGVkLWItMnhsIGJvcmRlciBib3JkZXItZ3JheS04MDBcIlxuICAgICAgICBpZD1cImNvZGUtdmlld3BvcnRcIlxuICAgICAgPlxuICAgICAgICA8cHJlXG4gICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtWzYwdmhdIG1heC1oLVs4MHZoXSBvdmVyZmxvdy1hdXRvIHAtNSB0ZXh0LVsxMnB4XSBsZWFkaW5nLXJlbGF4ZWQgZm9udC1tb25vIHdoaXRlc3BhY2UtcHJlIHRleHQtYmx1ZS0zMDAgc2VsZWN0LXRleHQgb3V0bGluZS1ub25lIHNjcm9sbGJhci1oaWRlXCJcbiAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17aGlnaGxpZ2h0U3ludGF4ICYmICFpc1Rvb0JpZ1RvSGlnaGxpZ2h0ID8geyBfX2h0bWw6IGhpZ2hsaWdodGVkSHRtbCB9IDogdW5kZWZpbmVkfVxuICAgICAgICAgIGlkPVwicmF3LWNvZGUtYmxvY2tcIlxuICAgICAgICA+XG4gICAgICAgICAge2hpZ2hsaWdodFN5bnRheCAmJiAhaXNUb29CaWdUb0hpZ2hsaWdodCA/IHVuZGVmaW5lZCA6IGNodW5rLmNvbnRlbnR9XG4gICAgICAgIDwvcHJlPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibWFwcGluZ3MiOiJBQTBMYztBQTFMZCxTQUFnQixVQUFVLFNBQVMsV0FBVyxjQUFjO0FBRTVELFNBQVMsbUJBQW1CO0FBQzVCLFNBQVMsTUFBTSxPQUFPLFVBQVUsUUFBUSxLQUFLLFFBQVEsbUJBQW1CO0FBTWpFLGdCQUFTLFdBQVcsRUFBRSxNQUFNLEdBQW9CO0FBQ3JELFFBQU0sQ0FBQyxRQUFRLFNBQVMsSUFBSSxTQUFTLEtBQUs7QUFDMUMsUUFBTSxDQUFDLFlBQVksYUFBYSxJQUFJLFNBQVMsRUFBRTtBQUMvQyxRQUFNLENBQUMsaUJBQWlCLGtCQUFrQixJQUFJLFNBQVMsSUFBSTtBQUMzRCxRQUFNLENBQUMsYUFBYSxjQUFjLElBQUksU0FBUyxFQUFFO0FBQ2pELFFBQU0sQ0FBQyxlQUFlLGdCQUFnQixJQUFJLFNBQW1CLENBQUMsQ0FBQztBQUMvRCxRQUFNLGVBQWUsT0FBdUIsSUFBSTtBQUdoRCxXQUFTLFdBQVcsTUFBYztBQUNoQyxXQUFPLEtBQ0osUUFBUSxNQUFNLE9BQU8sRUFDckIsUUFBUSxNQUFNLE1BQU0sRUFDcEIsUUFBUSxNQUFNLE1BQU07QUFBQSxFQUN6QjtBQUdBLFFBQU0sYUFBYSxZQUFZO0FBQzdCLFFBQUk7QUFDRixVQUFJLFVBQVUsYUFBYSxVQUFVLFVBQVUsV0FBVztBQUN4RCxjQUFNLFVBQVUsVUFBVSxVQUFVLE1BQU0sT0FBTztBQUFBLE1BQ25ELE9BQU87QUFFTCxjQUFNLGVBQWUsU0FBUyxjQUFjLFVBQVU7QUFDdEQscUJBQWEsUUFBUSxNQUFNO0FBQzNCLHFCQUFhLE1BQU0sTUFBTTtBQUN6QixxQkFBYSxNQUFNLE9BQU87QUFDMUIscUJBQWEsTUFBTSxXQUFXO0FBQzlCLHFCQUFhLE1BQU0sVUFBVTtBQUM3QixpQkFBUyxLQUFLLFlBQVksWUFBWTtBQUN0QyxxQkFBYSxNQUFNO0FBQ25CLHFCQUFhLE9BQU87QUFDcEIsY0FBTSxVQUFVLFNBQVMsWUFBWSxNQUFNO0FBQzNDLGlCQUFTLEtBQUssWUFBWSxZQUFZO0FBQ3RDLFlBQUksQ0FBQyxTQUFTO0FBQ1osZ0JBQU0sSUFBSSxNQUFNLHlCQUF5QjtBQUFBLFFBQzNDO0FBQUEsTUFDRjtBQUNBLGdCQUFVLElBQUk7QUFDZCxpQkFBVyxNQUFNLFVBQVUsS0FBSyxHQUFHLEdBQUk7QUFBQSxJQUN6QyxTQUFTLEtBQUs7QUFDWixjQUFRLE1BQU0seUJBQXlCLEdBQUc7QUFBQSxJQUM1QztBQUFBLEVBQ0Y7QUFHQSxRQUFNLGlCQUFpQixNQUFNO0FBQzNCLFFBQUk7QUFDRixZQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxPQUFPLEdBQUcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25FLFlBQU0sTUFBTSxJQUFJLGdCQUFnQixJQUFJO0FBQ3BDLFlBQU0sT0FBTyxTQUFTLGNBQWMsR0FBRztBQUN2QyxXQUFLLE9BQU87QUFDWixXQUFLLFdBQVcsU0FBUyxNQUFNLFFBQVEsQ0FBQztBQUN4QyxlQUFTLEtBQUssWUFBWSxJQUFJO0FBQzlCLFdBQUssTUFBTTtBQUNYLGVBQVMsS0FBSyxZQUFZLElBQUk7QUFDOUIsVUFBSSxnQkFBZ0IsR0FBRztBQUFBLElBQ3pCLFNBQVMsS0FBSztBQUNaLGNBQVEsTUFBTSx3QkFBd0IsR0FBRztBQUFBLElBQzNDO0FBQUEsRUFDRjtBQUdBLFlBQVUsTUFBTTtBQUNkLGtCQUFjLEVBQUU7QUFDaEIsbUJBQWUsRUFBRTtBQUNqQixxQkFBaUIsQ0FBQyxDQUFDO0FBQUEsRUFDckIsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBR2hCLFFBQU0sa0JBQWtCLFFBQVEsTUFBTTtBQUNwQyxVQUFNLE1BQU0sTUFBTTtBQUNsQixRQUFJLENBQUMsaUJBQWlCO0FBQ3BCLGFBQU8sV0FBVyxHQUFHO0FBQUEsSUFDdkI7QUFJQSxRQUFJLElBQUksU0FBUyxLQUFRO0FBQ3ZCLGFBQU8sV0FBVyxHQUFHO0FBQUEsSUFDdkI7QUFFQSxVQUFNLFVBQVUsV0FBVyxHQUFHO0FBRTlCLFdBQU8sUUFBUTtBQUFBLE1BQ2I7QUFBQSxNQUNBLENBQUMsVUFBVTtBQUNULFlBQUksTUFBTTtBQUNWLFlBQUksTUFBTSxXQUFXLEdBQUcsR0FBRztBQUN6QixjQUFJLE1BQU0sU0FBUyxHQUFHLEdBQUc7QUFDdkIsa0JBQU07QUFBQSxVQUNSLE9BQU87QUFDTCxrQkFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGLFdBQVcsVUFBVSxVQUFVLFVBQVUsU0FBUztBQUNoRCxnQkFBTTtBQUFBLFFBQ1IsV0FBVyxVQUFVLFFBQVE7QUFDM0IsZ0JBQU07QUFBQSxRQUNSO0FBQ0EsZUFBTyxnQkFBZ0IsR0FBRyxLQUFLLEtBQUs7QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxFQUNGLEdBQUcsQ0FBQyxNQUFNLFNBQVMsZUFBZSxDQUFDO0FBR25DLFFBQU0sa0JBQWtCLE1BQU07QUFHOUIsWUFBVSxNQUFNO0FBQ2QsUUFBSSxDQUFDLGNBQWMsV0FBVyxTQUFTLEdBQUc7QUFDeEMsdUJBQWlCLENBQUMsQ0FBQztBQUNuQixxQkFBZSxFQUFFO0FBQ2pCO0FBQUEsSUFDRjtBQUVBLFVBQU0sY0FBYyxDQUFDLE1BQWMsRUFBRSxRQUFRLDBCQUEwQixNQUFNO0FBQzdFLFVBQU0sY0FBYyxZQUFZLFVBQVU7QUFDMUMsVUFBTSxRQUFRLElBQUksT0FBTyxhQUFhLElBQUk7QUFDMUMsVUFBTSxVQUFvQixDQUFDO0FBQzNCLFFBQUk7QUFFSixZQUFRLFFBQVEsTUFBTSxLQUFLLGVBQWUsT0FBTyxNQUFNO0FBQ3JELGNBQVEsS0FBSyxNQUFNLEtBQUs7QUFFeEIsVUFBSSxNQUFNLFVBQVUsTUFBTSxXQUFXO0FBQ25DLGNBQU07QUFBQSxNQUNSO0FBQUEsSUFDRjtBQUVBLHFCQUFpQixPQUFPO0FBQ3hCLG1CQUFlLFFBQVEsU0FBUyxJQUFJLElBQUksRUFBRTtBQUFBLEVBQzVDLEdBQUcsQ0FBQyxZQUFZLGVBQWUsQ0FBQztBQUdoQyxRQUFNLG1CQUFtQixNQUFNO0FBQzdCLFFBQUksY0FBYyxXQUFXLEVBQUc7QUFDaEMsVUFBTSxXQUFXLGNBQWMsS0FBSyxjQUFjO0FBQ2xELG1CQUFlLE9BQU87QUFDdEIscUJBQWlCLGNBQWMsT0FBTyxDQUFDO0FBQUEsRUFDekM7QUFFQSxRQUFNLG1CQUFtQixNQUFNO0FBQzdCLFFBQUksY0FBYyxXQUFXLEVBQUc7QUFDaEMsVUFBTSxXQUFXLGNBQWMsSUFBSSxjQUFjLFVBQVUsY0FBYztBQUN6RSxtQkFBZSxPQUFPO0FBQ3RCLHFCQUFpQixjQUFjLE9BQU8sQ0FBQztBQUFBLEVBQ3pDO0FBRUEsUUFBTSxtQkFBbUIsQ0FBQyxZQUFvQjtBQUM1QyxVQUFNLGFBQWEsYUFBYSxTQUFTLGNBQWMsS0FBSztBQUM1RCxRQUFJLENBQUMsV0FBWTtBQUtqQixVQUFNLGtCQUFrQixXQUFXO0FBQ25DLFVBQU0sUUFBUSxVQUFVLGdCQUFnQjtBQUN4QyxVQUFNLGVBQWUsa0JBQWtCLFFBQVE7QUFFL0MsZUFBVyxTQUFTO0FBQUEsTUFDbEIsS0FBSyxLQUFLLElBQUksR0FBRyxZQUFZO0FBQUEsTUFDN0IsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUFBLEVBQ0g7QUFHQSxRQUFNLHNCQUFzQixNQUFNLFFBQVEsU0FBUztBQUVuRCxTQUNFLHVCQUFDLFNBQUksV0FBVSwySUFBMEksSUFBRyx5QkFFMUo7QUFBQSwyQkFBQyxTQUFJLFdBQVUsa0tBQWlLLElBQUcsc0JBR2pMO0FBQUEsNkJBQUMsU0FBSSxXQUFVLDZCQUNiLGlDQUFDLFNBQUksV0FBVSxZQUNiO0FBQUEsK0JBQUMsU0FBSSxXQUFVLDJCQUNiO0FBQUEsaUNBQUMsVUFBSyxXQUFVLDBFQUF5RSw2QkFBekY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBc0c7QUFBQSxVQUN0Ryx1QkFBQyxVQUFLLFdBQVUsMEZBQ1osaUJBQU0sUUFBUSxHQUFHLFNBQVMsRUFBRSxTQUFTLEdBQUcsR0FBRyxLQUQvQztBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUVBO0FBQUEsYUFKRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBS0E7QUFBQSxRQUNBLHVCQUFDLFVBQUssV0FBVSxvREFBbUQ7QUFBQTtBQUFBLFVBQzFELFlBQVksTUFBTSxTQUFTO0FBQUEsVUFBRTtBQUFBLFVBQUksTUFBTSxjQUFjLGlCQUFpQjtBQUFBLGFBRC9FO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFFQTtBQUFBLFdBVEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQVVBLEtBWEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQVlBO0FBQUEsTUFHQSx1QkFBQyxTQUFJLFdBQVUsb0ZBQ2I7QUFBQSwrQkFBQyxTQUFJLFdBQVUsK0RBQ2I7QUFBQSxpQ0FBQyxTQUFJLFdBQVUsb0RBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBZ0U7QUFBQSxVQUNoRSx1QkFBQyxTQUFJLFdBQVUsdURBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBbUU7QUFBQSxVQUNuRSx1QkFBQyxTQUFJLFdBQVUsc0RBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBa0U7QUFBQSxhQUhwRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBSUE7QUFBQSxRQUVBLHVCQUFDLFNBQUksV0FBVSw4REFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQTBFO0FBQUEsUUFFMUUsdUJBQUMsU0FBSSxXQUFVLDZCQUVaO0FBQUEsV0FBQyx1QkFDQTtBQUFBLFlBQUM7QUFBQTtBQUFBLGNBQ0MsU0FBUyxNQUFNLG1CQUFtQixDQUFDLGVBQWU7QUFBQSxjQUNsRCxXQUFVO0FBQUEsY0FDVixPQUFPLGtCQUFrQixxQkFBcUI7QUFBQSxjQUM5QyxJQUFHO0FBQUEsY0FDSCxPQUFPLEVBQUUsVUFBVSxRQUFRLFdBQVcsT0FBTztBQUFBLGNBRTVDLDRCQUFrQix1QkFBQyxVQUFPLE1BQU0sTUFBZDtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUFrQixJQUFLLHVCQUFDLE9BQUksTUFBTSxNQUFYO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBQWU7QUFBQTtBQUFBLFlBUDNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQVFBO0FBQUEsVUFJRjtBQUFBLFlBQUM7QUFBQTtBQUFBLGNBQ0MsU0FBUztBQUFBLGNBQ1QsV0FBVyxxSUFDVCxTQUNJLHdIQUNBLGtIQUNOO0FBQUEsY0FDQSxJQUFHO0FBQUEsY0FDSCxPQUFPLEVBQUUsV0FBVyxPQUFPO0FBQUEsY0FFMUI7QUFBQSx5QkFBUyx1QkFBQyxTQUFNLE1BQU0sSUFBSSxXQUFVLGdCQUEzQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUF3QyxJQUFLLHVCQUFDLFFBQUssTUFBTSxNQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBQWdCO0FBQUEsZ0JBQ3ZFLHVCQUFDLFVBQU0sbUJBQVMsV0FBVyxVQUEzQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUFrQztBQUFBO0FBQUE7QUFBQSxZQVhwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFZQTtBQUFBLFVBR0E7QUFBQSxZQUFDO0FBQUE7QUFBQSxjQUNDLFNBQVM7QUFBQSxjQUNULFdBQVU7QUFBQSxjQUNWLElBQUc7QUFBQSxjQUNILE9BQU8sRUFBRSxXQUFXLE9BQU87QUFBQSxjQUUzQjtBQUFBLHVDQUFDLFlBQVMsTUFBTSxNQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUFvQjtBQUFBLGdCQUNwQix1QkFBQyxVQUFLLG9CQUFOO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBQVU7QUFBQTtBQUFBO0FBQUEsWUFQWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFRQTtBQUFBLGFBdENGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUF1Q0E7QUFBQSxXQWhERjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBaURBO0FBQUEsU0FuRUY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQW9FQTtBQUFBLElBR0MsdUJBQ0MsdUJBQUMsU0FBSSxXQUFVLCtKQUNiO0FBQUEsNkJBQUMsZUFBWSxNQUFNLElBQUksV0FBVSxxQkFBakM7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUFtRDtBQUFBLE1BQ25ELHVCQUFDLFVBQUs7QUFBQTtBQUFBLFFBQ3FCLFlBQVksTUFBTSxRQUFRLE1BQU07QUFBQSxRQUFFO0FBQUEsV0FEN0Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUVBO0FBQUEsU0FKRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBS0E7QUFBQSxJQUlGLHVCQUFDLFNBQUksV0FBVSx1SUFBc0ksSUFBRyx3QkFDdEo7QUFBQSw2QkFBQyxTQUFJLFdBQVUsaUNBQ2I7QUFBQSwrQkFBQyxVQUFPLE1BQU0sSUFBSSxXQUFVLDREQUE1QjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQXFGO0FBQUEsUUFDckY7QUFBQSxVQUFDO0FBQUE7QUFBQSxZQUNDLE1BQUs7QUFBQSxZQUNMLGFBQVk7QUFBQSxZQUNaLE9BQU87QUFBQSxZQUNQLFVBQVUsQ0FBQyxNQUFNLGNBQWMsRUFBRSxPQUFPLEtBQUs7QUFBQSxZQUM3QyxXQUFVO0FBQUEsWUFDVixJQUFHO0FBQUEsWUFDSCxPQUFPLEVBQUUsV0FBVyxPQUFPO0FBQUE7QUFBQSxVQVA3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFRQTtBQUFBLFdBVkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQVdBO0FBQUEsTUFFQyxjQUFjLFNBQVMsS0FDdEIsdUJBQUMsU0FBSSxXQUFVLDJCQUNiO0FBQUEsK0JBQUMsVUFBSyxXQUFVLHNEQUNiO0FBQUEsd0JBQWM7QUFBQSxVQUFFO0FBQUEsVUFBSyxjQUFjO0FBQUEsYUFEdEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUVBO0FBQUEsUUFDQSx1QkFBQyxTQUFJLFdBQVUsY0FBYSxJQUFHLHNCQUM3QjtBQUFBO0FBQUEsWUFBQztBQUFBO0FBQUEsY0FDQyxTQUFTO0FBQUEsY0FDVCxXQUFVO0FBQUEsY0FDVixPQUFPLEVBQUUsV0FBVyxPQUFPO0FBQUEsY0FDNUI7QUFBQTtBQUFBLFlBSkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBTUE7QUFBQSxVQUNBO0FBQUEsWUFBQztBQUFBO0FBQUEsY0FDQyxTQUFTO0FBQUEsY0FDVCxXQUFVO0FBQUEsY0FDVixPQUFPLEVBQUUsV0FBVyxPQUFPO0FBQUEsY0FDNUI7QUFBQTtBQUFBLFlBSkQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBTUE7QUFBQSxhQWRGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFlQTtBQUFBLFdBbkJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFvQkE7QUFBQSxTQW5DSjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBcUNBO0FBQUEsSUFHQTtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBQ0MsS0FBSztBQUFBLFFBQ0wsV0FBVTtBQUFBLFFBQ1YsSUFBRztBQUFBLFFBRUg7QUFBQSxVQUFDO0FBQUE7QUFBQSxZQUNDLFdBQVU7QUFBQSxZQUNWLHlCQUF5QixtQkFBbUIsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLGdCQUFnQixJQUFJO0FBQUEsWUFDakcsSUFBRztBQUFBLFlBRUYsNkJBQW1CLENBQUMsc0JBQXNCLFNBQVksTUFBTTtBQUFBO0FBQUEsVUFML0Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBTUE7QUFBQTtBQUFBLE1BWEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBWUE7QUFBQSxPQXZJRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBd0lBO0FBRUo7IiwibmFtZXMiOltdfQ==