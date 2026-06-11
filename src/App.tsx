import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=43d388fa"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=43d388fa"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useState = __vite__cjsImport1_react["useState"]; const useTransition = __vite__cjsImport1_react["useTransition"];
import { splitJSONContent, formatBytes } from "/src/utils.ts";
import { JSONViewer } from "/src/components/JSONViewer.tsx";
import { generateOfflineHtml } from "/src/exporter.ts";
import { downloadSourceCodeZip } from "/src/sourceExporter.ts";
import {
  Upload,
  Settings,
  FileText,
  Sparkles,
  Check,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Download,
  Github
} from "/node_modules/.vite/deps/lucide-react.js?v=43d388fa";
export default function App() {
  const [inputText, setInputText] = useState("");
  const [targetSize, setTargetSize] = useState(45e4);
  const [forceMode, setForceMode] = useState("auto");
  const [chunks, setChunks] = useState([]);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);
  const [fileName, setFileName] = useState("");
  const [hasProcessed, setHasProcessed] = useState(false);
  const [modeUsed, setModeUsed] = useState("raw_text");
  const [processingError, setProcessingError] = useState(void 0);
  const [isPending, startTransition] = useTransition();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [totalInputSizeBytes, setTotalInputSizeBytes] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const rawFullTextRef = React.useRef("");
  React.useEffect(() => {
    if (rawFullTextRef.current) {
      try {
        const { chunks: resultChunks, modeUsed: resultMode, error } = splitJSONContent(
          rawFullTextRef.current,
          targetSize,
          forceMode
        );
        setChunks(resultChunks);
        setModeUsed(resultMode);
        setProcessingError(error);
        setActiveChunkIndex((prev) => Math.min(prev, resultChunks.length - 1));
      } catch (err) {
        setProcessingError("Errore durante la divisione live: " + err.message);
      }
    }
  }, [targetSize, forceMode]);
  const handleDownloadOfflineApp = () => {
    try {
      const htmlContent = generateOfflineHtml(isDarkMode);
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "json-chunker-offline.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export offline app: ", err);
    }
  };
  const handleDownloadSourceZip = async () => {
    setProcessingStage("Compilazione dei sorgenti in corso...");
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setProcessingStage("Creazione archivio ZIP del progetto...");
      await downloadSourceCodeZip();
    } catch (err) {
      console.error("Failed to export project source code ZIP: ", err);
      alert("Si è verificato un errore durante la generazione dello ZIP del codice sorgente.");
    } finally {
      setIsProcessing(false);
    }
  };
  const processJSONData = (text, customFileName) => {
    if (!text || !text.trim()) return;
    rawFullTextRef.current = text;
    setIsProcessing(true);
    setProcessingStage("Inizializzazione...");
    const calculatedSize = new Blob([text]).size;
    setTotalInputSizeBytes(calculatedSize);
    setTimeout(() => {
      setProcessingStage("Preparazione dei dati...");
      if (calculatedSize < 2e5) {
        setInputText(text);
      } else {
        setInputText(`[File JSON grande caricato con successo: ${formatBytes(calculatedSize)}]`);
      }
      if (customFileName) {
        setFileName(customFileName);
      } else if (!fileName) {
        setFileName("pasted_json.json");
      }
      setTimeout(() => {
        setProcessingStage("Analisi e divisione JSON (Zero Lag)...");
        setTimeout(() => {
          try {
            const { chunks: resultChunks, modeUsed: resultMode, error } = splitJSONContent(text, targetSize, forceMode);
            setChunks(resultChunks);
            setModeUsed(resultMode);
            setProcessingError(error);
            setActiveChunkIndex(0);
            setHasProcessed(true);
          } catch (err) {
            setProcessingError("Errore durante l'elaborazione: " + err.message);
          } finally {
            setIsProcessing(false);
          }
        }, 120);
      }, 120);
    }, 120);
  };
  const handleGenerateSample = () => {
    setIsProcessing(true);
    setProcessingStage("Generazione dati del test (15.000 record)...");
    setTimeout(() => {
      const items = [];
      const sampleNames = ["Raffaele", "Marco", "Sofia", "Giulia", "Elena", "Alessandro", "Matteo", "Chiara", "Leonardo", "Davide"];
      const sampleCities = ["Roma", "Milano", "Napoli", "Torino", "Firenze", "Bari", "Venezia", "Bologna", "Genova", "Palermo"];
      const sampleJobs = ["Ingegnere", "Designer", "Medico", "Insegnante", "Sviluppatore", "Cuoco", "Scrittore", "Astronauta", "Avvocato", "Barista"];
      for (let i = 1; i <= 15e3; i++) {
        items.push({
          id: i,
          guid: `id-gen-${Math.random().toString(36).substring(2, 11)}-${i}`,
          attivo: Math.random() > 0.3,
          profilo: {
            nome: sampleNames[i % sampleNames.length],
            citta: sampleCities[Math.random() > 0.5 ? i % sampleCities.length : 0],
            professione: sampleJobs[i % sampleJobs.length],
            punteggio: Math.floor(Math.random() * 1e3) + 100
          },
          cronologia_accessi: [
            { timestamp: new Date(Date.now() - Math.random() * 1e9).toISOString(), ip: `192.168.1.${i % 255}` },
            { timestamp: new Date(Date.now() - Math.random() * 5e6).toISOString(), ip: `10.0.0.${i % 255}` }
          ],
          metadati: {
            creato_il: "2026-06-11T06:17:51Z",
            lingua: i % 3 === 0 ? "it_IT" : "en_US",
            tags: ["json", "split", "tester", `tag_${i % 10}`]
          }
        });
      }
      const generated = JSON.stringify(items, null, 2);
      processJSONData(generated, "campione_10MB.json");
    }, 150);
  };
  const handleProcessText = () => {
    if (!inputText.trim()) return;
    processJSONData(inputText, fileName || "pasted_json.json");
  };
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    setTotalInputSizeBytes(new Blob([value]).size);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsProcessing(true);
    setProcessingStage("Lettura del file...");
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        processJSONData(text, file.name);
      };
      reader.onerror = () => {
        setIsProcessing(false);
        alert("Errore nella lettura del file.");
      };
      reader.readAsText(file);
    }, 150);
  };
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsProcessing(true);
      setProcessingStage("Caricamento file trascinato...");
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result;
          processJSONData(text, file.name);
        };
        reader.onerror = () => {
          setIsProcessing(false);
          alert("Errore nella lettura del file.");
        };
        reader.readAsText(file);
      }, 150);
    }
  };
  React.useEffect(() => {
    const handleGlobalPaste = (e) => {
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        e.preventDefault();
        const file = files[0];
        setFileName(file.name);
        setIsProcessing(true);
        setProcessingStage("File incollato! Lettura in corso...");
        setTimeout(() => {
          const reader = new FileReader();
          reader.onload = () => {
            const text2 = reader.result || "";
            processJSONData(text2, file.name);
          };
          reader.onerror = () => {
            setIsProcessing(false);
            alert("Errore di lettura del file incollato.");
          };
          reader.readAsText(file);
        }, 150);
        return;
      }
      const text = e.clipboardData?.getData("text");
      if (text && text.trim()) {
        const trimmed = text.trim();
        const activeElement = document.activeElement;
        if (activeElement && activeElement.id === "chunk-search-input") {
          return;
        }
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          e.preventDefault();
          setIsProcessing(true);
          setProcessingStage("Elaborazione JSON incollato automatico...");
          setTimeout(() => {
            processJSONData(text, "pasted_json.json");
          }, 120);
          return;
        }
        if (activeElement && activeElement.id === "paste-textarea" && text.length > 1e5) {
          e.preventDefault();
          setIsProcessing(true);
          setProcessingStage("Parificando testo incollato pesante...");
          setTimeout(() => {
            processJSONData(text, "pasted_heavy_json.json");
          }, 120);
        }
      }
    };
    window.addEventListener("paste", handleGlobalPaste);
    return () => {
      window.removeEventListener("paste", handleGlobalPaste);
    };
  }, [targetSize, forceMode, fileName]);
  const handleReset = () => {
    setInputText("");
    rawFullTextRef.current = "";
    setChunks([]);
    setFileName("");
    setActiveChunkIndex(0);
    setHasProcessed(false);
    setProcessingError(void 0);
    setTotalInputSizeBytes(0);
  };
  const handlePrevChunk = () => {
    if (activeChunkIndex > 0) {
      setActiveChunkIndex(activeChunkIndex - 1);
    }
  };
  const handleNextChunk = () => {
    if (activeChunkIndex < chunks.length - 1) {
      setActiveChunkIndex(activeChunkIndex + 1);
    }
  };
  const activeChunk = chunks[activeChunkIndex];
  return /* @__PURE__ */ jsxDEV("div", { className: `${isDarkMode ? "dark bg-zinc-950 text-zinc-100" : "bg-[#F9FAFB] text-zinc-900"} min-h-screen font-sans transition-colors duration-200 flex flex-col`, id: "main-app-root", children: [
    isProcessing && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-[100] backdrop-blur-md bg-zinc-950/75 flex flex-col items-center justify-center p-6 animate-fade-in", children: /* @__PURE__ */ jsxDEV("div", { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative flex items-center justify-center", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute w-16 h-16 rounded-full border-4 border-blue-500/20 animate-ping" }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 370,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-blue-600/10 border-l-transparent animate-spin" }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 372,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute text-blue-600 font-mono text-xs font-bold animate-pulse", children: "{ }" }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 373,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 368,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-bold text-gray-950 dark:text-zinc-50 uppercase tracking-wider", children: "Elaborazione JSON" }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 379,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-blue-600 dark:text-blue-400 font-mono font-medium animate-pulse", children: processingStage }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 382,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] text-gray-400 dark:text-zinc-500 mt-2", children: "Ottimizzazione memoria in corso per evitare il lag sul telefono." }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 385,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 378,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 367,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 366,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-gray-200 dark:border-zinc-800/80 px-4 py-4", id: "app-header", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-6xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold transform hover:rotate-3 transition-all duration-300", children: "{ }" }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 397,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h1", { className: "text-lg font-bold tracking-tight text-gray-800 dark:text-zinc-50", children: [
            "JSON ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-blue-600", children: "Chunker" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 402,
              columnNumber: 22
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 401,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] uppercase font-semibold text-gray-400 tracking-widest block -mt-0.5", children: "Lag-free Mobile splitting" }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 404,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 400,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 396,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleDownloadOfflineApp,
            className: "flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer",
            title: "Scarica l'intera app come file HTML autonomo per l'uso offline",
            style: { minHeight: "44px" },
            id: "btn-download-offline-app",
            children: [
              /* @__PURE__ */ jsxDEV(Download, { size: 14, className: "stroke-[2.5]" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 419,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline", children: "Scarica Offline (.html)" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 420,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "sm:hidden", children: "Scarica App" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 421,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 412,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleDownloadSourceZip,
            className: "flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer",
            title: "Scarica il codice sorgente completo in formato .ZIP pronto per essere caricato su GitHub",
            style: { minHeight: "44px" },
            id: "btn-download-source-zip",
            children: [
              /* @__PURE__ */ jsxDEV(Github, { size: 14, className: "stroke-[2.5]" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 432,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "hidden sm:inline font-bold", children: "Scarica per GitHub (.zip)" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 433,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "sm:hidden font-bold", children: "ZIP GitHub" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 434,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 425,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setIsDarkMode(!isDarkMode),
            className: "p-2 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-300 transition-all cursor-pointer",
            title: isDarkMode ? "Passa alla modalità chiara" : "Passa alla modalità scura",
            style: { minWidth: "44px", minHeight: "44px" },
            children: isDarkMode ? /* @__PURE__ */ jsxDEV(Sun, { size: 18 }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 444,
              columnNumber: 29
            }, this) : /* @__PURE__ */ jsxDEV(Moon, { size: 18 }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 444,
              columnNumber: 49
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 438,
            columnNumber: 13
          },
          this
        ),
        hasProcessed && /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleReset,
            className: "px-4 py-2 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 border border-gray-350 dark:border-zinc-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer",
            id: "btn-upload-new",
            style: { minHeight: "44px" },
            children: "Nuovo File"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 448,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 410,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 395,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 394,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "flex-1 flex flex-col p-4 sm:p-6 max-w-6xl w-full mx-auto", id: "app-main-content", children: !hasProcessed ? /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col justify-center items-center py-6 max-w-2xl mx-auto w-full animate-fade-in", id: "landing-screen", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-8 flex flex-col items-center", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full mb-4", children: [
          /* @__PURE__ */ jsxDEV(Cpu, { size: 12, className: "stroke-[2.5]" }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 471,
            columnNumber: 17
          }, this),
          "Ottimizzato per Smartphone (Zero Lag)"
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 470,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800 dark:text-white mb-2 leading-tight", children: "Evita il Lag del Telefono" }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 474,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500 dark:text-zinc-400 max-w-md", children: "Incolla o carica un file JSON pesante (es. 10 MB). Lo divideremo all'istante in blocchi leggeri da 450 KB, montando un pezzo alla volta per darti fluidità assoluta." }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 477,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 469,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col gap-4", id: "split-parameters", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 mb-1", children: [
          /* @__PURE__ */ jsxDEV(Settings, { size: 16, className: "text-blue-600" }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 485,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold uppercase tracking-wider text-gray-400", children: "Impostazioni di Divisione" }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 486,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 484,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-gray-700 dark:text-zinc-300", children: "Dimensione Blocco (Target):" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 492,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-1.5", children: [
              { size: 1e5, label: "100 KB", desc: "Leggerissimo" },
              { size: 25e4, label: "250 KB", desc: "Veloce" },
              { size: 45e4, label: "450 KB", desc: "Consigliato" },
              { size: 1e6, label: "1 MB", desc: "Pesante" }
            ].map((item) => /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => setTargetSize(item.size),
                className: `py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${targetSize === item.size ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-600" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"}`,
                style: { minHeight: "44px" },
                children: item.label
              },
              item.size,
              false,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 502,
                columnNumber: 23
              },
              this
            )) }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 495,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 491,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-semibold text-gray-700 dark:text-zinc-300", children: "Sintassi & Divisione:" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 521,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: forceMode,
                onChange: (e) => setForceMode(e.target.value),
                className: "w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500",
                style: { minHeight: "44px" },
                id: "select-split-mode",
                children: [
                  /* @__PURE__ */ jsxDEV("option", { value: "auto", children: "Auto (Dividi in Array/Oggetti validi)" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 531,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "array_items", children: "Forza Taglio ad Elementi Array" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 532,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "object_keys", children: "Forza Taglio a Chiavi Primarie" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 533,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("option", { value: "raw_text", children: "Taglia Solo come Testo Righe (Senza Parse)" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 534,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 524,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 520,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 490,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 483,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          onDragEnter: handleDrag,
          onDragOver: handleDrag,
          onDragLeave: handleDrag,
          onDrop: handleDrop,
          className: `w-full flex flex-col bg-white dark:bg-zinc-900 border-2 border-dashed ${dragActive ? "border-blue-500 bg-blue-50/10 dark:bg-blue-950/10 scale-[1.01]" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"} rounded-2xl p-6 transition-all relative overflow-hidden`,
          id: "upload-dropzone",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center py-4 text-center", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-blue-50 dark:bg-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-inner", children: /* @__PURE__ */ jsxDEV(Upload, { size: 22 }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 557,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 556,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-1", children: "Carica un file JSON pesante" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 559,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mb-4 max-w-sm", children: "Trascinalo direttamente qui, oppure clicca per sfogliare i tuoi file sul telefono." }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 562,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "label",
                {
                  className: "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-lg cursor-pointer shadow-sm transition-all inline-flex items-center justify-center",
                  style: { minHeight: "44px" },
                  children: [
                    /* @__PURE__ */ jsxDEV(
                      "input",
                      {
                        type: "file",
                        accept: ".json,application/json,text/plain",
                        className: "hidden",
                        onChange: handleFileUpload,
                        onClick: (e) => {
                          e.target.value = "";
                        }
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/App.tsx",
                        lineNumber: 569,
                        columnNumber: 19
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("span", { children: "Sfoglia File" }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 576,
                      columnNumber: 19
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 565,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 555,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 w-full my-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-gray-250 dark:bg-zinc-800 flex-1" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 582,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-mono uppercase text-gray-400", children: "oppure incolla testo" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 583,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-gray-250 dark:bg-zinc-800 flex-1" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 584,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 581,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "w-full flex flex-col", children: [
              /* @__PURE__ */ jsxDEV(
                "textarea",
                {
                  placeholder: "Incolla qui il tuo enorme codice JSON...",
                  value: inputText,
                  onChange: handleTextareaChange,
                  className: "w-full min-h-[140px] max-h-[300px] p-3 text-xs font-mono bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-600 dark:placeholder:text-zinc-500 leading-normal",
                  id: "paste-textarea"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 589,
                  columnNumber: 17
                },
                this
              ),
              inputText.trim() && /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: handleProcessText,
                  disabled: isPending,
                  className: "mt-3 w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5",
                  style: { minHeight: "46px" },
                  children: isPending ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "animate-spin text-sm", children: "⏳" }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 606,
                      columnNumber: 25
                    }, this),
                    " Elaborazione in corso..."
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 605,
                    columnNumber: 23
                  }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    /* @__PURE__ */ jsxDEV(Check, { size: 14, className: "stroke-[2.5]" }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 610,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: "Analizza ed Elabora Ora" }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 611,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 609,
                    columnNumber: 23
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 598,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 588,
              columnNumber: 15
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 541,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center mt-6", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-400 mb-2", children: "Non hai un JSON a portata di mano?" }, void 0, false, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 621,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: handleGenerateSample,
            className: "flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold leading-relaxed active:opacity-80 p-2",
            style: { minHeight: "44px" },
            children: [
              /* @__PURE__ */ jsxDEV(Sparkles, { size: 14 }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 628,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: "Genera ed Analizza un file di test da 5 MB ⚡" }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 629,
                columnNumber: 17
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 622,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 620,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 466,
      columnNumber: 11
    }, this) : (
      /* Schermata 2: ATTIVA - Esplorazione e Visualizzazione dei Pezzi */
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col md:flex-row gap-5 items-stretch h-full overflow-hidden", id: "dashboard-screen", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-full md:w-[260px] shrink-0 flex flex-col gap-3", id: "navigation-sidebar", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider", children: "File Caricato" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 644,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxDEV(FileText, { className: "text-blue-600 mt-1 shrink-0", size: 16 }, void 0, false, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 646,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-bold text-gray-800 dark:text-zinc-100 truncate", children: fileName || "documento.json" }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 648,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-400 font-mono", children: [
                  "Totale: ",
                  formatBytes(totalInputSizeBytes)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 651,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 647,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 645,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-gray-150 dark:bg-zinc-800 my-1" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 657,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col gap-2 mt-1", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500", children: "Dimensione Totale" }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 662,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-bold rounded", children: formatBytes(totalInputSizeBytes) }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 663,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 661,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500", children: "Limite Blocco" }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 668,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "px-2 py-0.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-bold rounded", children: formatBytes(targetSize) }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 669,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 667,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500", children: "Parti Totali" }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 674,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "px-2 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 text-xs font-bold rounded", children: chunks.length }, void 0, false, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 675,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 673,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 660,
              columnNumber: 17
            }, this),
            processingError && /* @__PURE__ */ jsxDEV("div", { className: "mt-2 text-[10px] bg-amber-500/10 text-amber-500 p-2 rounded-lg leading-relaxed", children: processingError }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 682,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 643,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "block md:hidden flex flex-col gap-1", id: "mobile-chunk-picker", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "text-xs font-bold text-zinc-400 uppercase tracking-widest px-1", children: "Vai al Blocco:" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 690,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "select",
              {
                value: activeChunkIndex,
                onChange: (e) => setActiveChunkIndex(Number(e.target.value)),
                className: "w-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400",
                style: { minHeight: "48px" },
                children: chunks.map((item, idx) => /* @__PURE__ */ jsxDEV("option", { value: idx, children: [
                  "#",
                  idx + 1,
                  ": ",
                  item.label,
                  " (",
                  formatBytes(item.sizeBytes),
                  ")"
                ] }, idx, true, {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 700,
                  columnNumber: 21
                }, this))
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 693,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 689,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "hidden md:flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden p-3 shadow-sm h-[400px]", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1", children: "Elenco Blocchi" }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 709,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 ", id: "desktop-chunks-list", children: chunks.map((item, idx) => {
              const isActive = activeChunkIndex === idx;
              return /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => setActiveChunkIndex(idx),
                  className: `text-left p-2.5 rounded-xl transition-all cursor-pointer ${isActive ? "bg-blue-600 text-white font-bold border-l-4 border-blue-800" : "bg-[#F9FAFB] hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-850/80 text-zinc-700 dark:text-zinc-300"}`,
                  children: /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center text-xs", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "truncate max-w-[140px]", children: item.label }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 726,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] opacity-75 font-mono", children: formatBytes(item.sizeBytes) }, void 0, false, {
                      fileName: "/app/applet/src/App.tsx",
                      lineNumber: 727,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 725,
                    columnNumber: 25
                  }, this)
                },
                idx,
                false,
                {
                  fileName: "/app/applet/src/App.tsx",
                  lineNumber: 716,
                  columnNumber: 23
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 712,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 708,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 640,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex-1 flex flex-col gap-4 min-w-0", id: "viewer-stage", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-h-[400px]", children: activeChunk ? /* @__PURE__ */ jsxDEV(JSONViewer, { chunk: activeChunk }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 743,
            columnNumber: 19
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center p-8 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-2xl text-sm italic", children: "Nessun blocco attivo." }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 745,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 741,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-sm", id: "chunk-navigation-bar", children: [
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handlePrevChunk,
                disabled: activeChunkIndex === 0,
                className: `flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 duration-100 cursor-pointer ${activeChunkIndex === 0 ? "text-gray-400 bg-gray-100 dark:text-zinc-600 dark:bg-zinc-800 cursor-not-allowed" : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-100 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50"}`,
                style: { minWidth: "100px", minHeight: "48px" },
                children: [
                  /* @__PURE__ */ jsxDEV(ChevronLeft, { size: 16 }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 765,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: "PREVIOUS PART" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 766,
                    columnNumber: 19
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 755,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "px-4 py-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-750", children: /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-gray-700 dark:text-zinc-300 tracking-wider", children: [
              "PART ",
              activeChunkIndex + 1,
              " OF ",
              chunks.length
            ] }, void 0, true, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 771,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/App.tsx",
              lineNumber: 770,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: handleNextChunk,
                disabled: activeChunkIndex === chunks.length - 1,
                className: `flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 duration-100 cursor-pointer ${activeChunkIndex === chunks.length - 1 ? "text-gray-400 bg-gray-100 dark:text-zinc-600 dark:bg-zinc-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"}`,
                style: { minWidth: "100px", minHeight: "48px" },
                children: [
                  /* @__PURE__ */ jsxDEV("span", { children: "NEXT PART" }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 787,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV(ChevronRight, { size: 16 }, void 0, false, {
                    fileName: "/app/applet/src/App.tsx",
                    lineNumber: 788,
                    columnNumber: 19
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/App.tsx",
                lineNumber: 777,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/App.tsx",
            lineNumber: 752,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/App.tsx",
          lineNumber: 738,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/App.tsx",
        lineNumber: 637,
        columnNumber: 11
      }, this)
    ) }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 462,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("footer", { className: "py-4 text-center text-zinc-400 dark:text-zinc-600 text-xs border-t border-zinc-200/50 dark:border-zinc-900/50 mt-auto", id: "app-footer", children: "Visualizzatore Split JSON • Nessun dato inviato al server, lavora in locale." }, void 0, false, {
      fileName: "/app/applet/src/App.tsx",
      lineNumber: 800,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/App.tsx",
    lineNumber: 362,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VUcmFuc2l0aW9uLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgSlNPTkNodW5rLCBTcGxpdE1vZGUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHNwbGl0SlNPTkNvbnRlbnQsIGZvcm1hdEJ5dGVzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBKU09OVmlld2VyIH0gZnJvbSAnLi9jb21wb25lbnRzL0pTT05WaWV3ZXInO1xuaW1wb3J0IHsgZ2VuZXJhdGVPZmZsaW5lSHRtbCB9IGZyb20gJy4vZXhwb3J0ZXInO1xuaW1wb3J0IHsgZG93bmxvYWRTb3VyY2VDb2RlWmlwIH0gZnJvbSAnLi9zb3VyY2VFeHBvcnRlcic7XG5pbXBvcnQgeyBcbiAgRmlsZUpzb24sIFxuICBVcGxvYWQsIFxuICBTZXR0aW5ncywgXG4gIFJlZnJlc2hDdywgXG4gIEZpbGVUZXh0LCBcbiAgU3BhcmtsZXMsIFxuICBIaXN0b3J5LCBcbiAgSGVscENpcmNsZSxcbiAgQ2hlY2ssIFxuICBDcHUsXG4gIENoZXZyb25MZWZ0LFxuICBDaGV2cm9uUmlnaHQsXG4gIE1lbnUsXG4gIE1vb24sXG4gIFN1bixcbiAgRG93bmxvYWQsXG4gIEdpdGh1YlxufSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoKSB7XG4gIGNvbnN0IFtpbnB1dFRleHQsIHNldElucHV0VGV4dF0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFt0YXJnZXRTaXplLCBzZXRUYXJnZXRTaXplXSA9IHVzZVN0YXRlPG51bWJlcj4oNDUwMDAwKTsgLy8gRGVmYXVsdCB+NDUwIEtCXG4gIGNvbnN0IFtmb3JjZU1vZGUsIHNldEZvcmNlTW9kZV0gPSB1c2VTdGF0ZTxTcGxpdE1vZGU+KCdhdXRvJyk7XG4gIGNvbnN0IFtjaHVua3MsIHNldENodW5rc10gPSB1c2VTdGF0ZTxKU09OQ2h1bmtbXT4oW10pO1xuICBjb25zdCBbYWN0aXZlQ2h1bmtJbmRleCwgc2V0QWN0aXZlQ2h1bmtJbmRleF0gPSB1c2VTdGF0ZTxudW1iZXI+KDApO1xuICBjb25zdCBbZmlsZU5hbWUsIHNldEZpbGVOYW1lXSA9IHVzZVN0YXRlPHN0cmluZz4oJycpO1xuICBjb25zdCBbaGFzUHJvY2Vzc2VkLCBzZXRIYXNQcm9jZXNzZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbbW9kZVVzZWQsIHNldE1vZGVVc2VkXSA9IHVzZVN0YXRlPFNwbGl0TW9kZT4oJ3Jhd190ZXh0Jyk7XG4gIGNvbnN0IFtwcm9jZXNzaW5nRXJyb3IsIHNldFByb2Nlc3NpbmdFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIGNvbnN0IFtpc1BlbmRpbmcsIHN0YXJ0VHJhbnNpdGlvbl0gPSB1c2VUcmFuc2l0aW9uKCk7XG4gIGNvbnN0IFtpc0RhcmtNb2RlLCBzZXRJc0RhcmtNb2RlXSA9IHVzZVN0YXRlPGJvb2xlYW4+KHRydWUpOyAvLyBkZWZhdWx0IGRhcmsgZGV2ZWxvcGVyIHRvb2xzIHRoZW1lXG4gIGNvbnN0IFtpc1Byb2Nlc3NpbmcsIHNldElzUHJvY2Vzc2luZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtwcm9jZXNzaW5nU3RhZ2UsIHNldFByb2Nlc3NpbmdTdGFnZV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFt0b3RhbElucHV0U2l6ZUJ5dGVzLCBzZXRUb3RhbElucHV0U2l6ZUJ5dGVzXSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XG4gIFxuICAvLyBEcmFnIE92ZXIgQ2xhc3MgaGVscGVyXG4gIGNvbnN0IFtkcmFnQWN0aXZlLCBzZXREcmFnQWN0aXZlXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICAvLyBQZXJzaXN0ZW50IHJlZmVyZW5jZSB0byBvcmlnaW5hbCB1bnByaW1lZCByYXcgSlNPTiB0ZXh0IHRvIGF2b2lkIGhlYXZ5IHJlbmRlcnMvc3RhdGUgY3Jhc2hlc1xuICBjb25zdCByYXdGdWxsVGV4dFJlZiA9IFJlYWN0LnVzZVJlZjxzdHJpbmc+KCcnKTtcblxuICAvLyBSZS1zcGxpdCBhdXRvbWF0aWNhbGx5IHdoZW5ldmVyIHRhcmdldFNpemUgb3IgZm9yY2VNb2RlIGNoYW5nZXMgbGl2ZVxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyYXdGdWxsVGV4dFJlZi5jdXJyZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNodW5rczogcmVzdWx0Q2h1bmtzLCBtb2RlVXNlZDogcmVzdWx0TW9kZSwgZXJyb3IgfSA9IHNwbGl0SlNPTkNvbnRlbnQoXG4gICAgICAgICAgcmF3RnVsbFRleHRSZWYuY3VycmVudCxcbiAgICAgICAgICB0YXJnZXRTaXplLFxuICAgICAgICAgIGZvcmNlTW9kZVxuICAgICAgICApO1xuICAgICAgICBzZXRDaHVua3MocmVzdWx0Q2h1bmtzKTtcbiAgICAgICAgc2V0TW9kZVVzZWQocmVzdWx0TW9kZSk7XG4gICAgICAgIHNldFByb2Nlc3NpbmdFcnJvcihlcnJvcik7XG4gICAgICAgIHNldEFjdGl2ZUNodW5rSW5kZXgoKHByZXYpID0+IE1hdGgubWluKHByZXYsIHJlc3VsdENodW5rcy5sZW5ndGggLSAxKSk7XG4gICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICBzZXRQcm9jZXNzaW5nRXJyb3IoXCJFcnJvcmUgZHVyYW50ZSBsYSBkaXZpc2lvbmUgbGl2ZTogXCIgKyBlcnIubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9LCBbdGFyZ2V0U2l6ZSwgZm9yY2VNb2RlXSk7XG5cbiAgLy8gRG93bmxvYWQgZW50aXJlIHNlbGYtY29udGFpbmVkIGFwcFxuICBjb25zdCBoYW5kbGVEb3dubG9hZE9mZmxpbmVBcHAgPSAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gZ2VuZXJhdGVPZmZsaW5lSHRtbChpc0RhcmtNb2RlKTtcbiAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbaHRtbENvbnRlbnRdLCB7IHR5cGU6ICd0ZXh0L2h0bWw7Y2hhcnNldD11dGYtOCcgfSk7XG4gICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGxpbmsuaHJlZiA9IHVybDtcbiAgICAgIGxpbmsuZG93bmxvYWQgPSAnanNvbi1jaHVua2VyLW9mZmxpbmUuaHRtbCc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgbGluay5jbGljaygpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBleHBvcnQgb2ZmbGluZSBhcHA6ICcsIGVycik7XG4gICAgfVxuICB9O1xuXG4gIC8vIERvd25sb2FkIGVudGlyZSBjbGVhbiBwcm9qZWN0IHNvdXJjZSBmaWxlcyBhcyBhIFpJUCBmb3IgR2l0SHViIHVwbG9hZFxuICBjb25zdCBoYW5kbGVEb3dubG9hZFNvdXJjZVppcCA9IGFzeW5jICgpID0+IHtcbiAgICBzZXRQcm9jZXNzaW5nU3RhZ2UoJ0NvbXBpbGF6aW9uZSBkZWkgc29yZ2VudGkgaW4gY29yc28uLi4nKTtcbiAgICBzZXRJc1Byb2Nlc3NpbmcodHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFNtYWxsIHRpbWVvdXQgdG8gbGV0IHByb2Nlc3NpbmcgbW9kYWwgcmVuZGVyIG5pY2VseVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzUwKSk7XG4gICAgICBzZXRQcm9jZXNzaW5nU3RhZ2UoJ0NyZWF6aW9uZSBhcmNoaXZpbyBaSVAgZGVsIHByb2dldHRvLi4uJyk7XG4gICAgICBhd2FpdCBkb3dubG9hZFNvdXJjZUNvZGVaaXAoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBleHBvcnQgcHJvamVjdCBzb3VyY2UgY29kZSBaSVA6ICcsIGVycik7XG4gICAgICBhbGVydCgnU2kgw6ggdmVyaWZpY2F0byB1biBlcnJvcmUgZHVyYW50ZSBsYSBnZW5lcmF6aW9uZSBkZWxsbyBaSVAgZGVsIGNvZGljZSBzb3JnZW50ZS4nKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0SXNQcm9jZXNzaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQ29yZSBhc3luY2hyb25vdXMgcHJvZ3Jlc3NpdmUgZGF0YSBjaHVua2VyIHRhc2sgcHJvY2Vzc29yXG4gIGNvbnN0IHByb2Nlc3NKU09ORGF0YSA9ICh0ZXh0OiBzdHJpbmcsIGN1c3RvbUZpbGVOYW1lPzogc3RyaW5nKSA9PiB7XG4gICAgaWYgKCF0ZXh0IHx8ICF0ZXh0LnRyaW0oKSkgcmV0dXJuO1xuICAgIFxuICAgIC8vIFNhdmUgb3JpZ2luYWwgcHJpc3RpbmUgcmF3IHRleHQgaW4gcGVyc2lzdGVudCByZWZcbiAgICByYXdGdWxsVGV4dFJlZi5jdXJyZW50ID0gdGV4dDtcbiAgICBcbiAgICBzZXRJc1Byb2Nlc3NpbmcodHJ1ZSk7XG4gICAgc2V0UHJvY2Vzc2luZ1N0YWdlKCdJbml6aWFsaXp6YXppb25lLi4uJyk7XG5cbiAgICBjb25zdCBjYWxjdWxhdGVkU2l6ZSA9IG5ldyBCbG9iKFt0ZXh0XSkuc2l6ZTtcbiAgICBzZXRUb3RhbElucHV0U2l6ZUJ5dGVzKGNhbGN1bGF0ZWRTaXplKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0UHJvY2Vzc2luZ1N0YWdlKCdQcmVwYXJhemlvbmUgZGVpIGRhdGkuLi4nKTtcbiAgICAgIFxuICAgICAgLy8gSWYgdGhlIGZpbGUgaXMgc21hbGwgKHVuZGVyIDIwMCBLQiksIGxldCdzIHBsYWNlIGl0IGluc2lkZSB0aGUgdGV4dGFyZWEuXG4gICAgICAvLyBPdGhlcndpc2UsIGtlZXAgYSBkZXNjcmlwdGl2ZSB0ZXh0IHBsYWNlaG9sZGVyIHRvIGNvbXBsZXRlbHkgYXZvaWQgcmVuZGVyaW5nIGxhZyBvciBjcmFzaGVzLlxuICAgICAgaWYgKGNhbGN1bGF0ZWRTaXplIDwgMjAwMDAwKSB7XG4gICAgICAgIHNldElucHV0VGV4dCh0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldElucHV0VGV4dChgW0ZpbGUgSlNPTiBncmFuZGUgY2FyaWNhdG8gY29uIHN1Y2Nlc3NvOiAke2Zvcm1hdEJ5dGVzKGNhbGN1bGF0ZWRTaXplKX1dYCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXN0b21GaWxlTmFtZSkge1xuICAgICAgICBzZXRGaWxlTmFtZShjdXN0b21GaWxlTmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKCFmaWxlTmFtZSkge1xuICAgICAgICBzZXRGaWxlTmFtZSgncGFzdGVkX2pzb24uanNvbicpO1xuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2V0UHJvY2Vzc2luZ1N0YWdlKCdBbmFsaXNpIGUgZGl2aXNpb25lIEpTT04gKFplcm8gTGFnKS4uLicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB7IGNodW5rczogcmVzdWx0Q2h1bmtzLCBtb2RlVXNlZDogcmVzdWx0TW9kZSwgZXJyb3IgfSA9IHNwbGl0SlNPTkNvbnRlbnQodGV4dCwgdGFyZ2V0U2l6ZSwgZm9yY2VNb2RlKTtcbiAgICAgICAgICAgIHNldENodW5rcyhyZXN1bHRDaHVua3MpO1xuICAgICAgICAgICAgc2V0TW9kZVVzZWQocmVzdWx0TW9kZSk7XG4gICAgICAgICAgICBzZXRQcm9jZXNzaW5nRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgc2V0QWN0aXZlQ2h1bmtJbmRleCgwKTtcbiAgICAgICAgICAgIHNldEhhc1Byb2Nlc3NlZCh0cnVlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICAgICAgc2V0UHJvY2Vzc2luZ0Vycm9yKFwiRXJyb3JlIGR1cmFudGUgbCdlbGFib3JhemlvbmU6IFwiICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRJc1Byb2Nlc3NpbmcoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTIwKTtcbiAgICAgIH0sIDEyMCk7XG4gICAgfSwgMTIwKTtcbiAgfTtcblxuICAvLyBFc2VtcGlvIGZpbnRvIHBlciBmYXIgdGVzdGFyZSBsJ2FwcCBzdWJpdG9cbiAgY29uc3QgaGFuZGxlR2VuZXJhdGVTYW1wbGUgPSAoKSA9PiB7XG4gICAgc2V0SXNQcm9jZXNzaW5nKHRydWUpO1xuICAgIHNldFByb2Nlc3NpbmdTdGFnZSgnR2VuZXJhemlvbmUgZGF0aSBkZWwgdGVzdCAoMTUuMDAwIHJlY29yZCkuLi4nKTtcbiAgICBcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gW107XG4gICAgICBjb25zdCBzYW1wbGVOYW1lcyA9IFsnUmFmZmFlbGUnLCAnTWFyY28nLCAnU29maWEnLCAnR2l1bGlhJywgJ0VsZW5hJywgJ0FsZXNzYW5kcm8nLCAnTWF0dGVvJywgJ0NoaWFyYScsICdMZW9uYXJkbycsICdEYXZpZGUnXTtcbiAgICAgIGNvbnN0IHNhbXBsZUNpdGllcyA9IFsnUm9tYScsICdNaWxhbm8nLCAnTmFwb2xpJywgJ1RvcmlubycsICdGaXJlbnplJywgJ0JhcmknLCAnVmVuZXppYScsICdCb2xvZ25hJywgJ0dlbm92YScsICdQYWxlcm1vJ107XG4gICAgICBjb25zdCBzYW1wbGVKb2JzID0gWydJbmdlZ25lcmUnLCAnRGVzaWduZXInLCAnTWVkaWNvJywgJ0luc2VnbmFudGUnLCAnU3ZpbHVwcGF0b3JlJywgJ0N1b2NvJywgJ1Njcml0dG9yZScsICdBc3Ryb25hdXRhJywgJ0F2dm9jYXRvJywgJ0JhcmlzdGEnXTtcblxuICAgICAgLy8gR2VuZXJpYW1vIGNpcmNhIDE1LjAwMCByZWNvcmQgcGVyIGZhcmUgfjUtOCBNQiBkaSBKU09OIHJlYWxlXG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAxNTAwMDsgaSsrKSB7XG4gICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgIGlkOiBpLFxuICAgICAgICAgIGd1aWQ6IGBpZC1nZW4tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpfS0ke2l9YCxcbiAgICAgICAgICBhdHRpdm86IE1hdGgucmFuZG9tKCkgPiAwLjMsXG4gICAgICAgICAgcHJvZmlsbzoge1xuICAgICAgICAgICAgbm9tZTogc2FtcGxlTmFtZXNbaSAlIHNhbXBsZU5hbWVzLmxlbmd0aF0sXG4gICAgICAgICAgICBjaXR0YTogc2FtcGxlQ2l0aWVzW01hdGgucmFuZG9tKCkgPiAwLjUgPyAoaSAlIHNhbXBsZUNpdGllcy5sZW5ndGgpIDogMF0sXG4gICAgICAgICAgICBwcm9mZXNzaW9uZTogc2FtcGxlSm9ic1tpICUgc2FtcGxlSm9icy5sZW5ndGhdLFxuICAgICAgICAgICAgcHVudGVnZ2lvOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKSArIDEwMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY3Jvbm9sb2dpYV9hY2Nlc3NpOiBbXG4gICAgICAgICAgICB7IHRpbWVzdGFtcDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDAwKS50b0lTT1N0cmluZygpLCBpcDogYDE5Mi4xNjguMS4ke2kgJSAyNTV9YCB9LFxuICAgICAgICAgICAgeyB0aW1lc3RhbXA6IG5ldyBEYXRlKERhdGUubm93KCkgLSBNYXRoLnJhbmRvbSgpICogNTAwMDAwMCkudG9JU09TdHJpbmcoKSwgaXA6IGAxMC4wLjAuJHtpICUgMjU1fWAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgbWV0YWRhdGk6IHtcbiAgICAgICAgICAgIGNyZWF0b19pbDogJzIwMjYtMDYtMTFUMDY6MTc6NTFaJyxcbiAgICAgICAgICAgIGxpbmd1YTogaSAlIDMgPT09IDAgPyAnaXRfSVQnIDogJ2VuX1VTJyxcbiAgICAgICAgICAgIHRhZ3M6IFsnanNvbicsICdzcGxpdCcsICd0ZXN0ZXInLCBgdGFnXyR7aSAlIDEwfWBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2VuZXJhdGVkID0gSlNPTi5zdHJpbmdpZnkoaXRlbXMsIG51bGwsIDIpO1xuICAgICAgcHJvY2Vzc0pTT05EYXRhKGdlbmVyYXRlZCwgJ2NhbXBpb25lXzEwTUIuanNvbicpO1xuICAgIH0sIDE1MCk7XG4gIH07XG5cbiAgLy8gQ2FyaWNhbWVudG8gdGVzdG8gZGlyZXR0b1xuICBjb25zdCBoYW5kbGVQcm9jZXNzVGV4dCA9ICgpID0+IHtcbiAgICBpZiAoIWlucHV0VGV4dC50cmltKCkpIHJldHVybjtcbiAgICBwcm9jZXNzSlNPTkRhdGEoaW5wdXRUZXh0LCBmaWxlTmFtZSB8fCAncGFzdGVkX2pzb24uanNvbicpO1xuICB9O1xuXG4gIC8vIEdlc3Rpb25lIGRlbCB0ZXN0byBkaWdpdGF0byBtYW51YWxtZW50ZVxuICBjb25zdCBoYW5kbGVUZXh0YXJlYUNoYW5nZSA9IChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MVGV4dEFyZWFFbGVtZW50PikgPT4ge1xuICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgc2V0SW5wdXRUZXh0KHZhbHVlKTtcbiAgICBzZXRUb3RhbElucHV0U2l6ZUJ5dGVzKG5ldyBCbG9iKFt2YWx1ZV0pLnNpemUpO1xuICB9O1xuXG4gIC8vIENhcmljYW1lbnRvIHRyYW1pdGUgZmlsZVxuICBjb25zdCBoYW5kbGVGaWxlVXBsb2FkID0gKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzPy5bMF07XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG5cbiAgICBzZXRGaWxlTmFtZShmaWxlLm5hbWUpO1xuICAgIHNldElzUHJvY2Vzc2luZyh0cnVlKTtcbiAgICBzZXRQcm9jZXNzaW5nU3RhZ2UoJ0xldHR1cmEgZGVsIGZpbGUuLi4nKTtcbiAgICBcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBldmVudC50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmc7XG4gICAgICAgIHByb2Nlc3NKU09ORGF0YSh0ZXh0LCBmaWxlLm5hbWUpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBzZXRJc1Byb2Nlc3NpbmcoZmFsc2UpO1xuICAgICAgICBhbGVydCgnRXJyb3JlIG5lbGxhIGxldHR1cmEgZGVsIGZpbGUuJyk7XG4gICAgICB9O1xuICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgfSwgMTUwKTtcbiAgfTtcblxuICAvLyBEcmFnIGFuZCBkcm9wIGV2ZW50c1xuICBjb25zdCBoYW5kbGVEcmFnID0gKGU6IFJlYWN0LkRyYWdFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChlLnR5cGUgPT09ICdkcmFnZW50ZXInIHx8IGUudHlwZSA9PT0gJ2RyYWdvdmVyJykge1xuICAgICAgc2V0RHJhZ0FjdGl2ZSh0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGUudHlwZSA9PT0gJ2RyYWdsZWF2ZScpIHtcbiAgICAgIHNldERyYWdBY3RpdmUoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVEcm9wID0gKGU6IFJlYWN0LkRyYWdFdmVudCkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHNldERyYWdBY3RpdmUoZmFsc2UpO1xuXG4gICAgY29uc3QgZmlsZSA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzPy5bMF07XG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIHNldEZpbGVOYW1lKGZpbGUubmFtZSk7XG4gICAgICBzZXRJc1Byb2Nlc3NpbmcodHJ1ZSk7XG4gICAgICBzZXRQcm9jZXNzaW5nU3RhZ2UoJ0NhcmljYW1lbnRvIGZpbGUgdHJhc2NpbmF0by4uLicpO1xuICAgICAgXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChldmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRleHQgPSBldmVudC50YXJnZXQ/LnJlc3VsdCBhcyBzdHJpbmc7XG4gICAgICAgICAgcHJvY2Vzc0pTT05EYXRhKHRleHQsIGZpbGUubmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgIHNldElzUHJvY2Vzc2luZyhmYWxzZSk7XG4gICAgICAgICAgYWxlcnQoJ0Vycm9yZSBuZWxsYSBsZXR0dXJhIGRlbCBmaWxlLicpO1xuICAgICAgICB9O1xuICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgIH0sIDE1MCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEludGVyY2V0dG9yZSBkZWdsaSBldmVudGkgZGkgaW5jb2xsYSBnbG9iYWxlIHBlciBjbGlwYm9hcmQgZmlsZXMgZSB0ZXN0aSBnaWdhbnRpXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlR2xvYmFsUGFzdGUgPSAoZTogQ2xpcGJvYXJkRXZlbnQpID0+IHtcbiAgICAgIC8vIDEuIEdlc3Rpb25lIGluY29sbGEgZmlsZSBkYSBjbGlwYm9hcmRcbiAgICAgIGNvbnN0IGZpbGVzID0gZS5jbGlwYm9hcmREYXRhPy5maWxlcztcbiAgICAgIGlmIChmaWxlcyAmJiBmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzWzBdO1xuICAgICAgICBzZXRGaWxlTmFtZShmaWxlLm5hbWUpO1xuICAgICAgICBzZXRJc1Byb2Nlc3NpbmcodHJ1ZSk7XG4gICAgICAgIHNldFByb2Nlc3NpbmdTdGFnZSgnRmlsZSBpbmNvbGxhdG8hIExldHR1cmEgaW4gY29yc28uLi4nKTtcbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSAocmVhZGVyLnJlc3VsdCB8fCAnJykgYXMgc3RyaW5nO1xuICAgICAgICAgICAgcHJvY2Vzc0pTT05EYXRhKHRleHQsIGZpbGUubmFtZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHNldElzUHJvY2Vzc2luZyhmYWxzZSk7XG4gICAgICAgICAgICBhbGVydCgnRXJyb3JlIGRpIGxldHR1cmEgZGVsIGZpbGUgaW5jb2xsYXRvLicpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICAgIH0sIDE1MCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gMi4gR2VzdGlvbmUgaW5jb2xsYSBkaSB0ZXN0byBkYSBjbGlwYm9hcmRcbiAgICAgIGNvbnN0IHRleHQgPSBlLmNsaXBib2FyZERhdGE/LmdldERhdGEoJ3RleHQnKTtcbiAgICAgIGlmICh0ZXh0ICYmIHRleHQudHJpbSgpKSB7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSB0ZXh0LnRyaW0oKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNlIHNpIHN0YSBkaWdpdGFuZG8gbmVsIGNhbXBvIGRpIHJpY2VyY2EsIGxhc2NpYSBsYXZvcmFyZSBpbCBwYXN0ZSBuYXRpdm9cbiAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGlmIChhY3RpdmVFbGVtZW50ICYmIGFjdGl2ZUVsZW1lbnQuaWQgPT09ICdjaHVuay1zZWFyY2gtaW5wdXQnKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2UgaWwgdGVzdG8gaW5jb2xsYXRvIHNlbWJyYSBlc3NlcmUgSlNPTiAoaW5pemlhIGNvbiB7IG8gWyksIGxvIGVsYWJvcmlhbW8gQVVUT01BVElDQU1FTlRFIG92dW5xdWUgc2kgdHJvdmkgbCd1dGVudGUhXG4gICAgICAgIGlmICh0cmltbWVkLnN0YXJ0c1dpdGgoJ3snKSB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJ1snKSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBzZXRJc1Byb2Nlc3NpbmcodHJ1ZSk7XG4gICAgICAgICAgc2V0UHJvY2Vzc2luZ1N0YWdlKCdFbGFib3JhemlvbmUgSlNPTiBpbmNvbGxhdG8gYXV0b21hdGljby4uLicpO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgcHJvY2Vzc0pTT05EYXRhKHRleHQsICdwYXN0ZWRfanNvbi5qc29uJyk7XG4gICAgICAgICAgfSwgMTIwKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZSBsJ3V0ZW50ZSDDqCBmb2N1c2VkIG5lbGxhIHRleHRhcmVhIGVkIMOoIHVuIGlucHV0IGVub3JtZSA+IDEwMCBLQiBtYSBub24gw6ggbmVjZXNzYXJpYW1lbnRlIEpTT04gdmFsaWRvLCBcbiAgICAgICAgLy8gaW50ZXJjZXR0aWFtbyBwZXIgcHJldmVuaXJlIGxhZyBkZWxsJ2ludGVyZmFjY2lhXG4gICAgICAgIGlmIChhY3RpdmVFbGVtZW50ICYmIGFjdGl2ZUVsZW1lbnQuaWQgPT09ICdwYXN0ZS10ZXh0YXJlYScgJiYgdGV4dC5sZW5ndGggPiAxMDAwMDApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgc2V0SXNQcm9jZXNzaW5nKHRydWUpO1xuICAgICAgICAgIHNldFByb2Nlc3NpbmdTdGFnZSgnUGFyaWZpY2FuZG8gdGVzdG8gaW5jb2xsYXRvIHBlc2FudGUuLi4nKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHByb2Nlc3NKU09ORGF0YSh0ZXh0LCAncGFzdGVkX2hlYXZ5X2pzb24uanNvbicpO1xuICAgICAgICAgIH0sIDEyMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgaGFuZGxlR2xvYmFsUGFzdGUpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGFzdGUnLCBoYW5kbGVHbG9iYWxQYXN0ZSk7XG4gICAgfTtcbiAgfSwgW3RhcmdldFNpemUsIGZvcmNlTW9kZSwgZmlsZU5hbWVdKTtcblxuICBjb25zdCBoYW5kbGVSZXNldCA9ICgpID0+IHtcbiAgICBzZXRJbnB1dFRleHQoJycpO1xuICAgIHJhd0Z1bGxUZXh0UmVmLmN1cnJlbnQgPSAnJztcbiAgICBzZXRDaHVua3MoW10pO1xuICAgIHNldEZpbGVOYW1lKCcnKTtcbiAgICBzZXRBY3RpdmVDaHVua0luZGV4KDApO1xuICAgIHNldEhhc1Byb2Nlc3NlZChmYWxzZSk7XG4gICAgc2V0UHJvY2Vzc2luZ0Vycm9yKHVuZGVmaW5lZCk7XG4gICAgc2V0VG90YWxJbnB1dFNpemVCeXRlcygwKTtcbiAgfTtcblxuICAvLyBOYXZpZ2F6aW9uZSB0cmEgaSBjaHVuayBjb24gcHVsaXppYSBtZW1vcmlhXG4gIGNvbnN0IGhhbmRsZVByZXZDaHVuayA9ICgpID0+IHtcbiAgICBpZiAoYWN0aXZlQ2h1bmtJbmRleCA+IDApIHtcbiAgICAgIHNldEFjdGl2ZUNodW5rSW5kZXgoYWN0aXZlQ2h1bmtJbmRleCAtIDEpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVOZXh0Q2h1bmsgPSAoKSA9PiB7XG4gICAgaWYgKGFjdGl2ZUNodW5rSW5kZXggPCBjaHVua3MubGVuZ3RoIC0gMSkge1xuICAgICAgc2V0QWN0aXZlQ2h1bmtJbmRleChhY3RpdmVDaHVua0luZGV4ICsgMSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGFjdGl2ZUNodW5rID0gY2h1bmtzW2FjdGl2ZUNodW5rSW5kZXhdO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2Ake2lzRGFya01vZGUgPyAnZGFyayBiZy16aW5jLTk1MCB0ZXh0LXppbmMtMTAwJyA6ICdiZy1bI0Y5RkFGQl0gdGV4dC16aW5jLTkwMCd9IG1pbi1oLXNjcmVlbiBmb250LXNhbnMgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMjAwIGZsZXggZmxleC1jb2xgfSBpZD1cIm1haW4tYXBwLXJvb3RcIj5cbiAgICAgIFxuICAgICAgey8qIFBST0NFU1NJTkcgT1ZFUkxBWSBGT1IgUEhPTkUgLyBPRkZMSU5FIFNFU1NJT05TICovfVxuICAgICAge2lzUHJvY2Vzc2luZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LVsxMDBdIGJhY2tkcm9wLWJsdXItbWQgYmctemluYy05NTAvNzUgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC02IGFuaW1hdGUtZmFkZS1pblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctd2hpdGUgZGFyazpiZy16aW5jLTkwMCBib3JkZXIgYm9yZGVyLXppbmMtMjAwIGRhcms6Ym9yZGVyLXppbmMtODUwIHAtNiBzbTpwLTggcm91bmRlZC0yeGwgc2hhZG93LTJ4bCBtYXgtdy1zbSB3LWZ1bGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgdGV4dC1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgey8qIFB1bHNpbmcgZ2xvdyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB3LTE2IGgtMTYgcm91bmRlZC1mdWxsIGJvcmRlci00IGJvcmRlci1ibHVlLTUwMC8yMCBhbmltYXRlLXBpbmdcIj48L2Rpdj5cbiAgICAgICAgICAgICAgey8qIFNwaW5uZXIgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xNiBoLTE2IHJvdW5kZWQtZnVsbCBib3JkZXItNCBib3JkZXItdC1ibHVlLTYwMCBib3JkZXItci10cmFuc3BhcmVudCBib3JkZXItYi1ibHVlLTYwMC8xMCBib3JkZXItbC10cmFuc3BhcmVudCBhbmltYXRlLXNwaW5cIj48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0ZXh0LWJsdWUtNjAwIGZvbnQtbW9ubyB0ZXh0LXhzIGZvbnQtYm9sZCBhbmltYXRlLXB1bHNlXCI+XG4gICAgICAgICAgICAgICAgeyd7IH0nfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LWJvbGQgdGV4dC1ncmF5LTk1MCBkYXJrOnRleHQtemluYy01MCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXJcIj5cbiAgICAgICAgICAgICAgICBFbGFib3JhemlvbmUgSlNPTlxuICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtYmx1ZS02MDAgZGFyazp0ZXh0LWJsdWUtNDAwIGZvbnQtbW9ubyBmb250LW1lZGl1bSBhbmltYXRlLXB1bHNlXCI+XG4gICAgICAgICAgICAgICAge3Byb2Nlc3NpbmdTdGFnZX1cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LWdyYXktNDAwIGRhcms6dGV4dC16aW5jLTUwMCBtdC0yXCI+XG4gICAgICAgICAgICAgICAgT3R0aW1penphemlvbmUgbWVtb3JpYSBpbiBjb3JzbyBwZXIgZXZpdGFyZSBpbCBsYWcgc3VsIHRlbGVmb25vLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogSGVhZGVyIEJhcnJhIGRpIE5hdmlnYXppb25lIFByaW5jaXBhbGUgKi99XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInN0aWNreSB0b3AtMCB6LTUwIGJhY2tkcm9wLWJsdXItbWQgYmctd2hpdGUvODAgZGFyazpiZy16aW5jLTk1MC84MCBib3JkZXItYiBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAvODAgcHgtNCBweS00XCIgaWQ9XCJhcHAtaGVhZGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctNnhsIG14LWF1dG8gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTggaC04IGJnLWJsdWUtNjAwIHJvdW5kZWQtbGcgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC13aGl0ZSBmb250LWJvbGQgdHJhbnNmb3JtIGhvdmVyOnJvdGF0ZS0zIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTMwMFwiPlxuICAgICAgICAgICAgICB7J3sgfSd9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtYm9sZCB0cmFja2luZy10aWdodCB0ZXh0LWdyYXktODAwIGRhcms6dGV4dC16aW5jLTUwXCI+XG4gICAgICAgICAgICAgICAgSlNPTiA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWJsdWUtNjAwXCI+Q2h1bmtlcjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIGZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTQwMCB0cmFja2luZy13aWRlc3QgYmxvY2sgLW10LTAuNVwiPlxuICAgICAgICAgICAgICAgIExhZy1mcmVlIE1vYmlsZSBzcGxpdHRpbmdcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICB7LyogU2NhcmljYSBBcHAgT2ZmbGluZSBCdXR0b24gKi99XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZURvd25sb2FkT2ZmbGluZUFwcH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBweC0zIHB5LTIgYmctYmx1ZS02MDAgaG92ZXI6YmctYmx1ZS03MDAgdGV4dC13aGl0ZSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ib2xkIHNoYWRvdy1zbSB0cmFuc2l0aW9uLWFsbCBhY3RpdmU6c2NhbGUtOTUgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICB0aXRsZT1cIlNjYXJpY2EgbCdpbnRlcmEgYXBwIGNvbWUgZmlsZSBIVE1MIGF1dG9ub21vIHBlciBsJ3VzbyBvZmZsaW5lXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAnNDRweCcgfX1cbiAgICAgICAgICAgICAgaWQ9XCJidG4tZG93bmxvYWQtb2ZmbGluZS1hcHBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RG93bmxvYWQgc2l6ZT17MTR9IGNsYXNzTmFtZT1cInN0cm9rZS1bMi41XVwiIC8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbiBzbTppbmxpbmVcIj5TY2FyaWNhIE9mZmxpbmUgKC5odG1sKTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic206aGlkZGVuXCI+U2NhcmljYSBBcHA8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgey8qIFNjYXJpY2EgQ29kaWNlIFNvcmdlbnRlIFpJUCBwZXIgR2l0SHViICovfVxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVEb3dubG9hZFNvdXJjZVppcH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBweC0zIHB5LTIgYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC03MDAgdGV4dC13aGl0ZSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ib2xkIHNoYWRvdy1zbSB0cmFuc2l0aW9uLWFsbCBhY3RpdmU6c2NhbGUtOTUgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICB0aXRsZT1cIlNjYXJpY2EgaWwgY29kaWNlIHNvcmdlbnRlIGNvbXBsZXRvIGluIGZvcm1hdG8gLlpJUCBwcm9udG8gcGVyIGVzc2VyZSBjYXJpY2F0byBzdSBHaXRIdWJcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6ICc0NHB4JyB9fVxuICAgICAgICAgICAgICBpZD1cImJ0bi1kb3dubG9hZC1zb3VyY2UtemlwXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEdpdGh1YiBzaXplPXsxNH0gY2xhc3NOYW1lPVwic3Ryb2tlLVsyLjVdXCIgLz5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuIHNtOmlubGluZSBmb250LWJvbGRcIj5TY2FyaWNhIHBlciBHaXRIdWIgKC56aXApPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzbTpoaWRkZW4gZm9udC1ib2xkXCI+WklQIEdpdEh1Yjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICB7LyogRGFyayBtb2RlIHN3aXRjaCAqL31cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNEYXJrTW9kZSghaXNEYXJrTW9kZSl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMiBob3ZlcjpiZy1ncmF5LTEwMCBkYXJrOmJnLXppbmMtOTAwIGRhcms6aG92ZXI6YmctemluYy04MDAgcm91bmRlZC1sZyB0ZXh0LWdyYXktNTAwIGRhcms6dGV4dC16aW5jLTMwMCB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgIHRpdGxlPXtpc0RhcmtNb2RlID8gJ1Bhc3NhIGFsbGEgbW9kYWxpdMOgIGNoaWFyYScgOiAnUGFzc2EgYWxsYSBtb2RhbGl0w6Agc2N1cmEnfVxuICAgICAgICAgICAgICBzdHlsZT17eyBtaW5XaWR0aDogJzQ0cHgnLCBtaW5IZWlnaHQ6ICc0NHB4JyB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXNEYXJrTW9kZSA/IDxTdW4gc2l6ZT17MTh9IC8+IDogPE1vb24gc2l6ZT17MTh9IC8+fVxuICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgIHtoYXNQcm9jZXNzZWQgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUmVzZXR9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtNCBweS0yIGJnLXdoaXRlIGRhcms6YmctemluYy05MDAgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0yMDAgYm9yZGVyIGJvcmRlci1ncmF5LTM1MCBkYXJrOmJvcmRlci16aW5jLTcwMCByb3VuZGVkLW1kIHRleHQtc20gZm9udC1tZWRpdW0gaG92ZXI6YmctZ3JheS01MCBkYXJrOmhvdmVyOmJnLXppbmMtODAwIHRyYW5zaXRpb24tY29sb3JzIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICBpZD1cImJ0bi11cGxvYWQtbmV3XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6ICc0NHB4JyB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgTnVvdm8gRmlsZVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIHsvKiBNYWluIENvbnRlbnQgQXJlYSAqL31cbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cImZsZXgtMSBmbGV4IGZsZXgtY29sIHAtNCBzbTpwLTYgbWF4LXctNnhsIHctZnVsbCBteC1hdXRvXCIgaWQ9XCJhcHAtbWFpbi1jb250ZW50XCI+XG4gICAgICAgIFxuICAgICAgICB7LyogU2NoZXJtYXRhIDE6IFNUQVRPIElOSVpJQUxFIC0gSW5wdXQgZSBDYXJpY2FtZW50byAqL31cbiAgICAgICAgeyFoYXNQcm9jZXNzZWQgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXIgcHktNiBtYXgtdy0yeGwgbXgtYXV0byB3LWZ1bGwgYW5pbWF0ZS1mYWRlLWluXCIgaWQ9XCJsYW5kaW5nLXNjcmVlblwiPlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB7LyogRGVzY3JpemlvbmUgZSBCYWRnZSBtb2JpbGUgb3B0aW1pemF0aW9uICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBtYi04IGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHB4LTMgcHktMSBiZy1ibHVlLTUwIGRhcms6YmctYmx1ZS05NTAvNDAgdGV4dC1ibHVlLTcwMCBkYXJrOnRleHQtYmx1ZS00MDAgdGV4dC14cyBmb250LXNlbWlib2xkIHJvdW5kZWQtZnVsbCBtYi00XCI+XG4gICAgICAgICAgICAgICAgPENwdSBzaXplPXsxMn0gY2xhc3NOYW1lPVwic3Ryb2tlLVsyLjVdXCIgLz5cbiAgICAgICAgICAgICAgICBPdHRpbWl6emF0byBwZXIgU21hcnRwaG9uZSAoWmVybyBMYWcpXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIHNtOnRleHQtM3hsIGZvbnQtZXh0cmFib2xkIHRyYWNraW5nLXRpZ2h0IHRleHQtZ3JheS04MDAgZGFyazp0ZXh0LXdoaXRlIG1iLTIgbGVhZGluZy10aWdodFwiPlxuICAgICAgICAgICAgICAgIEV2aXRhIGlsIExhZyBkZWwgVGVsZWZvbm9cbiAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwIGRhcms6dGV4dC16aW5jLTQwMCBtYXgtdy1tZFwiPlxuICAgICAgICAgICAgICAgIEluY29sbGEgbyBjYXJpY2EgdW4gZmlsZSBKU09OIHBlc2FudGUgKGVzLiAxMCBNQikuIExvIGRpdmlkZXJlbW8gYWxsJ2lzdGFudGUgaW4gYmxvY2NoaSBsZWdnZXJpIGRhIDQ1MCBLQiwgbW9udGFuZG8gdW4gcGV6em8gYWxsYSB2b2x0YSBwZXIgZGFydGkgZmx1aWRpdMOgIGFzc29sdXRhLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIENvbmZpZ3VyYXppb25lIFBhcmFtZXRyaSBEaXZpc29yZSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGJnLXdoaXRlIGRhcms6YmctemluYy05MDAgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci16aW5jLTgwMCByb3VuZGVkLTJ4bCBwLTQgc206cC01IHNoYWRvdy1zbSBtYi02IGZsZXggZmxleC1jb2wgZ2FwLTRcIiBpZD1cInNwbGl0LXBhcmFtZXRlcnNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IG1iLTFcIj5cbiAgICAgICAgICAgICAgICA8U2V0dGluZ3Mgc2l6ZT17MTZ9IGNsYXNzTmFtZT1cInRleHQtYmx1ZS02MDBcIiAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciB0ZXh0LWdyYXktNDAwXCI+SW1wb3N0YXppb25pIGRpIERpdmlzaW9uZTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIFNlbGV0dG9yZSBEaW1lbnNpb25lIGRlaSBQZXp6aSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIHNtOmdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0zMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgRGltZW5zaW9uZSBCbG9jY28gKFRhcmdldCk6XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy00IGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAge1tcbiAgICAgICAgICAgICAgICAgICAgICB7IHNpemU6IDEwMDAwMCwgbGFiZWw6ICcxMDAgS0InLCBkZXNjOiAnTGVnZ2VyaXNzaW1vJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIHsgc2l6ZTogMjUwMDAwLCBsYWJlbDogJzI1MCBLQicsIGRlc2M6ICdWZWxvY2UnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgeyBzaXplOiA0NTAwMDAsIGxhYmVsOiAnNDUwIEtCJywgZGVzYzogJ0NvbnNpZ2xpYXRvJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIHsgc2l6ZTogMTAwMDAwMCwgbGFiZWw6ICcxIE1CJywgZGVzYzogJ1Blc2FudGUnIH1cbiAgICAgICAgICAgICAgICAgICAgXS5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2l0ZW0uc2l6ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0VGFyZ2V0U2l6ZShpdGVtLnNpemUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHktMiBweC0xIHJvdW5kZWQteGwgdGV4dC14cyBmb250LWJvbGQgYm9yZGVyIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyICR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFNpemUgPT09IGl0ZW0uc2l6ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLWJsdWUtNjAwIHRleHQtd2hpdGUgYm9yZGVyLWJsdWUtNjAwIGRhcms6YmctYmx1ZS02MDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctemluYy01MCBkYXJrOmJnLXppbmMtODAwIHRleHQtemluYy03MDAgZGFyazp0ZXh0LXppbmMtMzAwIGJvcmRlci16aW5jLTIwMCBkYXJrOmJvcmRlci16aW5jLTcwMCBob3ZlcjpiZy16aW5jLTEwMCBkYXJrOmhvdmVyOmJnLXppbmMtNzAwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6ICc0NHB4JyB9fVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtpdGVtLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFN0cmF0ZWdpYSBkaSBEaXZpc2lvbmUgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0zMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgU2ludGFzc2kgJiBEaXZpc2lvbmU6XG4gICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zm9yY2VNb2RlfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEZvcmNlTW9kZShlLnRhcmdldC52YWx1ZSBhcyBTcGxpdE1vZGUpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctemluYy01MCBkYXJrOmJnLXppbmMtODAwIHRleHQtemluYy04MDAgZGFyazp0ZXh0LXppbmMtMjAwIGJvcmRlciBib3JkZXItemluYy0yMDAgZGFyazpib3JkZXItemluYy03MDAgcm91bmRlZC14bCBweC0zIHB5LTIgdGV4dC14cyBmb250LXNlbWlib2xkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1ibHVlLTUwMFwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1pbkhlaWdodDogJzQ0cHgnIH19XG4gICAgICAgICAgICAgICAgICAgIGlkPVwic2VsZWN0LXNwbGl0LW1vZGVcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYXV0b1wiPkF1dG8gKERpdmlkaSBpbiBBcnJheS9PZ2dldHRpIHZhbGlkaSk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImFycmF5X2l0ZW1zXCI+Rm9yemEgVGFnbGlvIGFkIEVsZW1lbnRpIEFycmF5PC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJvYmplY3Rfa2V5c1wiPkZvcnphIFRhZ2xpbyBhIENoaWF2aSBQcmltYXJpZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmF3X3RleHRcIj5UYWdsaWEgU29sbyBjb21lIFRlc3RvIFJpZ2hlIChTZW56YSBQYXJzZSk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogWm9uYSBEcm9wZmlsZSAvIFRleHRhcmVhICovfVxuICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgb25EcmFnRW50ZXI9e2hhbmRsZURyYWd9XG4gICAgICAgICAgICAgIG9uRHJhZ092ZXI9e2hhbmRsZURyYWd9XG4gICAgICAgICAgICAgIG9uRHJhZ0xlYXZlPXtoYW5kbGVEcmFnfVxuICAgICAgICAgICAgICBvbkRyb3A9e2hhbmRsZURyb3B9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBmbGV4IGZsZXgtY29sIGJnLXdoaXRlIGRhcms6YmctemluYy05MDAgYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCAke1xuICAgICAgICAgICAgICAgIGRyYWdBY3RpdmUgXG4gICAgICAgICAgICAgICAgICA/ICdib3JkZXItYmx1ZS01MDAgYmctYmx1ZS01MC8xMCBkYXJrOmJnLWJsdWUtOTUwLzEwIHNjYWxlLVsxLjAxXScgXG4gICAgICAgICAgICAgICAgICA6ICdib3JkZXItemluYy0yMDAgZGFyazpib3JkZXItemluYy04MDAgaG92ZXI6Ym9yZGVyLXppbmMtMzAwIGRhcms6aG92ZXI6Ym9yZGVyLXppbmMtNzAwJ1xuICAgICAgICAgICAgICB9IHJvdW5kZWQtMnhsIHAtNiB0cmFuc2l0aW9uLWFsbCByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW5gfVxuICAgICAgICAgICAgICBpZD1cInVwbG9hZC1kcm9wem9uZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB7LyogQm90dG9uZSBTZm9nbGlhIG5hdGl2byBtYXNjaGVyYXRvICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHB5LTQgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTIgaC0xMiByb3VuZGVkLXhsIGJnLWJsdWUtNTAgZGFyazpiZy16aW5jLTgwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LWJsdWUtNjAwIGRhcms6dGV4dC1ibHVlLTQwMCBtYi0zIHNoYWRvdy1pbm5lclwiPlxuICAgICAgICAgICAgICAgICAgPFVwbG9hZCBzaXplPXsyMn0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LXNlbWlib2xkIHRleHQtZ3JheS04MDAgZGFyazp0ZXh0LXppbmMtMTAwIG1iLTFcIj5cbiAgICAgICAgICAgICAgICAgIENhcmljYSB1biBmaWxlIEpTT04gcGVzYW50ZVxuICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwIG1iLTQgbWF4LXctc21cIj5cbiAgICAgICAgICAgICAgICAgIFRyYXNjaW5hbG8gZGlyZXR0YW1lbnRlIHF1aSwgb3BwdXJlIGNsaWNjYSBwZXIgc2ZvZ2xpYXJlIGkgdHVvaSBmaWxlIHN1bCB0ZWxlZm9uby5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGxhYmVsIFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctYmx1ZS02MDAgaG92ZXI6YmctYmx1ZS03MDAgYWN0aXZlOnNjYWxlLTk1IHRleHQtd2hpdGUgZm9udC1zZW1pYm9sZCB0ZXh0LXhzIHB4LTYgcHktMi41IHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXIgc2hhZG93LXNtIHRyYW5zaXRpb24tYWxsIGlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6ICc0NHB4JyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dCBcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIiBcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0PVwiLmpzb24sYXBwbGljYXRpb24vanNvbix0ZXh0L3BsYWluXCIgXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImhpZGRlblwiIFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlRmlsZVVwbG9hZH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHsgKGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID0gJyc7IH19XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+U2ZvZ2xpYSBGaWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBEaXZpc29yZSBWaXN1YWxlICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHctZnVsbCBteS0zXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLVsxcHhdIGJnLWdyYXktMjUwIGRhcms6YmctemluYy04MDAgZmxleC0xXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHVwcGVyY2FzZSB0ZXh0LWdyYXktNDAwXCI+b3BwdXJlIGluY29sbGEgdGVzdG88L3NwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLVsxcHhdIGJnLWdyYXktMjUwIGRhcms6YmctemluYy04MDAgZmxleC0xXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBUZXh0YXJlYSBQYXN0ZSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgZmxleCBmbGV4LWNvbFwiPlxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJJbmNvbGxhIHF1aSBpbCB0dW8gZW5vcm1lIGNvZGljZSBKU09OLi4uXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtpbnB1dFRleHR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlVGV4dGFyZWFDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgbWluLWgtWzE0MHB4XSBtYXgtaC1bMzAwcHhdIHAtMyB0ZXh0LXhzIGZvbnQtbW9ubyBiZy16aW5jLTEwMCBkYXJrOmJnLXppbmMtOTUwIGJvcmRlciBib3JkZXItemluYy0yMDAgZGFyazpib3JkZXItemluYy04MDAgcm91bmRlZC14bCBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctYmx1ZS01MDAgdGV4dC16aW5jLTgwMCBkYXJrOnRleHQtemluYy0yMDAgcGxhY2Vob2xkZXI6dGV4dC16aW5jLTYwMCBkYXJrOnBsYWNlaG9sZGVyOnRleHQtemluYy01MDAgbGVhZGluZy1ub3JtYWxcIlxuICAgICAgICAgICAgICAgICAgaWQ9XCJwYXN0ZS10ZXh0YXJlYVwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB7aW5wdXRUZXh0LnRyaW0oKSAmJiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVByb2Nlc3NUZXh0fVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNQZW5kaW5nfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtdC0zIHctZnVsbCBweS0zIGJnLWJsdWUtNjAwIGhvdmVyOmJnLWJsdWUtNzAwIGFjdGl2ZTpzY2FsZS05NSB0ZXh0LXdoaXRlIGZvbnQtc2VtaWJvbGQgdGV4dC14cyByb3VuZGVkLXhsIHNoYWRvdy1zbSB0cmFuc2l0aW9uLWFsbCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMS41XCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAnNDZweCcgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge2lzUGVuZGluZyA/IChcbiAgICAgICAgICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYW5pbWF0ZS1zcGluIHRleHQtc21cIj7ij7M8L3NwYW4+IEVsYWJvcmF6aW9uZSBpbiBjb3Jzby4uLlxuICAgICAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2hlY2sgc2l6ZT17MTR9IGNsYXNzTmFtZT1cInN0cm9rZS1bMi41XVwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5BbmFsaXp6YSBlZCBFbGFib3JhIE9yYTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBBcmVhIEVzZW1waW8gcmFwaWRvIHBlciBtb3N0cmFyZSBpbCB0b29sICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBtdC02XCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMCBtYi0yXCI+Tm9uIGhhaSB1biBKU09OIGEgcG9ydGF0YSBkaSBtYW5vPzwvc3Bhbj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUdlbmVyYXRlU2FtcGxlfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdGV4dC14cyB0ZXh0LWJsdWUtNjAwIGRhcms6dGV4dC1ibHVlLTQwMCBob3Zlcjp1bmRlcmxpbmUgZm9udC1zZW1pYm9sZCBsZWFkaW5nLXJlbGF4ZWQgYWN0aXZlOm9wYWNpdHktODAgcC0yXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBtaW5IZWlnaHQ6ICc0NHB4JyB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFNwYXJrbGVzIHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgICAgIDxzcGFuPkdlbmVyYSBlZCBBbmFsaXp6YSB1biBmaWxlIGRpIHRlc3QgZGEgNSBNQiDimqE8L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICBcbiAgICAgICAgICAvKiBTY2hlcm1hdGEgMjogQVRUSVZBIC0gRXNwbG9yYXppb25lIGUgVmlzdWFsaXp6YXppb25lIGRlaSBQZXp6aSAqL1xuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGZsZXggZmxleC1jb2wgbWQ6ZmxleC1yb3cgZ2FwLTUgaXRlbXMtc3RyZXRjaCBoLWZ1bGwgb3ZlcmZsb3ctaGlkZGVuXCIgaWQ9XCJkYXNoYm9hcmQtc2NyZWVuXCI+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHsvKiBCYXJyYSBTaW5pc3RyYSAoRGVza3RvcCkgLyBTZWxldHRvcmUgTW9iaWxlOiBFbGVuY28gZGVpIEJsb2NjaGkgKENodW5rcykgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBtZDp3LVsyNjBweF0gc2hyaW5rLTAgZmxleCBmbGV4LWNvbCBnYXAtM1wiIGlkPVwibmF2aWdhdGlvbi1zaWRlYmFyXCI+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB7LyogQ2FyZCBNZXRhIEluZm9ybWF6aW9uaSBkZWwgZmlsZSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgcm91bmRlZC0yeGwgcC00IGZsZXggZmxleC1jb2wgZ2FwLTIgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtZ3JheS00MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+RmlsZSBDYXJpY2F0bzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgIDxGaWxlVGV4dCBjbGFzc05hbWU9XCJ0ZXh0LWJsdWUtNjAwIG10LTEgc2hyaW5rLTBcIiBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtaW4tdy0wIGZsZXgtMVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtYm9sZCB0ZXh0LWdyYXktODAwIGRhcms6dGV4dC16aW5jLTEwMCB0cnVuY2F0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtmaWxlTmFtZSB8fCAnZG9jdW1lbnRvLmpzb24nfVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMCBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgICAgICBUb3RhbGU6IHtmb3JtYXRCeXRlcyh0b3RhbElucHV0U2l6ZUJ5dGVzKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtWzFweF0gYmctZ3JheS0xNTAgZGFyazpiZy16aW5jLTgwMCBteS0xXCI+PC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogQmFkZ2VzIGxpa2UgdGhlIGRlc2lnbiBtb2NrdXAgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC0yIG10LTFcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPkRpbWVuc2lvbmUgVG90YWxlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJweC0yIHB5LTAuNSBiZy1ibHVlLTUwIGRhcms6YmctYmx1ZS05NTAgdGV4dC1ibHVlLTcwMCBkYXJrOnRleHQtYmx1ZS00MDAgdGV4dC14cyBmb250LWJvbGQgcm91bmRlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgIHtmb3JtYXRCeXRlcyh0b3RhbElucHV0U2l6ZUJ5dGVzKX1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5MaW1pdGUgQmxvY2NvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJweC0yIHB5LTAuNSBiZy1ncmVlbi01MCBkYXJrOmJnLWdyZWVuLTk1MCB0ZXh0LWdyZWVuLTcwMCBkYXJrOnRleHQtZ3JlZW4tNDAwIHRleHQteHMgZm9udC1ib2xkIHJvdW5kZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0Qnl0ZXModGFyZ2V0U2l6ZSl9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+UGFydGkgVG90YWxpPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJweC0yIHB5LTAuNSBiZy1wdXJwbGUtNTAgZGFyazpiZy1wdXJwbGUtOTUwIHRleHQtcHVycGxlLTcwMCBkYXJrOnRleHQtcHVycGxlLTQwMCB0ZXh0LXhzIGZvbnQtYm9sZCByb3VuZGVkXCI+XG4gICAgICAgICAgICAgICAgICAgICAge2NodW5rcy5sZW5ndGh9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAge3Byb2Nlc3NpbmdFcnJvciAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgdGV4dC1bMTBweF0gYmctYW1iZXItNTAwLzEwIHRleHQtYW1iZXItNTAwIHAtMiByb3VuZGVkLWxnIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICB7cHJvY2Vzc2luZ0Vycm9yfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIFNlbGV0dG9yZSByYXBpZG8gRHJvcGRvd24gcGVyIE1vYmlsZSAodmlzaWJpbGUgc29sbyBzdSBTbWFydHBob25lKSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJibG9jayBtZDpoaWRkZW4gZmxleCBmbGV4LWNvbCBnYXAtMVwiIGlkPVwibW9iaWxlLWNodW5rLXBpY2tlclwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXppbmMtNDAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgcHgtMVwiPlxuICAgICAgICAgICAgICAgICAgVmFpIGFsIEJsb2NjbzpcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXthY3RpdmVDaHVua0luZGV4fVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRBY3RpdmVDaHVua0luZGV4KE51bWJlcihlLnRhcmdldC52YWx1ZSkpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJnLXdoaXRlIGRhcms6YmctemluYy05MDAgdGV4dC16aW5jLTgwMCBkYXJrOnRleHQtemluYy0xMDAgYm9yZGVyIGJvcmRlci16aW5jLTIwMCBkYXJrOmJvcmRlci16aW5jLTgwMCByb3VuZGVkLXhsIHB4LTMgcHktMi41IHRleHQteHMgZm9udC1ib2xkIHNoYWRvdy1zbSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6cmluZy0xIGZvY3VzOnJpbmctemluYy00MDBcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiAnNDhweCcgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7Y2h1bmtzLm1hcCgoaXRlbSwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24ga2V5PXtpZHh9IHZhbHVlPXtpZHh9PlxuICAgICAgICAgICAgICAgICAgICAgICN7aWR4ICsgMX06IHtpdGVtLmxhYmVsfSAoe2Zvcm1hdEJ5dGVzKGl0ZW0uc2l6ZUJ5dGVzKX0pXG4gICAgICAgICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBTaWRlYmFyIEVsZW5jbyBCbG9jY2hpIHBlciBEZXNrdG9wIChuYXNjb3N0byBzdSBjZWxsdWxhcmUgcGVyIGV2aXRhcmUgaW5nb21icm8pICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhpZGRlbiBtZDpmbGV4IGZsZXgtY29sIGZsZXgtMSBiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgcm91bmRlZC0yeGwgb3ZlcmZsb3ctaGlkZGVuIHAtMyBzaGFkb3ctc20gaC1bNDAwcHhdXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LWdyYXktNDAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0yIHB4LTFcIj5cbiAgICAgICAgICAgICAgICAgIEVsZW5jbyBCbG9jY2hpXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgb3ZlcmZsb3cteS1hdXRvIHByLTEgZmxleCBmbGV4LWNvbCBnYXAtMS41IFwiIGlkPVwiZGVza3RvcC1jaHVua3MtbGlzdFwiPlxuICAgICAgICAgICAgICAgICAge2NodW5rcy5tYXAoKGl0ZW0sIGlkeCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGFjdGl2ZUNodW5rSW5kZXggPT09IGlkeDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2lkeH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZUNodW5rSW5kZXgoaWR4KX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtbGVmdCBwLTIuNSByb3VuZGVkLXhsIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyICR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAnYmctYmx1ZS02MDAgdGV4dC13aGl0ZSBmb250LWJvbGQgYm9yZGVyLWwtNCBib3JkZXItYmx1ZS04MDAnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnYmctWyNGOUZBRkJdIGhvdmVyOmJnLWdyYXktMTAwIGRhcms6YmctemluYy04MDAgZGFyazpob3ZlcjpiZy16aW5jLTg1MC84MCB0ZXh0LXppbmMtNzAwIGRhcms6dGV4dC16aW5jLTMwMCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidHJ1bmNhdGUgbWF4LXctWzE0MHB4XVwiPntpdGVtLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gb3BhY2l0eS03NSBmb250LW1vbm9cIj57Zm9ybWF0Qnl0ZXMoaXRlbS5zaXplQnl0ZXMpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIFNlemlvbmUgRGVzdHJhOiBJbCBCbG9jY28gQXR0aXZvIGVkIGlsIG5hdmlnYXRvcmUgaW5mZXJpb3JlICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZmxleCBmbGV4LWNvbCBnYXAtNCBtaW4tdy0wXCIgaWQ9XCJ2aWV3ZXItc3RhZ2VcIj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHsvKiBVbm1vdW50IHRlbXBvcmFuZW8gZGVsbG8gc3RhdG8gcHJlY2VkZW50ZSBwZXIgYXp6ZXJhcmUgaWwgbGFnIGJyb3dzZXIgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIG1pbi1oLVs0MDBweF1cIj5cbiAgICAgICAgICAgICAgICB7YWN0aXZlQ2h1bmsgPyAoXG4gICAgICAgICAgICAgICAgICA8SlNPTlZpZXdlciBjaHVuaz17YWN0aXZlQ2h1bmt9IC8+XG4gICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC04IGJnLXppbmMtMTAwIGRhcms6YmctemluYy05MDAgdGV4dC16aW5jLTQwMCByb3VuZGVkLTJ4bCB0ZXh0LXNtIGl0YWxpY1wiPlxuICAgICAgICAgICAgICAgICAgICBOZXNzdW4gYmxvY2NvIGF0dGl2by5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBDb250cm9sbGVyIGRpIE5hdmlnYXppb25lIE1vYmlsZS1GaXJzdCBpbiBmb25kbyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgcm91bmRlZC0yeGwgcC0zIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtMiBzaGFkb3ctc21cIiBpZD1cImNodW5rLW5hdmlnYXRpb24tYmFyXCI+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgey8qIEJvdHRvbmUgUHJlY2VkZW50ZSAqL31cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVQcmV2Q2h1bmt9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17YWN0aXZlQ2h1bmtJbmRleCA9PT0gMH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgcHgtNiBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1IGR1cmF0aW9uLTEwMCBjdXJzb3ItcG9pbnRlciAke1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmVDaHVua0luZGV4ID09PSAwXG4gICAgICAgICAgICAgICAgICAgICAgPyAndGV4dC1ncmF5LTQwMCBiZy1ncmF5LTEwMCBkYXJrOnRleHQtemluYy02MDAgZGFyazpiZy16aW5jLTgwMCBjdXJzb3Itbm90LWFsbG93ZWQnXG4gICAgICAgICAgICAgICAgICAgICAgOiAnYmctd2hpdGUgZGFyazpiZy16aW5jLTgwMCB0ZXh0LWdyYXktNzAwIGRhcms6dGV4dC16aW5jLTEwMCBib3JkZXIgYm9yZGVyLWdyYXktMzAwIGRhcms6Ym9yZGVyLXppbmMtNzAwIGhvdmVyOmJnLWdyYXktNTAnXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1pbldpZHRoOiAnMTAwcHgnLCBtaW5IZWlnaHQ6ICc0OHB4JyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxDaGV2cm9uTGVmdCBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPlBSRVZJT1VTIFBBUlQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICB7LyogU3RhdHVzIGNlbnRyYWxpenphdG8gKi99XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHB5LTIgYmctZ3JheS01MCBkYXJrOmJnLXppbmMtODAwIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci16aW5jLTc1MFwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0zMDAgdHJhY2tpbmctd2lkZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgUEFSVCB7YWN0aXZlQ2h1bmtJbmRleCArIDF9IE9GIHtjaHVua3MubGVuZ3RofVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIEJvdHRvbmUgU3VjY2Vzc2l2byAqL31cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVOZXh0Q2h1bmt9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17YWN0aXZlQ2h1bmtJbmRleCA9PT0gY2h1bmtzLmxlbmd0aCAtIDF9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHB4LTYgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ib2xkIHRyYW5zaXRpb24tYWxsIGFjdGl2ZTpzY2FsZS05NSBkdXJhdGlvbi0xMDAgY3Vyc29yLXBvaW50ZXIgJHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2h1bmtJbmRleCA9PT0gY2h1bmtzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICAgICAgICA/ICd0ZXh0LWdyYXktNDAwIGJnLWdyYXktMTAwIGRhcms6dGV4dC16aW5jLTYwMCBkYXJrOmJnLXppbmMtODAwIGN1cnNvci1ub3QtYWxsb3dlZCdcbiAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1ibHVlLTYwMCBob3ZlcjpiZy1ibHVlLTcwMCB0ZXh0LXdoaXRlIHNoYWRvdy1tZCdcbiAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgbWluV2lkdGg6ICcxMDBweCcsIG1pbkhlaWdodDogJzQ4cHgnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+TkVYVCBQQVJUPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPENoZXZyb25SaWdodCBzaXplPXsxNn0gLz5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgIDwvbWFpbj5cblxuICAgICAgey8qIEZvb3RlciBtaW5pbWFsaXN0YSBwZXIgZXZpdGFyZSBjbHV0dGVycyBvIGxhcnBpbmcgdGVjbmljbyAqL31cbiAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwicHktNCB0ZXh0LWNlbnRlciB0ZXh0LXppbmMtNDAwIGRhcms6dGV4dC16aW5jLTYwMCB0ZXh0LXhzIGJvcmRlci10IGJvcmRlci16aW5jLTIwMC81MCBkYXJrOmJvcmRlci16aW5jLTkwMC81MCBtdC1hdXRvXCIgaWQ9XCJhcHAtZm9vdGVyXCI+XG4gICAgICAgIFZpc3VhbGl6emF0b3JlIFNwbGl0IEpTT04g4oCiIE5lc3N1biBkYXRvIGludmlhdG8gYWwgc2VydmVyLCBsYXZvcmEgaW4gbG9jYWxlLlxuICAgICAgPC9mb290ZXI+XG5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJtYXBwaW5ncyI6IkFBaVhjLFNBMk9RLFVBM09SO0FBalhkLE9BQU8sU0FBUyxVQUFVLHFCQUE4QjtBQUV4RCxTQUFTLGtCQUFrQixtQkFBbUI7QUFDOUMsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyw2QkFBNkI7QUFDdEM7QUFBQSxFQUVFO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFHQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBRUE7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxPQUNLO0FBRVAsd0JBQXdCLE1BQU07QUFDNUIsUUFBTSxDQUFDLFdBQVcsWUFBWSxJQUFJLFNBQVMsRUFBRTtBQUM3QyxRQUFNLENBQUMsWUFBWSxhQUFhLElBQUksU0FBaUIsSUFBTTtBQUMzRCxRQUFNLENBQUMsV0FBVyxZQUFZLElBQUksU0FBb0IsTUFBTTtBQUM1RCxRQUFNLENBQUMsUUFBUSxTQUFTLElBQUksU0FBc0IsQ0FBQyxDQUFDO0FBQ3BELFFBQU0sQ0FBQyxrQkFBa0IsbUJBQW1CLElBQUksU0FBaUIsQ0FBQztBQUNsRSxRQUFNLENBQUMsVUFBVSxXQUFXLElBQUksU0FBaUIsRUFBRTtBQUNuRCxRQUFNLENBQUMsY0FBYyxlQUFlLElBQUksU0FBUyxLQUFLO0FBQ3RELFFBQU0sQ0FBQyxVQUFVLFdBQVcsSUFBSSxTQUFvQixVQUFVO0FBQzlELFFBQU0sQ0FBQyxpQkFBaUIsa0JBQWtCLElBQUksU0FBNkIsTUFBUztBQUNwRixRQUFNLENBQUMsV0FBVyxlQUFlLElBQUksY0FBYztBQUNuRCxRQUFNLENBQUMsWUFBWSxhQUFhLElBQUksU0FBa0IsSUFBSTtBQUMxRCxRQUFNLENBQUMsY0FBYyxlQUFlLElBQUksU0FBUyxLQUFLO0FBQ3RELFFBQU0sQ0FBQyxpQkFBaUIsa0JBQWtC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