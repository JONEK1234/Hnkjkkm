export function generateOfflineHtml(isDarkModeDefault = true) {
  return `<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JSON Chunker - Offline Reader</title>
    
    <!-- Robust Tailwind CSS CDN with file:// sandboxing compatibility -->
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
              mono: ['"JetBrains Mono"', 'Fira Code', 'monospace']
            }
          }
        }
      }
    <\/script>
    
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 0;
      }
      
      .font-mono {
        font-family: 'JetBrains Mono', monospace !important;
      }

      .scrollbar-hide::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .scrollbar-hide::-webkit-scrollbar-track {
        background: #1e293b;
      }
      .scrollbar-hide::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 4px;
      }
    </style>
  </head>
  <body class="transition-colors duration-200">
    
    <!-- Master layout with default theme injection -->
    <div id="main-app-root" class="${isDarkModeDefault ? "dark bg-zinc-950 text-zinc-100" : "bg-[#F9FAFB] text-zinc-900"} min-h-screen font-sans transition-colors duration-200 flex flex-col">
      
      <!-- LOADING OVERLAY -->
      <div id="loading-overlay" class="fixed inset-0 z-[100] backdrop-blur-md bg-zinc-950/75 hidden flex-col items-center justify-center p-6 transition-all duration-200">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center gap-4">
          <div class="relative flex items-center justify-center">
            <div class="absolute w-16 h-16 rounded-full border-4 border-blue-500/20 animate-ping"></div>
            <div class="w-16 h-16 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-blue-600/10 border-l-transparent animate-spin"></div>
            <div class="absolute text-blue-600 font-mono text-xs font-bold">{ }</div>
          </div>
          <div class="flex flex-col gap-1.5">
            <h3 class="text-sm font-bold text-gray-900 dark:text-zinc-50 uppercase tracking-wider">Elaborazione JSON</h3>
            <p id="loading-stage-text" class="text-xs text-blue-600 dark:text-blue-400 font-mono font-medium animate-pulse">Inizializzazione...</p>
            <p class="text-[10px] text-gray-400 dark:text-zinc-500 mt-2">Ottimizzazione memoria in corso per evitare il lag sul telefono.</p>
          </div>
        </div>
      </div>

      <!-- HEADER -->
      <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-gray-200 dark:border-zinc-800/80 px-4 py-4" id="app-header">
        <div class="max-w-6xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold select-none transition-transform duration-300 hover:rotate-3">
              { }
            </div>
            <div>
              <h1 class="text-lg font-bold tracking-tight text-gray-800 dark:text-zinc-50">
                JSON <span class="text-blue-600">Chunker</span> <span class="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 py-0.5 px-2 rounded-md font-mono font-normal">Offline</span>
              </h1>
              <span class="text-[10px] uppercase font-semibold text-gray-400 tracking-widest block -mt-0.5">
                Lag-free Mobile Splitting
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Theme Switcher -->
            <button
              id="theme-toggle-btn"
              onclick="toggleDarkMode()"
              class="p-2 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-300 transition-all cursor-pointer"
              title="${isDarkModeDefault ? "Passa alla modalità chiara" : "Passa alla modalità scura"}"
              style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;"
            >
              <!-- Populated dynamically by JS -->
            </button>

            <!-- Reset File (New) Button -->
            <button
              id="header-reset-btn"
              onclick="handleReset()"
              class="hidden px-4 py-2 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 border border-gray-300 dark:border-zinc-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              style="min-height: 44px;"
            >
              Nuovo File
            </button>
          </div>
        </div>
      </header>

      <!-- MAIN CONTAINER -->
      <main class="flex-1 flex flex-col p-4 sm:p-6 max-w-6xl w-full mx-auto justify-center" id="app-main-content">
        
        <!-- SCHERMATA 1: CARICAMENTO (INPUT SCREEN) -->
        <div id="screen-input" class="flex-1 flex flex-col justify-center items-center py-6 max-w-2xl mx-auto w-full animate-fade-in">
          
          <div class="text-center mb-8 flex flex-col items-center">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full mb-4">
              <span id="badge-cpu-container"></span>
              <span>Ottimizzato per Smartphone (Zero Lag)</span>
            </span>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800 dark:text-white mb-2 leading-tight">
              Evita il Lag del Telefono
            </h2>
            <p class="text-sm text-gray-500 dark:text-zinc-400 max-w-md text-center">
              Incolla o carica un file JSON pesante (es. 10 MB). Lo divideremo all'istante in blocchi leggeri da 450 KB, montando un pezzo alla volta per darti fluidità assoluta.
            </p>
          </div>

          <!-- IMPOSTAZIONI DIVISIONE -->
          <div class="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col gap-4 mt-2" id="split-parameters">
            <div class="flex items-center gap-1.5 mb-1">
              <span id="badge-settings-container"></span>
              <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Impostazioni di Divisione</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Target Size -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700 dark:text-zinc-300">Dimensione Blocco (Target):</label>
                <div class="grid grid-cols-4 gap-1.5" id="size-options-container">
                  <button type="button" onclick="setTargetSizeValue(100000)" id="size-btn-100000" class="py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700" style="min-height: 44px;">100 KB</button>
                  <button type="button" onclick="setTargetSizeValue(250000)" id="size-btn-250000" class="py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700" style="min-height: 44px;">250 KB</button>
                  <button type="button" onclick="setTargetSizeValue(450000)" id="size-btn-450000" class="py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-blue-600 text-white border-blue-600" style="min-height: 44px;">450 KB</button>
                  <button type="button" onclick="setTargetSizeValue(1000000)" id="size-btn-1000000" class="py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700" style="min-height: 44px;">1 MB</button>
                </div>
              </div>

              <!-- Split Mode -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-700 dark:text-zinc-300">Sintassi & Divisione:</label>
                <select
                  id="split-mode-select"
                  onchange="handleModeChange(this)"
                  class="w-full bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style="min-height: 44px;"
                >
                  <option value="auto" selected>Auto (Dividi in Array/Oggetti validi)</option>
                  <option value="array_items">Forza Taglio ad Elementi Array</option>
                  <option value="object_keys">Forza Taglio a Chiavi Primarie</option>
                  <option value="raw_text">Taglia Solo come Testo Righe (Senza Parse)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- DROPZONE -->
          <div 
            id="dropzone"
            ondragenter="handleDragEnter(event)"
            ondragover="handleDragOver(event)"
            ondragleave="handleDragLeave(event)"
            ondrop="handleDropFile(event)"
            class="w-full flex flex-col bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-6 transition-all relative overflow-hidden"
          >
            <div class="flex flex-col items-center py-4 text-center">
              <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-zinc-800 flex items-center justify-center mb-3 shadow-inner" id="dropzone-icon-container">
                <!-- Populated dynamically with Upload SVG -->
              </div>
              <h3 class="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-1">Carica un file JSON pesante</h3>
              <p class="text-xs text-gray-400 mb-4 max-w-sm">Trascinalo qui, oppure clicca per sfogliare i tuoi file direttamente sul tuo smartphone.</p>
              
              <label 
                class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-lg cursor-pointer shadow-sm transition-all inline-flex items-center justify-center"
                style="min-height: 44px;"
              >
                <input 
                  type="file" 
                  accept=".json,application/json,text/plain" 
                  class="hidden" 
                  onchange="handleFileUpload(this)"
                  onclick="this.value=null"
                />
                <span>Sfoglia File</span>
              </label>
            </div>

            <div class="flex items-center gap-3 w-full my-3">
              <div class="h-[1px] bg-gray-205 dark:bg-zinc-800 flex-1"></div>
              <span class="text-[10px] font-mono uppercase text-gray-400 select-none">oppure incolla testo</span>
              <div class="h-[1px] bg-gray-205 dark:bg-zinc-800 flex-1"></div>
            </div>

            <div class="w-full flex flex-col">
              <button
                id="clipboard-paste-btn"
                onclick="pasteFromClipboard()"
                type="button"
                class="w-full mb-3 py-2.5 bg-blue-50/70 dark:bg-zinc-850 hover:bg-blue-100/70 dark:hover:bg-zinc-800 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-zinc-700 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                style="min-height: 42px;"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="stroke-[2.5]" id="svg-inline-clip-icon"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
                <span>Ora puoi anche: Incolla dagli Appunti 📋</span>
              </button>

              <textarea
                id="paste-textarea"
                placeholder="Incolla qui il tuo enorme codice JSON..."
                oninput="toggleProcessButton()"
                class="w-full min-h-[140px] max-h-[300px] p-3 text-xs font-mono bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-650 leading-normal"
              ></textarea>
              
              <button
                id="process-btn"
                onclick="handleProcessText()"
                class="hidden mt-3 w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                style="min-height: 46px;"
              >
                <span id="btn-process-icon"></span>
                <span>Analizza ed Elabora Ora</span>
              </button>
            </div>
          </div>

          <!-- GENERATE SAMPLE -->
          <div class="flex flex-col items-center mt-6">
            <span class="text-xs text-gray-400 mb-2 select-none">Non hai un JSON a portata di mano?</span>
            <button
              type="button"
              onclick="handleGenerateSample()"
              class="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold leading-relaxed active:opacity-80 p-2 cursor-pointer"
              style="min-height: 44px;"
            >
              <span id="sparkles-icon-container"></span>
              <span>Genera ed Analizza un file di test da 5 MB ⚡</span>
            </button>
          </div>

        </div>

        <!-- SCHERMATA 2: ESPLORATORE DEI PEZZI (DASHBOARD SCREEN) -->
        <div id="screen-dashboard" class="hidden flex-1 flex flex-col md:flex-row gap-5 items-stretch h-full overflow-hidden">
          
          <!-- SIDEBAR -->
          <div class="w-full md:w-[260px] shrink-0 flex flex-col gap-3" id="navigation-sidebar">
            
            <!-- File Info Card -->
            <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono select-none">File Caricato</span>
              
              <div class="flex items-start gap-2">
                <span id="sidebar-filetext-icon"></span>
                <div class="flex flex-col min-w-0 flex-1">
                  <span id="info-file-name" class="text-sm font-bold text-gray-800 dark:text-zinc-100 truncate">documento.json</span>
                  <span id="info-total-size-side" class="text-xs text-gray-400 font-mono">Totale: 0 B</span>
                </div>
              </div>

              <div class="h-[1px] bg-gray-150 dark:bg-zinc-800 my-1"></div>

              <div class="flex flex-col gap-2 mt-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Dimensione Totale</span>
                  <span id="info-total-size" class="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-bold rounded">0 MB</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Limite Blocco</span>
                  <span id="info-target-limit" class="px-2 py-0.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-bold rounded">450 KB</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Parti Totali</span>
                  <span id="info-total-chunks" class="px-2 py-0.5 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 text-xs font-bold rounded">0</span>
                </div>
              </div>

              <div id="info-error-box" class="hidden mt-2 text-[10px] bg-amber-500/10 text-amber-500 p-2 rounded-lg leading-relaxed"></div>
            </div>

            <!-- Mobile Chunk Picker Dropdown (visible only on mobile) -->
            <div class="block md:hidden flex flex-col gap-1" id="mobile-chunk-picker">
              <label class="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Vai al Blocco:</label>
              <select
                id="mobile-chunk-select"
                onchange="selectChunk(Number(this.value))"
                class="w-full bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-400"
                style="min-height: 48px;"
              ></select>
            </div>

            <!-- Desktop Sidebar List -->
            <div class="hidden md:flex flex-col flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden p-3 shadow-sm h-[400px]">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Elenco Blocchi</div>
              <div id="desktop-chunks-list" class="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-hide">
                <!-- Chunks injected dynamically -->
              </div>
            </div>

          </div>

          <!-- ACTIVE BLOC VIEWPORT -->
          <div class="flex-1 flex flex-col gap-4 min-w-0" id="viewer-stage">
            
            <!-- Codebox Card -->
            <div class="flex flex-col flex-1 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden h-full">
              
              <!-- Viewer Header -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 gap-3 border-b border-gray-250 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50" id="json-viewer-header">
                <div class="flex items-center gap-2.5">
                  <div class="flex-col">
                    <div class="flex items-center gap-2">
                       <span class="text-xs font-mono text-gray-500 font-semibold uppercase tracking-wider">VIEWING PART:</span>
                      <span id="viewing-part-badge" class="text-xs font-mono font-semibold text-white bg-blue-600 px-2.5 py-0.5 rounded shadow-sm">01</span>
                    </div>
                    <span id="viewing-part-meta" class="text-[10px] text-gray-400 font-mono mt-0.5 block">Size: 0 KB</span>
                  </div>
                </div>

                <!-- Icons & Traffic dots and Buttons -->
                <div class="flex items-center justify-between sm:justify-end gap-3 sm:self-auto self-stretch">
                  <div class="flex space-x-1 hover:opacity-80 transition-all duration-300">
                    <div class="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80"></div>
                    <div class="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80"></div>
                  </div>

                  <div class="h-4 w-[1px] bg-gray-350 dark:bg-zinc-800 hidden sm:block"></div>

                  <div class="flex items-center gap-1.5">
                    <!-- Toggle colors -->
                    <button
                      onclick="toggleHighlightSyntax()"
                      id="opt-toggle-colors"
                      class="p-2 border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-850 rounded-lg text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                      style="min-width: 38px; min-height: 38px;"
                    >
                      <!-- Populated dynamically -->
                    </button>

                    <!-- Copy chunk content -->
                    <button
                      onclick="copyActiveChunk()"
                      id="btn-copy-chunk"
                      class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border rounded-lg bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 border-gray-250 dark:border-zinc-700 hover:bg-gray-50 transition-all active:scale-95 shadow-xs cursor-pointer"
                      style="min-height: 38px;"
                    >
                      <span id="copy-icon-placeholder"></span>
                      <span id="copy-btn-text">Copy</span>
                    </button>

                    <!-- Save chunk content -->
                    <button
                      onclick="downloadActiveChunk()"
                      id="btn-save-chunk"
                      class="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 cursor-pointer active:scale-95 shadow-sm border border-transparent transition-all"
                      style="min-height: 38px;"
                    >
                      <span id="save-icon-placeholder"></span>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Warning for large highlighter files -->
              <div id="highlight-warning" class="hidden flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 p-2.5 text-xs border-b border-amber-100 dark:border-amber-950/40">
                <span id="warn-alert-icon-container"></span>
                <span>Questo blocco è enorme. Evidenziatore spento per tutelare la fluidità sul telefono.</span>
              </div>

              <!-- Inline Search Bar inside Code Panel -->
              <div class="px-4 py-2 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2" id="search-bar-container">
                <div class="relative flex-1 min-w-[150px]">
                  <span id="search-icon-placeholder"></span>
                  <input
                    type="text"
                    id="chunk-search-input"
                    placeholder="Cerca in questo blocco..."
                    oninput="handleSearchSearch()"
                    class="w-full pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-250 dark:border-zinc-700 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-neutral-150"
                    style="min-height: 36px;"
                  />
                </div>
                
                <div id="search-results-controls" class="hidden flex items-center gap-2">
                  <span id="search-counter" class="text-xs text-gray-500 dark:text-zinc-400 font-mono">0 of 0</span>
                  <div class="flex gap-1" id="search-nav-buttons">
                    <button onclick="navigateSearch(-1)" class="p-1 px-2.5 border border-gray-200 dark:border-zinc-755 rounded-lg text-xs hover:bg-gray-105 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200" style="min-height: 34px;">←</button>
                    <button onclick="navigateSearch(1)" class="p-1 px-2.5 border border-gray-200 dark:border-zinc-755 rounded-lg text-xs hover:bg-gray-105 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200" style="min-height: 34px;">→</button>
                  </div>
                </div>
              </div>

              <!-- Code pre Area styled inside Slate background -->
              <div id="code-viewport" class="flex-1 overflow-hidden relative bg-[#1E293B] border border-gray-850 dark:border-gray-800 rounded-b-2xl">
                <pre
                  id="raw-code-block"
                  class="w-full h-[60vh] max-h-[80vh] overflow-auto p-5 text-[12px] leading-relaxed font-mono whitespace-pre text-blue-300 select-text outline-none scrollbar-hide"
                ></pre>
              </div>

            </div>

            <!-- Lower navigation buttons -->
            <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-sm" id="chunk-navigation-bar">
              <button
                id="nav-btn-prev"
                onclick="handlePrevChunk()"
                class="flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer border border-gray-350 dark:border-zinc-700 text-gray-750 bg-white dark:bg-zinc-800 hover:bg-gray-50 text-gray-700 dark:text-zinc-100"
                style="min-width: 100px; min-height: 48px;"
              >
                <span id="nav-prev-icon"></span>
                <span>PREVIOUS PART</span>
              </button>

              <div class="px-4 py-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-750">
                <span id="nav-btn-status-badge" class="text-xs font-bold text-gray-700 dark:text-zinc-300 tracking-wider font-mono">PART 1 OF 1</span>
              </div>

              <button
                id="nav-btn-next"
                onclick="handleNextChunk()"
                class="flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer bg-blue-600 text-white hover:bg-blue-750 shadow-md"
                style="min-width: 100px; min-height: 48px;"
              >
                <span>NEXT PART</span>
                <span id="nav-next-icon"></span>
              </button>
            </div>

          </div>

        </div>

      </main>

      <!-- FOOTER -->
      <footer class="py-4 text-center text-zinc-400 dark:text-zinc-650 text-xs border-t border-zinc-200/50 dark:border-zinc-900/50 mt-auto" id="app-footer">
        Visualizzatore Split JSON • Nessun dato inviato al server, lavora in locale.
      </footer>
    </div>

    <!-- MAIN ENGINE CORE IN VANILLA JAVASCRIPT FOR INSTANT LOADING -->
    <script>
      // SVGs Constants matching Lucide perfectly
      const SUN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
      const MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
      const EYE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>';
      const EYEOFF_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';
      const COPY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      const CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="stroke-[3]"><polyline points="20 6 9 17 4 12"/></svg>';
      const DOWNLOAD_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>';
      const SEARCH_SVG = '<svg xmlns="http://www.w3.org/25" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';
      const CHEVRON_LEFT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
      const CHEVRON_RIGHT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      const FILETEXT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 mt-1 shrink-0"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>';
      const CPU_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="inline stroke-[2.5] mr-1.5"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="16" y="2" width="6" height="6" rx="1"/><rect x="2" y="2" width="6" height="6" rx="1"/><path d="M9 1v8"/><path d="M15 1v8"/><path d="M9 15v8"/><path d="M15 15v8"/><path d="M1 9h8"/><path d="M1 15h8"/><path d="M15 9h9"/><path d="M15 15h9"/></svg>';
      const SETTINGS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-blue-600 mr-1.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';
      const UPLOAD_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>';
      const SPARKLES_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline mr-1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5 5 3Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z"/></svg>';
      const ALERT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';

      // Live Theme State Setup
      let isDarkMode = ${isDarkModeDefault};

      // App Engine State Variables
      let rawFullText = ''; // Stores complete original pristine nested JSON string
      let inputText = '';
      let targetSize = 450000;
      let chunks = [];
      let activeChunkIndex = 0;
      let fileName = '';
      let forceMode = 'auto';
      let modeUsed = 'raw_text';
      let highlightSyntax = true;
      let totalInputSizeBytes = 0;

      // In-chunk Local Search States
      let searchTerm = '';
      let searchResults = [];
      let searchIndex = -1;

      // Setup initial visual assets
      function initializeAssets() {
        document.getElementById('badge-cpu-container').innerHTML = CPU_SVG;
        document.getElementById('badge-settings-container').innerHTML = SETTINGS_SVG;
        document.getElementById('dropzone-icon-container').innerHTML = UPLOAD_SVG;
        document.getElementById('btn-process-icon').innerHTML = CHECK_SVG;
        document.getElementById('sparkles-icon-container').innerHTML = SPARKLES_SVG;
        document.getElementById('sidebar-filetext-icon').innerHTML = FILETEXT_SVG;
        document.getElementById('copy-icon-placeholder').innerHTML = COPY_SVG;
        document.getElementById('save-icon-placeholder').innerHTML = DOWNLOAD_SVG;
        document.getElementById('warn-alert-icon-container').innerHTML = ALERT_SVG;
        document.getElementById('search-icon-placeholder').innerHTML = SEARCH_SVG;
        document.getElementById('nav-prev-icon').innerHTML = CHEVRON_LEFT_SVG;
        document.getElementById('nav-next-icon').innerHTML = CHEVRON_RIGHT_SVG;

        // Render correct Sun or Moon inside toggle action
        updateThemeSwitcherButton();
      }

      function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        
        const root = document.getElementById('main-app-root');
        const btn = document.getElementById('theme-toggle-btn');
        
        if (isDarkMode) {
          root.className = 'dark bg-zinc-950 text-zinc-100 min-h-screen font-sans transition-colors duration-200 flex flex-col';
          btn.title = "Passa alla modalità chiara";
          btn.innerHTML = SUN_SVG;
        } else {
          root.className = 'bg-[#F9FAFB] text-zinc-900 min-h-screen font-sans transition-colors duration-200 flex flex-col';
          btn.title = "Passa alla modalità scura";
          btn.innerHTML = MOON_SVG;
        }
      }

      function updateThemeSwitcherButton() {
        const btn = document.getElementById('theme-toggle-btn');
        if (isDarkMode) {
          btn.innerHTML = SUN_SVG;
          btn.title = "Passa alla modalità chiara";
        } else {
          btn.innerHTML = MOON_SVG;
          btn.title = "Passa alla modalità scura";
        }
      }

      // Re-runs the splitting algorithm on the original full text asynchronously
      function reprocessJSONData() {
        if (!rawFullText) return;

        showLoading('Ricalcolando divisione dei pezzi...');
        setTimeout(() => {
          try {
            const results = splitJSONContent(rawFullText, targetSize, forceMode);
            chunks = results.chunks;
            modeUsed = results.modeUsed;
            
            // Constrain indices
            activeChunkIndex = Math.min(activeChunkIndex, chunks.length - 1);
            if (activeChunkIndex < 0) activeChunkIndex = 0;

            renderDashboard(results.error);
          } catch (err) {
            alert("Errore durante la divisione live del codice: " + (err.message || err));
          } finally {
            hideLoading();
          }
        }, 120);
      }

      function setTargetSizeValue(size) {
        targetSize = size;
        [100000, 250000, 450000, 1000000].forEach(s => {
          const btn = document.getElementById('size-btn-' + s);
          if (btn) {
            if (s === size) {
              btn.className = "py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-blue-600 text-white border-blue-600";
            } else {
              btn.className = "py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700";
            }
          }
        });

        // Trigger dynamic refresh if we already had files loaded
        if (rawFullText) {
          reprocessJSONData();
        }
      }

      function handleModeChange(selectEl) {
        forceMode = selectEl.value;
        if (rawFullText) {
          reprocessJSONData();
        }
      }

      function toggleProcessButton() {
        const area = document.getElementById('paste-textarea');
        const btn = document.getElementById('process-btn');
        if (area && btn) {
          if (area.value.trim().length > 0) {
            btn.classList.remove('hidden');
          } else {
            btn.classList.add('hidden');
          }
        }
      }

      function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }

      // High-performance parser engine
      function splitJSONContent(rawText, targetChunkSizeBytes, chosenMode) {
        const trimmed = rawText.trim();
        if (!trimmed) {
          return { chunks: [], modeUsed: 'raw_text', error: 'Il testo inserito è vuoto.' };
        }

        if (trimmed.length <= targetChunkSizeBytes) {
          let isValid = false;
          try {
            JSON.parse(trimmed);
            isValid = true;
          } catch {}

          return {
            chunks: [
              {
                index: 0,
                label: 'Blocco Unico',
                sizeBytes: new Blob([trimmed]).size,
                content: trimmed,
                isValidJSON: isValid,
              }
            ],
            modeUsed: 'auto',
          };
        }

        let parsed = null;
        let isParsed = false;
        let parseError = null;
        try {
          parsed = JSON.parse(trimmed);
          isParsed = true;
        } catch (err) {
          parseError = err && err.message ? err.message : 'Errore generico di parsing JSON';
        }

        const chunkList = [];
        let usedMode = 'raw_text';

        if (isParsed && chosenMode !== 'raw_text') {
          if (Array.isArray(parsed) && chosenMode !== 'object_keys') {
            usedMode = 'array_items';
            let currentGroup = [];
            let currentLenEstimate = 2;
            let chunkIndex = 0;

            for (let i = 0; i < parsed.length; i++) {
              const item = parsed[i];
              const itemStr = JSON.stringify(item);
              const itemLen = itemStr.length + 1;

              if (currentGroup.length > 0 && currentLenEstimate + itemLen > targetChunkSizeBytes) {
                const chunkJson = JSON.stringify(currentGroup, null, 2);
                chunkList.push({
                  index: chunkIndex,
                  label: 'Blocco ' + (chunkIndex + 1) + ' (Elementi ' + (i - currentGroup.length) + ' - ' + (i - 1) + ')',
                  sizeBytes: new Blob([chunkJson]).size,
                  content: chunkJson,
                  isValidJSON: true,
                });

                currentGroup = [item];
                currentLenEstimate = 2 + itemStr.length;
                chunkIndex++;
              } else {
                currentGroup.push(item);
                currentLenEstimate += itemLen;
              }
            }

            if (currentGroup.length > 0) {
              const chunkJson = JSON.stringify(currentGroup, null, 2);
              chunkList.push({
                index: chunkIndex,
                label: 'Blocco ' + (chunkIndex + 1) + ' (Elementi ' + (parsed.length - currentGroup.length) + ' - ' + (parsed.length - 1) + ')',
                sizeBytes: new Blob([chunkJson]).size,
                content: chunkJson,
                isValidJSON: true,
              });
            }
          } else if (typeof parsed === 'object' && parsed !== null && chosenMode !== 'array_items') {
            usedMode = 'object_keys';
            const entries = Object.entries(parsed);
            let currentGroup = {};
            let currentLenEstimate = 2;
            let chunkIndex = 0;

            for (let i = 0; i < entries.length; i++) {
              const [key, val] = entries[i];
              const entryStr = JSON.stringify(key) + ':' + JSON.stringify(val);
              const entryLen = entryStr.length + 1;

              if (Object.keys(currentGroup).length > 0 && currentLenEstimate + entryLen > targetChunkSizeBytes) {
                const chunkJson = JSON.stringify(currentGroup, null, 2);
                const kList = Object.keys(currentGroup);
                chunkList.push({
                  index: chunkIndex,
                  label: 'Blocco ' + (chunkIndex + 1) + ' (' + kList[0] + ' ... ' + kList[kList.length - 1] + ')',
                  sizeBytes: new Blob([chunkJson]).size,
                  content: chunkJson,
                  isValidJSON: true,
                });

                currentGroup = { [key]: val };
                currentLenEstimate = 2 + entryStr.length;
                chunkIndex++;
              } else {
                currentGroup[key] = val;
                currentLenEstimate += entryLen;
              }
            }

            if (Object.keys(currentGroup).length > 0) {
              const chunkJson = JSON.stringify(currentGroup, null, 2);
              const kList = Object.keys(currentGroup);
              chunkList.push({
                index: chunkIndex,
                label: 'Blocco ' + (chunkIndex + 1) + ' (' + kList[0] + ' ... ' + kList[kList.length - 1] + ')',
                sizeBytes: new Blob([chunkJson]).size,
                content: chunkJson,
                isValidJSON: true,
              });
            }
          }
        }

        if (chunkList.length === 0) {
          usedMode = 'raw_text';
          const lines = trimmed.split('
');
          let chunkIndex = 0;
          let currentText = '';
          let currentLenBytes = 0;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i] + '
';
            const lineBytes = new Blob([line]).size;

            if (currentText.length > 0 && currentLenBytes + lineBytes > targetChunkSizeBytes) {
              chunkList.push({
                index: chunkIndex,
                label: 'Blocco ' + (chunkIndex + 1) + ' (Righe ~' + (chunkIndex * 1500) + ' in poi)',
                sizeBytes: currentLenBytes,
                content: currentText,
                isValidJSON: false,
              });

              currentText = line;
              currentLenBytes = lineBytes;
              chunkIndex++;
            } else {
              currentText += line;
              currentLenBytes += lineBytes;
            }
          }

          if (currentText.length > 0) {
            chunkList.push({
              index: chunkIndex,
              label: 'Blocco ' + (chunkIndex + 1) + ' (Fino a riga ' + lines.length + ')',
              sizeBytes: currentLenBytes,
              content: currentText,
              isValidJSON: false,
            });
          }
        }

        return { chunks: chunkList, modeUsed: usedMode, error: parseError ? 'Nota: Parsing fallito, diviso come testo grezzo. (' + parseError + ')' : undefined };
      }

      function showLoading(stage) {
        const textEl = document.getElementById('loading-stage-text');
        if (textEl) textEl.innerText = stage;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
          overlay.classList.remove('hidden');
          overlay.classList.add('flex');
        }
      }

      function hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
          overlay.classList.add('hidden');
          overlay.classList.remove('flex');
        }
      }

      function processJSONData(text, name) {
        if (!text || !text.trim()) {
          hideLoading();
          return;
        }

        rawFullText = text;
        showLoading('Inizializzazione...');

        setTimeout(function() {
          try {
            const bytes = new Blob([text]).size;
            totalInputSizeBytes = bytes;

            if (bytes < 200000) {
              inputText = text;
              const area = document.getElementById('paste-textarea');
              if (area) area.value = text;
            } else {
              inputText = '[File JSON grande caricato con successo: ' + formatBytes(bytes) + ']';
              const area = document.getElementById('paste-textarea');
              if (area) area.value = inputText;
            }

            if (name) {
              fileName = name;
            } else if (!fileName) {
              fileName = 'pasted_json.json';
            }

            // Perform splitting immediately and synchronously inside try-catch to avoid unhandled async escapes
            const results = splitJSONContent(text, targetSize, forceMode);
            chunks = results.chunks;
            modeUsed = results.modeUsed;
            activeChunkIndex = 0;

            renderDashboard(results.error);
          } catch (err) {
            console.error(err);
            alert("Errore durante l'elaborazione del file JSON: " + (err.message || err));
          } finally {
            hideLoading();
          }
        }, 80);
      }

      function pasteFromClipboard() {
        if (!navigator.clipboard || !navigator.clipboard.readText) {
          alert("La lettura diretta degli appunti non è supportata dal browser in questo contesto locale o sul telefono (richiede protocollo sicuro HTTPS o autorizzazioni del browser). 

Per favore, usa la scorciatoia classica: tieni premuto ed incolla manualmente (Ctrl+V) dentro la casella di testo.");
          return;
        }

        showLoading('Richiesta accesso appunti...');
        navigator.clipboard.readText()
          .then(function(text) {
            if (!text || !text.trim()) {
              alert("Il contenuto copiato negli appunti è vuoto o non è del testo valido.");
              hideLoading();
              return;
            }
            showLoading('Elaborazione dati incollati...');
            setTimeout(function() {
              processJSONData(text, 'clipboard_json.json');
            }, 50);
          })
          .catch(function(err) {
            console.error(err);
            alert("Il browser ha negato l'accesso agli appunti. 

Soluzione: Incolla manualmente (Ctrl+V o tieni premuto) dentro la casella di testo qui sotto.");
            hideLoading();
          });
      }

      function handleProcessText() {
        const area = document.getElementById('paste-textarea');
        if (!area) return;
        const text = area.value;
        if (!text.trim()) return;

        fileName = 'pasted_json.json';
        forceMode = document.getElementById('split-mode-select').value;
        processJSONData(text, fileName);
      }

      function handleFileUpload(inputEl) {
        const file = (inputEl.files && inputEl.files.length > 0) ? inputEl.files[0] : null;
        if (!file) return;

        fileName = file.name;
        forceMode = document.getElementById('split-mode-select').value;

        showLoading('Lettura del file...');
        setTimeout(() => {
          const reader = new FileReader();
          reader.onload = function() {
            const text = reader.result;
            processJSONData(text, file.name);
          };
          reader.onerror = function() {
            alert('Errore nella lettura del file.');
            hideLoading();
          };
          reader.readAsText(file);
        }, 150);
      }

      // Drag and Drop files safely
      function handleDragEnter(e) { e.preventDefault(); e.stopPropagation(); document.getElementById('dropzone').classList.add('border-blue-500'); }
      function handleDragOver(e) { e.preventDefault(); e.stopPropagation(); }
      function handleDragLeave(e) { e.preventDefault(); e.stopPropagation(); document.getElementById('dropzone').classList.remove('border-blue-500'); }
      function handleDropFile(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('dropzone').classList.remove('border-blue-500');
        const file = (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) ? e.dataTransfer.files[0] : null;
        if (!file) return;

        fileName = file.name;
        forceMode = document.getElementById('split-mode-select').value;

        showLoading('Caricamento file trascinato...');
        setTimeout(() => {
          const reader = new FileReader();
          reader.onload = function(event) {
            const text = event.target.result;
            processJSONData(text, file.name);
          };
          reader.onerror = function() {
            alert('Errore di lettura del file.');
            hideLoading();
          };
          reader.readAsText(file);
        }, 150);
      }

      function handleGenerateSample() {
        fileName = 'campione_10MB.json';
        forceMode = 'auto';

        showLoading('Generazione dei dati campione (15.000 record)...');

        setTimeout(() => {
          const items = [];
          const sampleNames = ['Raffaele', 'Marco', 'Sofia', 'Giulia', 'Elena', 'Alessandro', 'Matteo', 'Chiara', 'Leonardo', 'Davide'];
          const sampleCities = ['Roma', 'Milano', 'Napoli', 'Torino', 'Firenze', 'Bari', 'Venezia', 'Bologna', 'Genova', 'Palermo'];
          const sampleJobs = ['Ingegnere', 'Designer', 'Medico', 'Insegnante', 'Sviluppatore', 'Cuoco', 'Scrittore', 'Astronauta', 'Avvocato', 'Barista'];

          for (let i = 1; i <= 15000; i++) {
            items.push({
              id: i,
              guid: 'id-gen-' + Math.random().toString(36).substring(2, 11) + '-' + i,
              attivo: Math.random() > 0.3,
              profilo: {
                nome: sampleNames[i % sampleNames.length],
                citta: sampleCities[Math.random() > 0.5 ? (i % sampleCities.length) : 0],
                professione: sampleJobs[i % sampleJobs.length],
                punteggio: Math.floor(Math.random() * 1000) + 100
              },
              cronologia_accessi: [
                { timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString(), ip: '192.168.1.' + (i % 255) },
                { timestamp: new Date(Date.now() - Math.random() * 5000000).toISOString(), ip: '10.0.0.' + (i % 255) }
              ],
              metadati: {
                creato_il: '2026-06-11T06:17:51Z',
                lingua: i % 3 === 0 ? 'it_IT' : 'en_US',
                tags: ['json', 'split', 'tester', 'tag_' + (i % 10)]
              }
            });
          }

          const generatedStr = JSON.stringify(items, null, 2);
          processJSONData(generatedStr, 'campione_10MB.json');
        }, 150);
      }

      function handleReset() {
        rawFullText = '';
        inputText = '';
        chunks = [];
        fileName = '';
        activeChunkIndex = 0;
        totalInputSizeBytes = 0;

        document.getElementById('paste-textarea').value = '';
        document.getElementById('screen-input').classList.remove('hidden');
        document.getElementById('screen-dashboard').classList.add('hidden');
        document.getElementById('header-reset-btn').classList.add('hidden');
        toggleProcessButton();
      }

      function handlePrevChunk() {
        if (activeChunkIndex > 0) {
          selectChunk(activeChunkIndex - 1);
        }
      }

      function handleNextChunk() {
        if (activeChunkIndex < chunks.length - 1) {
          selectChunk(activeChunkIndex + 1);
        }
      }

      function selectChunk(index) {
        activeChunkIndex = index;
        
        // Reset local search inside the block
        document.getElementById('chunk-search-input').value = '';
        searchTerm = '';
        searchResults = [];
        searchIndex = -1;
        document.getElementById('search-results-controls').classList.add('hidden');

        renderActiveChunkData();
      }

      function escapeHtml(text) {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      // High-performance regular expression tokenizer for syntax highlighting
      function compileHighlighted(raw) {
        if (!highlightSyntax || raw.length > 700000) {
          return escapeHtml(raw);
        }

        const escaped = escapeHtml(raw);
        return escaped.replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(s*:)?|\b(true|false|null)\b|-?d+(?:.d*)?(?:[eE][+-]?d+)?)/g,
          (match) => {
            let cls = 'text-amber-300 font-mono';
            if (match.startsWith('"')) {
              if (match.endsWith(':')) {
                cls = 'text-indigo-400 dark:text-pink-400 font-semibold font-mono';
              } else {
                cls = 'text-emerald-700 dark:text-green-400 font-mono';
              }
            } else if (match === 'true' || match === 'false') {
              cls = 'text-purple-600 dark:text-orange-350 font-medium font-mono';
            } else if (match === 'null') {
              cls = 'text-gray-400 font-mono italic';
            }
            return '<span class="' + cls + '">' + match + '</span>';
          }
        );
      }

      // Render Layout States
      function renderDashboard(parsingError) {
        document.getElementById('screen-input').classList.add('hidden');
        document.getElementById('screen-dashboard').classList.remove('hidden');
        document.getElementById('header-reset-btn').classList.remove('hidden');

        // Fill Stats Cards
        const bytes = totalInputSizeBytes;
        document.getElementById('info-file-name').innerText = fileName;
        document.getElementById('info-total-size-side').innerText = 'Totale: ' + formatBytes(bytes);
        document.getElementById('info-total-size').innerText = formatBytes(bytes);
        document.getElementById('info-target-limit').innerText = formatBytes(targetSize);
        document.getElementById('info-total-chunks').innerText = chunks.length;

        // Optionally show parsing warning error
        const errBox = document.getElementById('info-error-box');
        if (parsingError) {
          errBox.innerText = parsingError;
          errBox.classList.remove('hidden');
        } else {
          errBox.classList.add('hidden');
        }

        // Render Desktop sidebar list
        const listContainer = document.getElementById('desktop-chunks-list');
        listContainer.innerHTML = '';
        
        // Render Mobile select options
        const mobileSelect = document.getElementById('mobile-chunk-select');
        mobileSelect.innerHTML = '';

        chunks.forEach((chunk, i) => {
          // mobile select
          const opt = document.createElement('option');
          opt.value = i;
          opt.innerText = '#' + (i + 1) + ' - ' + chunk.label + ' (' + formatBytes(chunk.sizeBytes) + ')';
          mobileSelect.appendChild(opt);

          // desktop button
          const btn = document.createElement('button');
          btn.id = 'side-chunk-btn-' + i;
          btn.onclick = () => selectChunk(i);
          btn.className = "text-left p-2.5 rounded-xl transition-all cursor-pointer bg-[#F9FAFB] hover:bg-gray-100 text-zinc-700 block w-full";
          btn.innerHTML =
            '<div class="flex justify-between items-center text-xs">' +
              '<span class="truncate block max-w-[130px] font-medium">' + chunk.label + '</span>' +
              '<span class="text-[10px] opacity-75 font-mono font-bold">' + formatBytes(chunk.sizeBytes) + '</span>' +
            '</div>';
          listContainer.appendChild(btn);
        });

        renderActiveChunkData();
      }

      function renderActiveChunkData() {
        if (chunks.length === 0) return;
        const currentChunk = chunks[activeChunkIndex];

        // update mobile selection picker
        document.getElementById('mobile-chunk-select').value = activeChunkIndex;

        // update active classes on desktop sidebar keys list
        chunks.forEach((_, i) => {
          const btn = document.getElementById('side-chunk-btn-' + i);
          if (btn) {
            if (i === activeChunkIndex) {
              btn.className = "text-left p-2.5 rounded-xl transition-all cursor-pointer bg-blue-600 text-white font-bold border-l-4 border-blue-900 block w-full";
            } else {
              btn.className = "text-left p-2.5 rounded-xl transition-all cursor-pointer bg-[#F9FAFB] hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-850/80 text-zinc-700 dark:text-zinc-300 block w-full";
            }
          }
        });

        // Setup viewing badge part
        document.getElementById('viewing-part-badge').innerText = String(activeChunkIndex + 1).padStart(2, '0');
        document.getElementById('viewing-part-meta').innerText = 'Size: ' + formatBytes(currentChunk.sizeBytes) + ' | ' + (currentChunk.isValidJSON ? 'Valid syntax' : 'Raw content');

        // Toggle syntax coloring button SVG render
        const colorBtn = document.getElementById('opt-toggle-colors');
        if (highlightSyntax) {
          colorBtn.innerHTML = EYEOFF_SVG;
          colorBtn.title = "Disattiva colori";
        } else {
          colorBtn.innerHTML = EYE_SVG;
          colorBtn.title = "Attiva colori";
        }

        // Setup large warning alerts
        const warn = document.getElementById('highlight-warning');
        if (currentChunk.content.length > 700000) {
          warn.classList.remove('hidden');
          colorBtn.classList.add('hidden'); // hide colors button if huge file bypasses highlight
        } else {
          warn.classList.add('hidden');
          colorBtn.classList.remove('hidden');
        }

        // Render code block
        const pre = document.getElementById('raw-code-block');
        if (highlightSyntax && currentChunk.content.length <= 700000) {
          pre.innerHTML = compileHighlighted(currentChunk.content);
        } else {
          pre.innerText = currentChunk.content;
        }

        // Navigation state bar
        document.getElementById('nav-btn-status-badge').innerText = 'PART ' + (activeChunkIndex + 1) + ' OF ' + chunks.length;
        
        // Prev button boundary disabled/active class states
        const prevBtn = document.getElementById('nav-btn-prev');
        if (activeChunkIndex === 0) {
          prevBtn.disabled = true;
          prevBtn.className = "flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-not-allowed text-gray-400 bg-gray-105 dark:text-zinc-600 dark:bg-zinc-800";
        } else {
          prevBtn.disabled = false;
          prevBtn.className = "flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer border border-gray-300 dark:border-zinc-750 text-gray-700 dark:text-zinc-150 bg-white dark:bg-zinc-800 hover:bg-gray-50";
        }

        // Next button boundary disabled/active class states
        const nextBtn = document.getElementById('nav-btn-next');
        if (activeChunkIndex === chunks.length - 1) {
          nextBtn.disabled = true;
          nextBtn.className = "flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all cursor-not-allowed text-gray-400 bg-gray-105 dark:text-zinc-600 dark:bg-zinc-800";
        } else {
          nextBtn.disabled = false;
          nextBtn.className = "flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 shadow-md";
        }
      }

      function toggleHighlightSyntax() {
        highlightSyntax = !highlightSyntax;
        renderActiveChunkData();
      }

      // Actions
      async function copyActiveChunk() {
        if (chunks.length === 0) return;
        const currentChunk = chunks[activeChunkIndex];
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(currentChunk.content);
          } else {
            // Unsecure context Fallback
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = currentChunk.content;
            tempTextArea.style.top = '0';
            tempTextArea.style.left = '0';
            tempTextArea.style.position = 'fixed';
            tempTextArea.style.opacity = '0';
            document.body.appendChild(tempTextArea);
            tempTextArea.focus();
            tempTextArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            if (!success) {
              throw new Error('execCommand copy failed');
            }
          }
          
          const btnText = document.getElementById('copy-btn-text');
          const placeholder = document.getElementById('copy-icon-placeholder');
          
          btnText.innerText = 'Copied! ✅';
          placeholder.innerHTML = CHECK_SVG;
          
          setTimeout(() => {
            btnText.innerText = 'Copy';
            placeholder.innerHTML = COPY_SVG;
          }, 2000);
        } catch (err) {
          alert('Errore di copia.');
        }
      }

      function downloadActiveChunk() {
        if (chunks.length === 0) return;
        const currentChunk = chunks[activeChunkIndex];
        try {
          const blob = new Blob([currentChunk.content], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'chunk_' + (currentChunk.index + 1) + '.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } catch (err) {
          alert('Impossibile scaricare.');
        }
      }

      // Search engine inside chunk content block
      function handleSearchSearch() {
        const input = document.getElementById('chunk-search-input');
        searchTerm = input.value.trim();

        if (!searchTerm || searchTerm.length < 2) {
          searchResults = [];
          searchIndex = -1;
          document.getElementById('search-results-controls').classList.add('hidden');
          return;
        }

        const currentChunk = chunks[activeChunkIndex];
        const content = currentChunk.content;
        
        searchResults = [];
        let index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
        while (index !== -1) {
          searchResults.push(index);
          index = content.toLowerCase().indexOf(searchTerm.toLowerCase(), index + 1);
        }

        if (searchResults.length > 0) {
          searchIndex = 0;
          document.getElementById('search-results-controls').classList.remove('hidden');
          document.getElementById('search-counter').innerText = '1 of ' + searchResults.length;
          scrollToPosition(searchResults[0]);
        } else {
          searchIndex = -1;
          document.getElementById('search-results-controls').classList.remove('hidden');
          document.getElementById('search-counter').innerText = '0 of 0';
        }
      }

      function navigateSearch(dir) {
        if (searchResults.length === 0) return;
        searchIndex = (searchIndex + dir + searchResults.length) % searchResults.length;
        document.getElementById('search-counter').innerText = (searchIndex + 1) + ' of ' + searchResults.length;
        scrollToPosition(searchResults[searchIndex]);
      }

      function scrollToPosition(charIdx) {
        const pre = document.getElementById('raw-code-block');
        if (!pre) return;
        const totalLen = chunks[activeChunkIndex].content.length;
        const ratio = charIdx / totalLen;
        const target = pre.scrollHeight * ratio - 100;
        pre.scrollTo({
          top: Math.max(0, target),
          behavior: 'smooth'
        });
      }

      // Intercettore degli eventi di incolla per file o testi pesanti (Globale come in React)
      window.addEventListener('paste', function(e) {
        // 1. Check if we have files in clipboard
        const files = (e.clipboardData && e.clipboardData.files) ? e.clipboardData.files : null;
        if (files && files.length > 0) {
          e.preventDefault();
          const file = files[0];
          fileName = file.name;
          showLoading('File incollato! Lettura in corso...');
          
          setTimeout(function() {
            const reader = new FileReader();
            reader.onload = function() {
              const text = reader.result;
              processJSONData(text, file.name);
            };
            reader.onerror = function() {
              alert('Errore nella lettura del file incollato.');
              hideLoading();
            };
            reader.readAsText(file);
          }, 150);
          return;
        }

        // 2. Check if we have text in clipboard
        const text = (e.clipboardData && typeof e.clipboardData.getData === 'function') ? e.clipboardData.getData('text') : '';
        if (text && text.trim()) {
          const trimmed = text.trim();
          
          // Se l'utente sta modificando la barra di ricerca interna del pezzo, lascia fare native paste
          const activeElement = document.activeElement;
          if (activeElement && activeElement.id === 'chunk-search-input') {
            return; // Consente native paste
          }

          // Rilevamento automatico intelligente di testo JSON: se inizia con { o [, elabora immediatamente AUTOMATICAMENTE!
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            e.preventDefault();
            showLoading('Elaborazione JSON incollato automatico...');
            setTimeout(function() {
              processJSONData(text, 'pasted_json.json');
            }, 120);
            return;
          }

          // Se è focused sulla textarea ed è testo enorme (> 100 KB) ma non è per forza JSON valido,
          // lo intercettiamo per evitare lag tremendi del thread UI nativo delle textarea
          if (activeElement && activeElement.id === 'paste-textarea' && text.length > 100000) {
            e.preventDefault();
            showLoading('Parificando testo incollato pesante...');
            setTimeout(function() {
              processJSONData(text, 'pasted_heavy_json.json');
            }, 120);
          }
        }
      });

      // Initialization caller
      initializeAssets();
      toggleProcessButton();
    <\/script>
  </body>
</html>`;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4cG9ydGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSW5kZXBlbmRlbnQgT2ZmbGluZSBIVE1MIEJ1bmRsZSBHZW5lcmF0b3IgKExhZy1GcmVlIEpTT04gQ2h1bmtlcikuXG4gKiBDdXN0b20tY3JhZnRlZCB0byBydW4gY29tcGxldGVseSBvZmZsaW5lLCBwcml2YXRlLCBhbmQgMTAwJSBjcmFzaC1wcm9vZlxuICogb24gcGhvbmUgYnJvd3NlcnMsIGRlc2t0b3AgbG9jYWwgc2Vzc2lvbnMsIGFuZCBzdGFuZGFyZCBmaWxlOi8vLyBwcm90b2NvbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU9mZmxpbmVIdG1sKGlzRGFya01vZGVEZWZhdWx0OiBib29sZWFuID0gdHJ1ZSk6IHN0cmluZyB7XG4gIHJldHVybiBgPCFkb2N0eXBlIGh0bWw+XG48aHRtbCBsYW5nPVwiaXRcIj5cbiAgPGhlYWQ+XG4gICAgPG1ldGEgY2hhcnNldD1cIlVURi04XCIgLz5cbiAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiIC8+XG4gICAgPHRpdGxlPkpTT04gQ2h1bmtlciAtIE9mZmxpbmUgUmVhZGVyPC90aXRsZT5cbiAgICBcbiAgICA8IS0tIFJvYnVzdCBUYWlsd2luZCBDU1MgQ0ROIHdpdGggZmlsZTovLyBzYW5kYm94aW5nIGNvbXBhdGliaWxpdHkgLS0+XG4gICAgPHNjcmlwdCBzcmM9XCJodHRwczovL2Nkbi50YWlsd2luZGNzcy5jb21cIj48L3NjcmlwdD5cbiAgICA8c2NyaXB0PlxuICAgICAgdGFpbHdpbmQuY29uZmlnID0ge1xuICAgICAgICBkYXJrTW9kZTogJ2NsYXNzJyxcbiAgICAgICAgdGhlbWU6IHtcbiAgICAgICAgICBleHRlbmQ6IHtcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IHtcbiAgICAgICAgICAgICAgc2FuczogWydJbnRlcicsICctYXBwbGUtc3lzdGVtJywgJ0JsaW5rTWFjU3lzdGVtRm9udCcsICdcIlNlZ29lIFVJXCInLCAnc2Fucy1zZXJpZiddLFxuICAgICAgICAgICAgICBtb25vOiBbJ1wiSmV0QnJhaW5zIE1vbm9cIicsICdGaXJhIENvZGUnLCAnbW9ub3NwYWNlJ11cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICA8L3NjcmlwdD5cbiAgICBcbiAgICA8c3R5bGU+XG4gICAgICBAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1JbnRlcjp3Z2h0QDMwMDs0MDA7NTAwOzYwMDs3MDAmZmFtaWx5PUpldEJyYWlucytNb25vOndnaHRAMzAwOzQwMDs1MDA7NjAwJmRpc3BsYXk9c3dhcCcpO1xuICAgICAgXG4gICAgICBib2R5IHtcbiAgICAgICAgZm9udC1mYW1pbHk6ICdJbnRlcicsIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBzYW5zLXNlcmlmO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC5mb250LW1vbm8ge1xuICAgICAgICBmb250LWZhbWlseTogJ0pldEJyYWlucyBNb25vJywgbW9ub3NwYWNlICFpbXBvcnRhbnQ7XG4gICAgICB9XG5cbiAgICAgIC5zY3JvbGxiYXItaGlkZTo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgICB3aWR0aDogNnB4O1xuICAgICAgICBoZWlnaHQ6IDZweDtcbiAgICAgIH1cbiAgICAgIC5zY3JvbGxiYXItaGlkZTo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMWUyOTNiO1xuICAgICAgfVxuICAgICAgLnNjcm9sbGJhci1oaWRlOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICM0NzU1Njk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgIH1cbiAgICA8L3N0eWxlPlxuICA8L2hlYWQ+XG4gIDxib2R5IGNsYXNzPVwidHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMjAwXCI+XG4gICAgXG4gICAgPCEtLSBNYXN0ZXIgbGF5b3V0IHdpdGggZGVmYXVsdCB0aGVtZSBpbmplY3Rpb24gLS0+XG4gICAgPGRpdiBpZD1cIm1haW4tYXBwLXJvb3RcIiBjbGFzcz1cIiR7aXNEYXJrTW9kZURlZmF1bHQgPyAnZGFyayBiZy16aW5jLTk1MCB0ZXh0LXppbmMtMTAwJyA6ICdiZy1bI0Y5RkFGQl0gdGV4dC16aW5jLTkwMCd9IG1pbi1oLXNjcmVlbiBmb250LXNhbnMgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMjAwIGZsZXggZmxleC1jb2xcIj5cbiAgICAgIFxuICAgICAgPCEtLSBMT0FESU5HIE9WRVJMQVkgLS0+XG4gICAgICA8ZGl2IGlkPVwibG9hZGluZy1vdmVybGF5XCIgY2xhc3M9XCJmaXhlZCBpbnNldC0wIHotWzEwMF0gYmFja2Ryb3AtYmx1ci1tZCBiZy16aW5jLTk1MC83NSBoaWRkZW4gZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtNiB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJnLXdoaXRlIGRhcms6YmctemluYy05MDAgYm9yZGVyIGJvcmRlci16aW5jLTIwMCBkYXJrOmJvcmRlci16aW5jLTg1MCBwLTYgc206cC04IHJvdW5kZWQtMnhsIHNoYWRvdy0yeGwgbWF4LXctc20gdy1mdWxsIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHRleHQtY2VudGVyIGdhcC00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJlbGF0aXZlIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWJzb2x1dGUgdy0xNiBoLTE2IHJvdW5kZWQtZnVsbCBib3JkZXItNCBib3JkZXItYmx1ZS01MDAvMjAgYW5pbWF0ZS1waW5nXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidy0xNiBoLTE2IHJvdW5kZWQtZnVsbCBib3JkZXItNCBib3JkZXItdC1ibHVlLTYwMCBib3JkZXItci10cmFuc3BhcmVudCBib3JkZXItYi1ibHVlLTYwMC8xMCBib3JkZXItbC10cmFuc3BhcmVudCBhbmltYXRlLXNwaW5cIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhYnNvbHV0ZSB0ZXh0LWJsdWUtNjAwIGZvbnQtbW9ubyB0ZXh0LXhzIGZvbnQtYm9sZFwiPnsgfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtY29sIGdhcC0xLjVcIj5cbiAgICAgICAgICAgIDxoMyBjbGFzcz1cInRleHQtc20gZm9udC1ib2xkIHRleHQtZ3JheS05MDAgZGFyazp0ZXh0LXppbmMtNTAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+RWxhYm9yYXppb25lIEpTT048L2gzPlxuICAgICAgICAgICAgPHAgaWQ9XCJsb2FkaW5nLXN0YWdlLXRleHRcIiBjbGFzcz1cInRleHQteHMgdGV4dC1ibHVlLTYwMCBkYXJrOnRleHQtYmx1ZS00MDAgZm9udC1tb25vIGZvbnQtbWVkaXVtIGFuaW1hdGUtcHVsc2VcIj5Jbml6aWFsaXp6YXppb25lLi4uPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LVsxMHB4XSB0ZXh0LWdyYXktNDAwIGRhcms6dGV4dC16aW5jLTUwMCBtdC0yXCI+T3R0aW1penphemlvbmUgbWVtb3JpYSBpbiBjb3JzbyBwZXIgZXZpdGFyZSBpbCBsYWcgc3VsIHRlbGVmb25vLjwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBIRUFERVIgLS0+XG4gICAgICA8aGVhZGVyIGNsYXNzPVwic3RpY2t5IHRvcC0wIHotNTAgYmFja2Ryb3AtYmx1ci1tZCBiZy13aGl0ZS84MCBkYXJrOmJnLXppbmMtOTUwLzgwIGJvcmRlci1iIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci16aW5jLTgwMC84MCBweC00IHB5LTRcIiBpZD1cImFwcC1oZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1heC13LTZ4bCBteC1hdXRvIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctOCBoLTggYmctYmx1ZS02MDAgcm91bmRlZC1sZyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LXdoaXRlIGZvbnQtYm9sZCBzZWxlY3Qtbm9uZSB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi0zMDAgaG92ZXI6cm90YXRlLTNcIj5cbiAgICAgICAgICAgICAgeyB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMSBjbGFzcz1cInRleHQtbGcgZm9udC1ib2xkIHRyYWNraW5nLXRpZ2h0IHRleHQtZ3JheS04MDAgZGFyazp0ZXh0LXppbmMtNTBcIj5cbiAgICAgICAgICAgICAgICBKU09OIDxzcGFuIGNsYXNzPVwidGV4dC1ibHVlLTYwMFwiPkNodW5rZXI8L3NwYW4+IDxzcGFuIGNsYXNzPVwidGV4dC1bMTBweF0gYmctZ3JheS0xMDAgZGFyazpiZy16aW5jLTgwMCB0ZXh0LWdyYXktNTAwIGRhcms6dGV4dC16aW5jLTQwMCBweS0wLjUgcHgtMiByb3VuZGVkLW1kIGZvbnQtbW9ubyBmb250LW5vcm1hbFwiPk9mZmxpbmU8L3NwYW4+XG4gICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1bMTBweF0gdXBwZXJjYXNlIGZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTQwMCB0cmFja2luZy13aWRlc3QgYmxvY2sgLW10LTAuNVwiPlxuICAgICAgICAgICAgICAgIExhZy1mcmVlIE1vYmlsZSBTcGxpdHRpbmdcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDwhLS0gVGhlbWUgU3dpdGNoZXIgLS0+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGlkPVwidGhlbWUtdG9nZ2xlLWJ0blwiXG4gICAgICAgICAgICAgIG9uY2xpY2s9XCJ0b2dnbGVEYXJrTW9kZSgpXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJwLTIgaG92ZXI6YmctZ3JheS0xMDAgZGFyazpiZy16aW5jLTkwMCBkYXJrOmhvdmVyOmJnLXppbmMtODAwIHJvdW5kZWQtbGcgdGV4dC1ncmF5LTUwMCBkYXJrOnRleHQtemluYy0zMDAgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICB0aXRsZT1cIiR7aXNEYXJrTW9kZURlZmF1bHQgPyAnUGFzc2EgYWxsYSBtb2RhbGl0w6AgY2hpYXJhJyA6ICdQYXNzYSBhbGxhIG1vZGFsaXTDoCBzY3VyYSd9XCJcbiAgICAgICAgICAgICAgc3R5bGU9XCJ3aWR0aDogNDRweDsgaGVpZ2h0OiA0NHB4OyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8IS0tIFBvcHVsYXRlZCBkeW5hbWljYWxseSBieSBKUyAtLT5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICA8IS0tIFJlc2V0IEZpbGUgKE5ldykgQnV0dG9uIC0tPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBpZD1cImhlYWRlci1yZXNldC1idG5cIlxuICAgICAgICAgICAgICBvbmNsaWNrPVwiaGFuZGxlUmVzZXQoKVwiXG4gICAgICAgICAgICAgIGNsYXNzPVwiaGlkZGVuIHB4LTQgcHktMiBiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIHRleHQtZ3JheS03MDAgZGFyazp0ZXh0LXppbmMtMjAwIGJvcmRlciBib3JkZXItZ3JheS0zMDAgZGFyazpib3JkZXItemluYy03MDAgcm91bmRlZC1tZCB0ZXh0LXNtIGZvbnQtbWVkaXVtIGhvdmVyOmJnLWdyYXktNTAgZGFyazpob3ZlcjpiZy16aW5jLTgwMCB0cmFuc2l0aW9uLWNvbG9ycyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgIHN0eWxlPVwibWluLWhlaWdodDogNDRweDtcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBOdW92byBGaWxlXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2hlYWRlcj5cblxuICAgICAgPCEtLSBNQUlOIENPTlRBSU5FUiAtLT5cbiAgICAgIDxtYWluIGNsYXNzPVwiZmxleC0xIGZsZXggZmxleC1jb2wgcC00IHNtOnAtNiBtYXgtdy02eGwgdy1mdWxsIG14LWF1dG8ganVzdGlmeS1jZW50ZXJcIiBpZD1cImFwcC1tYWluLWNvbnRlbnRcIj5cbiAgICAgICAgXG4gICAgICAgIDwhLS0gU0NIRVJNQVRBIDE6IENBUklDQU1FTlRPIChJTlBVVCBTQ1JFRU4pIC0tPlxuICAgICAgICA8ZGl2IGlkPVwic2NyZWVuLWlucHV0XCIgY2xhc3M9XCJmbGV4LTEgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXIgcHktNiBtYXgtdy0yeGwgbXgtYXV0byB3LWZ1bGwgYW5pbWF0ZS1mYWRlLWluXCI+XG4gICAgICAgICAgXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyIG1iLTggZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgcHgtMyBweS0xIGJnLWJsdWUtNTAgZGFyazpiZy1ibHVlLTk1MC80MCB0ZXh0LWJsdWUtNzAwIGRhcms6dGV4dC1ibHVlLTQwMCB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgcm91bmRlZC1mdWxsIG1iLTRcIj5cbiAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJiYWRnZS1jcHUtY29udGFpbmVyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3Bhbj5PdHRpbWl6emF0byBwZXIgU21hcnRwaG9uZSAoWmVybyBMYWcpPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGgyIGNsYXNzPVwidGV4dC0yeGwgc206dGV4dC0zeGwgZm9udC1leHRyYWJvbGQgdHJhY2tpbmctdGlnaHQgdGV4dC1ncmF5LTgwMCBkYXJrOnRleHQtd2hpdGUgbWItMiBsZWFkaW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgIEV2aXRhIGlsIExhZyBkZWwgVGVsZWZvbm9cbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICA8cCBjbGFzcz1cInRleHQtc20gdGV4dC1ncmF5LTUwMCBkYXJrOnRleHQtemluYy00MDAgbWF4LXctbWQgdGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgSW5jb2xsYSBvIGNhcmljYSB1biBmaWxlIEpTT04gcGVzYW50ZSAoZXMuIDEwIE1CKS4gTG8gZGl2aWRlcmVtbyBhbGwnaXN0YW50ZSBpbiBibG9jY2hpIGxlZ2dlcmkgZGEgNDUwIEtCLCBtb250YW5kbyB1biBwZXp6byBhbGxhIHZvbHRhIHBlciBkYXJ0aSBmbHVpZGl0w6AgYXNzb2x1dGEuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8IS0tIElNUE9TVEFaSU9OSSBESVZJU0lPTkUgLS0+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cInctZnVsbCBiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgcm91bmRlZC0yeGwgcC00IHNtOnAtNSBzaGFkb3ctc20gbWItNiBmbGV4IGZsZXgtY29sIGdhcC00IG10LTJcIiBpZD1cInNwbGl0LXBhcmFtZXRlcnNcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IG1iLTFcIj5cbiAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJiYWRnZS1zZXR0aW5ncy1jb250YWluZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC14cyBmb250LWJvbGQgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIHRleHQtZ3JheS00MDBcIj5JbXBvc3RhemlvbmkgZGkgRGl2aXNpb25lPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy0xIHNtOmdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICAgIDwhLS0gVGFyZ2V0IFNpemUgLS0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtY29sIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0zMDBcIj5EaW1lbnNpb25lIEJsb2NjbyAoVGFyZ2V0KTo8L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJncmlkIGdyaWQtY29scy00IGdhcC0xLjVcIiBpZD1cInNpemUtb3B0aW9ucy1jb250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uY2xpY2s9XCJzZXRUYXJnZXRTaXplVmFsdWUoMTAwMDAwKVwiIGlkPVwic2l6ZS1idG4tMTAwMDAwXCIgY2xhc3M9XCJweS0yIHB4LTEgcm91bmRlZC14bCB0ZXh0LXhzIGZvbnQtYm9sZCBib3JkZXIgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLXBvaW50ZXIgYmctemluYy01MCBkYXJrOmJnLXppbmMtODAwIHRleHQtemluYy03MDAgZGFyazp0ZXh0LXppbmMtMzAwIGJvcmRlci16aW5jLTIwMCBkYXJrOmJvcmRlci16aW5jLTcwMCBob3ZlcjpiZy16aW5jLTEwMCBkYXJrOmhvdmVyOmJnLXppbmMtNzAwXCIgc3R5bGU9XCJtaW4taGVpZ2h0OiA0NHB4O1wiPjEwMCBLQjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInNldFRhcmdldFNpemVWYWx1ZSgyNTAwMDApXCIgaWQ9XCJzaXplLWJ0bi0yNTAwMDBcIiBjbGFzcz1cInB5LTIgcHgtMSByb3VuZGVkLXhsIHRleHQteHMgZm9udC1ib2xkIGJvcmRlciB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlciBiZy16aW5jLTUwIGRhcms6YmctemluYy04MDAgdGV4dC16aW5jLTcwMCBkYXJrOnRleHQtemluYy0zMDAgYm9yZGVyLXppbmMtMjAwIGRhcms6Ym9yZGVyLXppbmMtNzAwIGhvdmVyOmJnLXppbmMtMTAwIGRhcms6aG92ZXI6YmctemluYy03MDBcIiBzdHlsZT1cIm1pbi1oZWlnaHQ6IDQ0cHg7XCI+MjUwIEtCPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbmNsaWNrPVwic2V0VGFyZ2V0U2l6ZVZhbHVlKDQ1MDAwMClcIiBpZD1cInNpemUtYnRuLTQ1MDAwMFwiIGNsYXNzPVwicHktMiBweC0xIHJvdW5kZWQteGwgdGV4dC14cyBmb250LWJvbGQgYm9yZGVyIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyIGJnLWJsdWUtNjAwIHRleHQtd2hpdGUgYm9yZGVyLWJsdWUtNjAwXCIgc3R5bGU9XCJtaW4taGVpZ2h0OiA0NHB4O1wiPjQ1MCBLQjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25jbGljaz1cInNldFRhcmdldFNpemVWYWx1ZSgxMDAwMDAwKVwiIGlkPVwic2l6ZS1idG4tMTAwMDAwMFwiIGNsYXNzPVwicHktMiBweC0xIHJvdW5kZWQteGwgdGV4dC14cyBmb250LWJvbGQgYm9yZGVyIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyIGJnLXppbmMtNTAgZGFyazpiZy16aW5jLTgwMCB0ZXh0LXppbmMtNzAwIGRhcms6dGV4dC16aW5jLTMwMCBib3JkZXItemluYy0yMDAgZGFyazpib3JkZXItemluYy03MDAgaG92ZXI6YmctemluYy0xMDAgZGFyazpob3ZlcjpiZy16aW5jLTcwMFwiIHN0eWxlPVwibWluLWhlaWdodDogNDRweDtcIj4xIE1CPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDwhLS0gU3BsaXQgTW9kZSAtLT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZmxleC1jb2wgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktNzAwIGRhcms6dGV4dC16aW5jLTMwMFwiPlNpbnRhc3NpICYgRGl2aXNpb25lOjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICAgICAgaWQ9XCJzcGxpdC1tb2RlLXNlbGVjdFwiXG4gICAgICAgICAgICAgICAgICBvbmNoYW5nZT1cImhhbmRsZU1vZGVDaGFuZ2UodGhpcylcIlxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgYmctemluYy01MCBkYXJrOmJnLXppbmMtODAwIHRleHQtemluYy04MDAgZGFyazp0ZXh0LXppbmMtMjAwIGJvcmRlciBib3JkZXItemluYy0yMDAgZGFyazpib3JkZXItemluYy03MDAgcm91bmRlZC14bCBweC0zIHB5LTIgdGV4dC14cyBmb250LXNlbWlib2xkIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1ibHVlLTUwMFwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT1cIm1pbi1oZWlnaHQ6IDQ0cHg7XCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYXV0b1wiIHNlbGVjdGVkPkF1dG8gKERpdmlkaSBpbiBBcnJheS9PZ2dldHRpIHZhbGlkaSk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJhcnJheV9pdGVtc1wiPkZvcnphIFRhZ2xpbyBhZCBFbGVtZW50aSBBcnJheTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm9iamVjdF9rZXlzXCI+Rm9yemEgVGFnbGlvIGEgQ2hpYXZpIFByaW1hcmllPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmF3X3RleHRcIj5UYWdsaWEgU29sbyBjb21lIFRlc3RvIFJpZ2hlIChTZW56YSBQYXJzZSk8L29wdGlvbj5cbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwhLS0gRFJPUFpPTkUgLS0+XG4gICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgIGlkPVwiZHJvcHpvbmVcIlxuICAgICAgICAgICAgb25kcmFnZW50ZXI9XCJoYW5kbGVEcmFnRW50ZXIoZXZlbnQpXCJcbiAgICAgICAgICAgIG9uZHJhZ292ZXI9XCJoYW5kbGVEcmFnT3ZlcihldmVudClcIlxuICAgICAgICAgICAgb25kcmFnbGVhdmU9XCJoYW5kbGVEcmFnTGVhdmUoZXZlbnQpXCJcbiAgICAgICAgICAgIG9uZHJvcD1cImhhbmRsZURyb3BGaWxlKGV2ZW50KVwiXG4gICAgICAgICAgICBjbGFzcz1cInctZnVsbCBmbGV4IGZsZXgtY29sIGJnLXdoaXRlIGRhcms6YmctemluYy05MDAgYm9yZGVyLTIgYm9yZGVyLWRhc2hlZCBib3JkZXItemluYy0yMDAgZGFyazpib3JkZXItemluYy04MDAgaG92ZXI6Ym9yZGVyLXppbmMtMzAwIGRhcms6aG92ZXI6Ym9yZGVyLXppbmMtNzAwIHJvdW5kZWQtMnhsIHAtNiB0cmFuc2l0aW9uLWFsbCByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW5cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBweS00IHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3LTEyIGgtMTIgcm91bmRlZC14bCBiZy1ibHVlLTUwIGRhcms6YmctemluYy04MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbWItMyBzaGFkb3ctaW5uZXJcIiBpZD1cImRyb3B6b25lLWljb24tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPCEtLSBQb3B1bGF0ZWQgZHluYW1pY2FsbHkgd2l0aCBVcGxvYWQgU1ZHIC0tPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGgzIGNsYXNzPVwidGV4dC1zbSBmb250LXNlbWlib2xkIHRleHQtZ3JheS04MDAgZGFyazp0ZXh0LXppbmMtMTAwIG1iLTFcIj5DYXJpY2EgdW4gZmlsZSBKU09OIHBlc2FudGU8L2gzPlxuICAgICAgICAgICAgICA8cCBjbGFzcz1cInRleHQteHMgdGV4dC1ncmF5LTQwMCBtYi00IG1heC13LXNtXCI+VHJhc2NpbmFsbyBxdWksIG9wcHVyZSBjbGljY2EgcGVyIHNmb2dsaWFyZSBpIHR1b2kgZmlsZSBkaXJldHRhbWVudGUgc3VsIHR1byBzbWFydHBob25lLjwvcD5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIDxsYWJlbCBcbiAgICAgICAgICAgICAgICBjbGFzcz1cImJnLWJsdWUtNjAwIGhvdmVyOmJnLWJsdWUtNzAwIGFjdGl2ZTpzY2FsZS05NSB0ZXh0LXdoaXRlIGZvbnQtc2VtaWJvbGQgdGV4dC14cyBweC02IHB5LTIuNSByb3VuZGVkLWxnIGN1cnNvci1wb2ludGVyIHNoYWRvdy1zbSB0cmFuc2l0aW9uLWFsbCBpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIlxuICAgICAgICAgICAgICAgIHN0eWxlPVwibWluLWhlaWdodDogNDRweDtcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGlucHV0IFxuICAgICAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIiBcbiAgICAgICAgICAgICAgICAgIGFjY2VwdD1cIi5qc29uLGFwcGxpY2F0aW9uL2pzb24sdGV4dC9wbGFpblwiIFxuICAgICAgICAgICAgICAgICAgY2xhc3M9XCJoaWRkZW5cIiBcbiAgICAgICAgICAgICAgICAgIG9uY2hhbmdlPVwiaGFuZGxlRmlsZVVwbG9hZCh0aGlzKVwiXG4gICAgICAgICAgICAgICAgICBvbmNsaWNrPVwidGhpcy52YWx1ZT1udWxsXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxzcGFuPlNmb2dsaWEgRmlsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgdy1mdWxsIG15LTNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImgtWzFweF0gYmctZ3JheS0yMDUgZGFyazpiZy16aW5jLTgwMCBmbGV4LTFcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm8gdXBwZXJjYXNlIHRleHQtZ3JheS00MDAgc2VsZWN0LW5vbmVcIj5vcHB1cmUgaW5jb2xsYSB0ZXN0bzwvc3Bhbj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImgtWzFweF0gYmctZ3JheS0yMDUgZGFyazpiZy16aW5jLTgwMCBmbGV4LTFcIj48L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidy1mdWxsIGZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGlkPVwiY2xpcGJvYXJkLXBhc3RlLWJ0blwiXG4gICAgICAgICAgICAgICAgb25jbGljaz1cInBhc3RlRnJvbUNsaXBib2FyZCgpXCJcbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBtYi0zIHB5LTIuNSBiZy1ibHVlLTUwLzcwIGRhcms6YmctemluYy04NTAgaG92ZXI6YmctYmx1ZS0xMDAvNzAgZGFyazpob3ZlcjpiZy16aW5jLTgwMCB0ZXh0LWJsdWUtNzAwIGRhcms6dGV4dC1ibHVlLTMwMCBib3JkZXIgYm9yZGVyLWJsdWUtMjAwLzYwIGRhcms6Ym9yZGVyLXppbmMtNzAwIGZvbnQtc2VtaWJvbGQgdGV4dC14cyByb3VuZGVkLXhsIHNoYWRvdy14cyB0cmFuc2l0aW9uLWFsbCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBnYXAtMiBjdXJzb3ItcG9pbnRlciBhY3RpdmU6c2NhbGUtWzAuOThdXCJcbiAgICAgICAgICAgICAgICBzdHlsZT1cIm1pbi1oZWlnaHQ6IDQycHg7XCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjIuNVwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwic3Ryb2tlLVsyLjVdXCIgaWQ9XCJzdmctaW5saW5lLWNsaXAtaWNvblwiPjxyZWN0IHdpZHRoPVwiOFwiIGhlaWdodD1cIjRcIiB4PVwiOFwiIHk9XCIyXCIgcng9XCIxXCIgcnk9XCIxXCIvPjxwYXRoIGQ9XCJNMTYgNGgyYTIgMiAwIDAgMSAyIDJ2MTRhMiAyIDAgMCAxLTIgMkg2YTIgMiAwIDAgMS0yLTJWNmEyIDIgMCAwIDEgMi0yaDJcIi8+PC9zdmc+XG4gICAgICAgICAgICAgICAgPHNwYW4+T3JhIHB1b2kgYW5jaGU6IEluY29sbGEgZGFnbGkgQXBwdW50aSDwn5OLPC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICBpZD1cInBhc3RlLXRleHRhcmVhXCJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkluY29sbGEgcXVpIGlsIHR1byBlbm9ybWUgY29kaWNlIEpTT04uLi5cIlxuICAgICAgICAgICAgICAgIG9uaW5wdXQ9XCJ0b2dnbGVQcm9jZXNzQnV0dG9uKClcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwidy1mdWxsIG1pbi1oLVsxNDBweF0gbWF4LWgtWzMwMHB4XSBwLTMgdGV4dC14cyBmb250LW1vbm8gYmctemluYy0xMDAgZGFyazpiZy16aW5jLTk1MCBib3JkZXIgYm9yZGVyLXppbmMtMjAwIGRhcms6Ym9yZGVyLXppbmMtODAwIHJvdW5kZWQteGwgZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMSBmb2N1czpyaW5nLWJsdWUtNTAwIHRleHQtemluYy04MDAgZGFyazp0ZXh0LXppbmMtMjAwIHBsYWNlaG9sZGVyOnRleHQtemluYy01MDAgZGFyazpwbGFjZWhvbGRlcjp0ZXh0LXppbmMtNjUwIGxlYWRpbmctbm9ybWFsXCJcbiAgICAgICAgICAgICAgPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgaWQ9XCJwcm9jZXNzLWJ0blwiXG4gICAgICAgICAgICAgICAgb25jbGljaz1cImhhbmRsZVByb2Nlc3NUZXh0KClcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiaGlkZGVuIG10LTMgdy1mdWxsIHB5LTMgYmctYmx1ZS02MDAgaG92ZXI6YmctYmx1ZS03MDAgYWN0aXZlOnNjYWxlLTk1IHRleHQtd2hpdGUgZm9udC1zZW1pYm9sZCB0ZXh0LXhzIHJvdW5kZWQteGwgc2hhZG93LXNtIHRyYW5zaXRpb24tYWxsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0xLjVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPVwibWluLWhlaWdodDogNDZweDtcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJidG4tcHJvY2Vzcy1pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuPkFuYWxpenphIGVkIEVsYWJvcmEgT3JhPC9zcGFuPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPCEtLSBHRU5FUkFURSBTQU1QTEUgLS0+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIG10LTZcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwIG1iLTIgc2VsZWN0LW5vbmVcIj5Ob24gaGFpIHVuIEpTT04gYSBwb3J0YXRhIGRpIG1hbm8/PC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgb25jbGljaz1cImhhbmRsZUdlbmVyYXRlU2FtcGxlKClcIlxuICAgICAgICAgICAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdGV4dC14cyB0ZXh0LWJsdWUtNjAwIGRhcms6dGV4dC1ibHVlLTQwMCBob3Zlcjp1bmRlcmxpbmUgZm9udC1zZW1pYm9sZCBsZWFkaW5nLXJlbGF4ZWQgYWN0aXZlOm9wYWNpdHktODAgcC0yIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgc3R5bGU9XCJtaW4taGVpZ2h0OiA0NHB4O1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzcGFuIGlkPVwic3BhcmtsZXMtaWNvbi1jb250YWluZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuPkdlbmVyYSBlZCBBbmFsaXp6YSB1biBmaWxlIGRpIHRlc3QgZGEgNSBNQiDimqE8L3NwYW4+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIFNDSEVSTUFUQSAyOiBFU1BMT1JBVE9SRSBERUkgUEVaWkkgKERBU0hCT0FSRCBTQ1JFRU4pIC0tPlxuICAgICAgICA8ZGl2IGlkPVwic2NyZWVuLWRhc2hib2FyZFwiIGNsYXNzPVwiaGlkZGVuIGZsZXgtMSBmbGV4IGZsZXgtY29sIG1kOmZsZXgtcm93IGdhcC01IGl0ZW1zLXN0cmV0Y2ggaC1mdWxsIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICAgIFxuICAgICAgICAgIDwhLS0gU0lERUJBUiAtLT5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidy1mdWxsIG1kOnctWzI2MHB4XSBzaHJpbmstMCBmbGV4IGZsZXgtY29sIGdhcC0zXCIgaWQ9XCJuYXZpZ2F0aW9uLXNpZGViYXJcIj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPCEtLSBGaWxlIEluZm8gQ2FyZCAtLT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgcm91bmRlZC0yeGwgcC00IGZsZXggZmxleC1jb2wgZ2FwLTIgc2hhZG93LXNtXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1bMTBweF0gZm9udC1ib2xkIHRleHQtZ3JheS00MDAgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIGZvbnQtbW9ubyBzZWxlY3Qtbm9uZVwiPkZpbGUgQ2FyaWNhdG88L3NwYW4+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1zdGFydCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwic2lkZWJhci1maWxldGV4dC1pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtY29sIG1pbi13LTAgZmxleC0xXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cImluZm8tZmlsZS1uYW1lXCIgY2xhc3M9XCJ0ZXh0LXNtIGZvbnQtYm9sZCB0ZXh0LWdyYXktODAwIGRhcms6dGV4dC16aW5jLTEwMCB0cnVuY2F0ZVwiPmRvY3VtZW50by5qc29uPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJpbmZvLXRvdGFsLXNpemUtc2lkZVwiIGNsYXNzPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwIGZvbnQtbW9ub1wiPlRvdGFsZTogMCBCPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaC1bMXB4XSBiZy1ncmF5LTE1MCBkYXJrOmJnLXppbmMtODAwIG15LTFcIj48L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbCBnYXAtMiBtdC0xXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5EaW1lbnNpb25lIFRvdGFsZTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiaW5mby10b3RhbC1zaXplXCIgY2xhc3M9XCJweC0yIHB5LTAuNSBiZy1ibHVlLTUwIGRhcms6YmctYmx1ZS05NTAgdGV4dC1ibHVlLTcwMCBkYXJrOnRleHQtYmx1ZS00MDAgdGV4dC14cyBmb250LWJvbGQgcm91bmRlZFwiPjAgTUI8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5MaW1pdGUgQmxvY2NvPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJpbmZvLXRhcmdldC1saW1pdFwiIGNsYXNzPVwicHgtMiBweS0wLjUgYmctZ3JlZW4tNTAgZGFyazpiZy1ncmVlbi05NTAgdGV4dC1ncmVlbi03MDAgZGFyazp0ZXh0LWdyZWVuLTQwMCB0ZXh0LXhzIGZvbnQtYm9sZCByb3VuZGVkXCI+NDUwIEtCPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+UGFydGkgVG90YWxpPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJpbmZvLXRvdGFsLWNodW5rc1wiIGNsYXNzPVwicHgtMiBweS0wLjUgYmctcHVycGxlLTUwIGRhcms6YmctcHVycGxlLTk1MCB0ZXh0LXB1cnBsZS03MDAgZGFyazp0ZXh0LXB1cnBsZS00MDAgdGV4dC14cyBmb250LWJvbGQgcm91bmRlZFwiPjA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgaWQ9XCJpbmZvLWVycm9yLWJveFwiIGNsYXNzPVwiaGlkZGVuIG10LTIgdGV4dC1bMTBweF0gYmctYW1iZXItNTAwLzEwIHRleHQtYW1iZXItNTAwIHAtMiByb3VuZGVkLWxnIGxlYWRpbmctcmVsYXhlZFwiPjwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDwhLS0gTW9iaWxlIENodW5rIFBpY2tlciBEcm9wZG93biAodmlzaWJsZSBvbmx5IG9uIG1vYmlsZSkgLS0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmxvY2sgbWQ6aGlkZGVuIGZsZXggZmxleC1jb2wgZ2FwLTFcIiBpZD1cIm1vYmlsZS1jaHVuay1waWNrZXJcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1ncmF5LTQwMCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHB4LTFcIj5WYWkgYWwgQmxvY2NvOjwvbGFiZWw+XG4gICAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICBpZD1cIm1vYmlsZS1jaHVuay1zZWxlY3RcIlxuICAgICAgICAgICAgICAgIG9uY2hhbmdlPVwic2VsZWN0Q2h1bmsoTnVtYmVyKHRoaXMudmFsdWUpKVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ3LWZ1bGwgYmctd2hpdGUgZGFyazpiZy16aW5jLTkwMCB0ZXh0LXppbmMtODAwIGRhcms6dGV4dC16aW5jLTEwMCBib3JkZXIgYm9yZGVyLXppbmMtMjAwIGRhcms6Ym9yZGVyLXppbmMtODAwIHJvdW5kZWQteGwgcHgtMyBweS0yLjUgdGV4dC14cyBmb250LWJvbGQgc2hhZG93LXNtIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy16aW5jLTQwMFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9XCJtaW4taGVpZ2h0OiA0OHB4O1wiXG4gICAgICAgICAgICAgID48L3NlbGVjdD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8IS0tIERlc2t0b3AgU2lkZWJhciBMaXN0IC0tPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhpZGRlbiBtZDpmbGV4IGZsZXgtY29sIGZsZXgtMSBiZy13aGl0ZSBkYXJrOmJnLXppbmMtOTAwIGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy04MDAgcm91bmRlZC0yeGwgb3ZlcmZsb3ctaGlkZGVuIHAtMyBzaGFkb3ctc20gaC1bNDAwcHhdXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LWdyYXktNDAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0yIHB4LTFcIj5FbGVuY28gQmxvY2NoaTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwiZGVza3RvcC1jaHVua3MtbGlzdFwiIGNsYXNzPVwiZmxleC0xIG92ZXJmbG93LXktYXV0byBwci0xIGZsZXggZmxleC1jb2wgZ2FwLTEuNSBzY3JvbGxiYXItaGlkZVwiPlxuICAgICAgICAgICAgICAgIDwhLS0gQ2h1bmtzIGluamVjdGVkIGR5bmFtaWNhbGx5IC0tPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8IS0tIEFDVElWRSBCTE9DIFZJRVdQT1JUIC0tPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LTEgZmxleCBmbGV4LWNvbCBnYXAtNCBtaW4tdy0wXCIgaWQ9XCJ2aWV3ZXItc3RhZ2VcIj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPCEtLSBDb2RlYm94IENhcmQgLS0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBmbGV4LWNvbCBmbGV4LTEgYmctd2hpdGUgZGFyazpiZy16aW5jLTkwMCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGRhcms6Ym9yZGVyLXppbmMtODAwIHNoYWRvdy1zbSBvdmVyZmxvdy1oaWRkZW4gaC1mdWxsXCI+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICA8IS0tIFZpZXdlciBIZWFkZXIgLS0+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4IGZsZXgtY29sIHNtOmZsZXgtcm93IGl0ZW1zLXN0cmV0Y2ggc206aXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTQgZ2FwLTMgYm9yZGVyLWIgYm9yZGVyLWdyYXktMjUwIGRhcms6Ym9yZGVyLXppbmMtODAwIGJnLWdyYXktNTAgZGFyazpiZy16aW5jLTkwMC81MFwiIGlkPVwianNvbi12aWV3ZXItaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yLjVcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbGV4LWNvbFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LWdyYXktNTAwIGZvbnQtc2VtaWJvbGQgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+VklFV0lORyBQQVJUOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInZpZXdpbmctcGFydC1iYWRnZVwiIGNsYXNzPVwidGV4dC14cyBmb250LW1vbm8gZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlIGJnLWJsdWUtNjAwIHB4LTIuNSBweS0wLjUgcm91bmRlZCBzaGFkb3ctc21cIj4wMTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwidmlld2luZy1wYXJ0LW1ldGFcIiBjbGFzcz1cInRleHQtWzEwcHhdIHRleHQtZ3JheS00MDAgZm9udC1tb25vIG10LTAuNSBibG9ja1wiPlNpemU6IDAgS0I8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDwhLS0gSWNvbnMgJiBUcmFmZmljIGRvdHMgYW5kIEJ1dHRvbnMgLS0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBzbTpqdXN0aWZ5LWVuZCBnYXAtMyBzbTpzZWxmLWF1dG8gc2VsZi1zdHJldGNoXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBzcGFjZS14LTEgaG92ZXI6b3BhY2l0eS04MCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctMi41IGgtMi41IHJvdW5kZWQtZnVsbCBiZy1yZWQtNTAwIG9wYWNpdHktODBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctMi41IGgtMi41IHJvdW5kZWQtZnVsbCBiZy15ZWxsb3ctNTAwIG9wYWNpdHktODBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInctMi41IGgtMi41IHJvdW5kZWQtZnVsbCBiZy1ncmVlbi01MDAgb3BhY2l0eS04MFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoLTQgdy1bMXB4XSBiZy1ncmF5LTM1MCBkYXJrOmJnLXppbmMtODAwIGhpZGRlbiBzbTpibG9ja1wiPjwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8IS0tIFRvZ2dsZSBjb2xvcnMgLS0+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwidG9nZ2xlSGlnaGxpZ2h0U3ludGF4KClcIlxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwib3B0LXRvZ2dsZS1jb2xvcnNcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwicC0yIGJvcmRlciBib3JkZXItZ3JheS0yNTAgZGFyazpib3JkZXItemluYy04MDAgYmctd2hpdGUgZGFyazpiZy16aW5jLTg1MCByb3VuZGVkLWxnIHRleHQtZ3JheS01MDAgZGFyazp0ZXh0LXppbmMtMzAwIGhvdmVyOmJnLWdyYXktNTAgZGFyazpob3ZlcjpiZy16aW5jLTgwMCB0cmFuc2l0aW9uLWFsbCBhY3RpdmU6c2NhbGUtOTUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwibWluLXdpZHRoOiAzOHB4OyBtaW4taGVpZ2h0OiAzOHB4O1wiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8IS0tIFBvcHVsYXRlZCBkeW5hbWljYWxseSAtLT5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgPCEtLSBDb3B5IGNodW5rIGNvbnRlbnQgLS0+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwiY29weUFjdGl2ZUNodW5rKClcIlxuICAgICAgICAgICAgICAgICAgICAgIGlkPVwiYnRuLWNvcHktY2h1bmtcIlxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgcHgtMyBweS0xLjUgdGV4dC14cyBmb250LW1lZGl1bSBib3JkZXIgcm91bmRlZC1sZyBiZy13aGl0ZSBkYXJrOmJnLXppbmMtODAwIHRleHQtZ3JheS03MDAgZGFyazp0ZXh0LXppbmMtMjAwIGJvcmRlci1ncmF5LTI1MCBkYXJrOmJvcmRlci16aW5jLTcwMCBob3ZlcjpiZy1ncmF5LTUwIHRyYW5zaXRpb24tYWxsIGFjdGl2ZTpzY2FsZS05NSBzaGFkb3cteHMgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPVwibWluLWhlaWdodDogMzhweDtcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJjb3B5LWljb24tcGxhY2Vob2xkZXJcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJjb3B5LWJ0bi10ZXh0XCI+Q29weTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICAgICAgPCEtLSBTYXZlIGNodW5rIGNvbnRlbnQgLS0+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrPVwiZG93bmxvYWRBY3RpdmVDaHVuaygpXCJcbiAgICAgICAgICAgICAgICAgICAgICBpZD1cImJ0bi1zYXZlLWNodW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHB4LTMgcHktMS41IGJnLWJsdWUtNjAwIHRleHQtd2hpdGUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtbWVkaXVtIGhvdmVyOmJnLWJsdWUtNzAwIGN1cnNvci1wb2ludGVyIGFjdGl2ZTpzY2FsZS05NSBzaGFkb3ctc20gYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCB0cmFuc2l0aW9uLWFsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9XCJtaW4taGVpZ2h0OiAzOHB4O1wiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInNhdmUtaWNvbi1wbGFjZWhvbGRlclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5TYXZlPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8IS0tIFdhcm5pbmcgZm9yIGxhcmdlIGhpZ2hsaWdodGVyIGZpbGVzIC0tPlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwiaGlnaGxpZ2h0LXdhcm5pbmdcIiBjbGFzcz1cImhpZGRlbiBmbGV4IGl0ZW1zLXN0YXJ0IGdhcC0yIGJnLWFtYmVyLTUwIGRhcms6YmctYW1iZXItOTUwLzIwIHRleHQtYW1iZXItODAwIGRhcms6dGV4dC1hbWJlci00MDAgcC0yLjUgdGV4dC14cyBib3JkZXItYiBib3JkZXItYW1iZXItMTAwIGRhcms6Ym9yZGVyLWFtYmVyLTk1MC80MFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwid2Fybi1hbGVydC1pY29uLWNvbnRhaW5lclwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj5RdWVzdG8gYmxvY2NvIMOoIGVub3JtZS4gRXZpZGVuemlhdG9yZSBzcGVudG8gcGVyIHR1dGVsYXJlIGxhIGZsdWlkaXTDoCBzdWwgdGVsZWZvbm8uPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8IS0tIElubGluZSBTZWFyY2ggQmFyIGluc2lkZSBDb2RlIFBhbmVsIC0tPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHgtNCBweS0yIGJnLXdoaXRlIGRhcms6YmctemluYy05MDAgYm9yZGVyLWIgYm9yZGVyLWdyYXktMjAwIGRhcms6Ym9yZGVyLXppbmMtODAwIGZsZXggZmxleC13cmFwIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTJcIiBpZD1cInNlYXJjaC1iYXItY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJlbGF0aXZlIGZsZXgtMSBtaW4tdy1bMTUwcHhdXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBpZD1cInNlYXJjaC1pY29uLXBsYWNlaG9sZGVyXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJjaHVuay1zZWFyY2gtaW5wdXRcIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkNlcmNhIGluIHF1ZXN0byBibG9jY28uLi5cIlxuICAgICAgICAgICAgICAgICAgICBvbmlucHV0PVwiaGFuZGxlU2VhcmNoU2VhcmNoKClcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBwbC05IHByLTQgcHktMS41IGJnLWdyYXktNTAgZGFyazpiZy16aW5jLTgwMCBib3JkZXIgYm9yZGVyLWdyYXktMjUwIGRhcms6Ym9yZGVyLXppbmMtNzAwIHJvdW5kZWQtbGcgdGV4dC14cyBwbGFjZWhvbGRlcjp0ZXh0LWdyYXktNDAwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLTEgZm9jdXM6cmluZy1ibHVlLTUwMCB0ZXh0LXppbmMtOTAwIGRhcms6dGV4dC1uZXV0cmFsLTE1MFwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPVwibWluLWhlaWdodDogMzZweDtcIlxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic2VhcmNoLXJlc3VsdHMtY29udHJvbHNcIiBjbGFzcz1cImhpZGRlbiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJzZWFyY2gtY291bnRlclwiIGNsYXNzPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwIGRhcms6dGV4dC16aW5jLTQwMCBmb250LW1vbm9cIj4wIG9mIDA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxleCBnYXAtMVwiIGlkPVwic2VhcmNoLW5hdi1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25jbGljaz1cIm5hdmlnYXRlU2VhcmNoKC0xKVwiIGNsYXNzPVwicC0xIHB4LTIuNSBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGRhcms6Ym9yZGVyLXppbmMtNzU1IHJvdW5kZWQtbGcgdGV4dC14cyBob3ZlcjpiZy1ncmF5LTEwNSBkYXJrOmhvdmVyOmJnLXppbmMtODAwIGJnLXdoaXRlIGRhcms6YmctemluYy04MDAgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0yMDBcIiBzdHlsZT1cIm1pbi1oZWlnaHQ6IDM0cHg7XCI+4oaQPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25jbGljaz1cIm5hdmlnYXRlU2VhcmNoKDEpXCIgY2xhc3M9XCJwLTEgcHgtMi41IGJvcmRlciBib3JkZXItZ3JheS0yMDAgZGFyazpib3JkZXItemluYy03NTUgcm91bmRlZC1sZyB0ZXh0LXhzIGhvdmVyOmJnLWdyYXktMTA1IGRhcms6aG92ZXI6YmctemluYy04MDAgYmctd2hpdGUgZGFyazpiZy16aW5jLTgwMCB0ZXh0LWdyYXktNzAwIGRhcms6dGV4dC16aW5jLTIwMFwiIHN0eWxlPVwibWluLWhlaWdodDogMzRweDtcIj7ihpI8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8IS0tIENvZGUgcHJlIEFyZWEgc3R5bGVkIGluc2lkZSBTbGF0ZSBiYWNrZ3JvdW5kIC0tPlxuICAgICAgICAgICAgICA8ZGl2IGlkPVwiY29kZS12aWV3cG9ydFwiIGNsYXNzPVwiZmxleC0xIG92ZXJmbG93LWhpZGRlbiByZWxhdGl2ZSBiZy1bIzFFMjkzQl0gYm9yZGVyIGJvcmRlci1ncmF5LTg1MCBkYXJrOmJvcmRlci1ncmF5LTgwMCByb3VuZGVkLWItMnhsXCI+XG4gICAgICAgICAgICAgICAgPHByZVxuICAgICAgICAgICAgICAgICAgaWQ9XCJyYXctY29kZS1ibG9ja1wiXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cInctZnVsbCBoLVs2MHZoXSBtYXgtaC1bODB2aF0gb3ZlcmZsb3ctYXV0byBwLTUgdGV4dC1bMTJweF0gbGVhZGluZy1yZWxheGVkIGZvbnQtbW9ubyB3aGl0ZXNwYWNlLXByZSB0ZXh0LWJsdWUtMzAwIHNlbGVjdC10ZXh0IG91dGxpbmUtbm9uZSBzY3JvbGxiYXItaGlkZVwiXG4gICAgICAgICAgICAgICAgPjwvcHJlPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDwhLS0gTG93ZXIgbmF2aWdhdGlvbiBidXR0b25zIC0tPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJnLXdoaXRlIGRhcms6YmctemluYy05MDAgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBkYXJrOmJvcmRlci16aW5jLTgwMCByb3VuZGVkLTJ4bCBwLTMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0yIHNoYWRvdy1zbVwiIGlkPVwiY2h1bmstbmF2aWdhdGlvbi1iYXJcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGlkPVwibmF2LWJ0bi1wcmV2XCJcbiAgICAgICAgICAgICAgICBvbmNsaWNrPVwiaGFuZGxlUHJldkNodW5rKClcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSBweC02IHB5LTIgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtYm9sZCB0cmFuc2l0aW9uLWFsbCBhY3RpdmU6c2NhbGUtOTUgY3Vyc29yLXBvaW50ZXIgYm9yZGVyIGJvcmRlci1ncmF5LTM1MCBkYXJrOmJvcmRlci16aW5jLTcwMCB0ZXh0LWdyYXktNzUwIGJnLXdoaXRlIGRhcms6YmctemluYy04MDAgaG92ZXI6YmctZ3JheS01MCB0ZXh0LWdyYXktNzAwIGRhcms6dGV4dC16aW5jLTEwMFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9XCJtaW4td2lkdGg6IDEwMHB4OyBtaW4taGVpZ2h0OiA0OHB4O1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3BhbiBpZD1cIm5hdi1wcmV2LWljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4+UFJFVklPVVMgUEFSVDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInB4LTQgcHktMiBiZy1ncmF5LTUwIGRhcms6YmctemluYy04MDAgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMjAwIGRhcms6Ym9yZGVyLXppbmMtNzUwXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gaWQ9XCJuYXYtYnRuLXN0YXR1cy1iYWRnZVwiIGNsYXNzPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0zMDAgdHJhY2tpbmctd2lkZXIgZm9udC1tb25vXCI+UEFSVCAxIE9GIDE8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBpZD1cIm5hdi1idG4tbmV4dFwiXG4gICAgICAgICAgICAgICAgb25jbGljaz1cImhhbmRsZU5leHRDaHVuaygpXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgcHgtNiBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1IGN1cnNvci1wb2ludGVyIGJnLWJsdWUtNjAwIHRleHQtd2hpdGUgaG92ZXI6YmctYmx1ZS03NTAgc2hhZG93LW1kXCJcbiAgICAgICAgICAgICAgICBzdHlsZT1cIm1pbi13aWR0aDogMTAwcHg7IG1pbi1oZWlnaHQ6IDQ4cHg7XCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuPk5FWFQgUEFSVDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBpZD1cIm5hdi1uZXh0LWljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9tYWluPlxuXG4gICAgICA8IS0tIEZPT1RFUiAtLT5cbiAgICAgIDxmb290ZXIgY2xhc3M9XCJweS00IHRleHQtY2VudGVyIHRleHQtemluYy00MDAgZGFyazp0ZXh0LXppbmMtNjUwIHRleHQteHMgYm9yZGVyLXQgYm9yZGVyLXppbmMtMjAwLzUwIGRhcms6Ym9yZGVyLXppbmMtOTAwLzUwIG10LWF1dG9cIiBpZD1cImFwcC1mb290ZXJcIj5cbiAgICAgICAgVmlzdWFsaXp6YXRvcmUgU3BsaXQgSlNPTiDigKIgTmVzc3VuIGRhdG8gaW52aWF0byBhbCBzZXJ2ZXIsIGxhdm9yYSBpbiBsb2NhbGUuXG4gICAgICA8L2Zvb3Rlcj5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gTUFJTiBFTkdJTkUgQ09SRSBJTiBWQU5JTExBIEpBVkFTQ1JJUFQgRk9SIElOU1RBTlQgTE9BRElORyAtLT5cbiAgICA8c2NyaXB0PlxuICAgICAgLy8gU1ZHcyBDb25zdGFudHMgbWF0Y2hpbmcgTHVjaWRlIHBlcmZlY3RseVxuICAgICAgY29uc3QgU1VOX1NWRyA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJsdWNpZGUgbHVjaWRlLXN1blwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiNFwiLz48cGF0aCBkPVwiTTEyIDJ2MlwiLz48cGF0aCBkPVwiTTEyIDIwdjJcIi8+PHBhdGggZD1cIm00LjkzIDQuOTMgMS40MSAxLjQxXCIvPjxwYXRoIGQ9XCJtMTcuNjYgMTcuNjYgMS40MSAxLjQxXCIvPjxwYXRoIGQ9XCJNMiAxMmgyXCIvPjxwYXRoIGQ9XCJNMjAgMTJoMlwiLz48cGF0aCBkPVwibTYuMzQgMTcuNjYtMS40MSAxLjQxXCIvPjxwYXRoIGQ9XCJtMTkuMDcgNC45My0xLjQxIDEuNDFcIi8+PC9zdmc+JztcbiAgICAgIGNvbnN0IE1PT05fU1ZHID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImx1Y2lkZSBsdWNpZGUtbW9vblwiPjxwYXRoIGQ9XCJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTlaXCIvPjwvc3ZnPic7XG4gICAgICBjb25zdCBFWUVfU1ZHID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImx1Y2lkZSBsdWNpZGUtZXllXCI+PHBhdGggZD1cIk0yLjA2MiAxMi4zNDhhMSAxIDAgMCAxIDAtLjY5NiAxMC43NSAxMC43NSAwIDAgMSAxOS44NzYgMCAxIDEgMCAwIDEgMCAuNjk2IDEwLjc1IDEwLjc1IDAgMCAxLTE5Ljg3NiAwelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+PC9zdmc+JztcbiAgICAgIGNvbnN0IEVZRU9GRl9TVkcgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwibHVjaWRlIGx1Y2lkZS1leWUtb2ZmXCI+PHBhdGggZD1cIk05Ljg4IDkuODhhMyAzIDAgMSAwIDQuMjQgNC4yNFwiLz48cGF0aCBkPVwiTTEwLjczIDUuMDhBMTAuNDMgMTAuNDMgMCAwIDEgMTIgNWM3IDAgMTAgNyAxMCA3YTEzLjE2IDEzLjE2IDAgMCAxLTEuNjcgMi42OFwiLz48cGF0aCBkPVwiTTYuNjEgNi42MUExMy41MiAxMy41MiAwIDAgMCAyIDEyczMgNyAxMCA3YTkuNzQgOS43NCAwIDAgMCA1LjM5LTEuNjFcIi8+PGxpbmUgeDE9XCIyXCIgeDI9XCIyMlwiIHkxPVwiMlwiIHkyPVwiMjJcIi8+PC9zdmc+JztcbiAgICAgIGNvbnN0IENPUFlfU1ZHID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTNcIiBoZWlnaHQ9XCIxM1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cmVjdCB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiB4PVwiOFwiIHk9XCI4XCIgcng9XCIyXCIgcnk9XCIyXCIvPjxwYXRoIGQ9XCJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyXCIvPjwvc3ZnPic7XG4gICAgICBjb25zdCBDSEVDS19TVkcgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxM1wiIGhlaWdodD1cIjEzXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiM1wiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwic3Ryb2tlLVszXVwiPjxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiLz48L3N2Zz4nO1xuICAgICAgY29uc3QgRE9XTkxPQURfU1ZHID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTNcIiBoZWlnaHQ9XCIxM1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjcgMTAgMTIgMTUgMTcgMTBcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjE1XCIgeTI9XCIzXCIvPjwvc3ZnPic7XG4gICAgICBjb25zdCBTRUFSQ0hfU1ZHID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yNVwiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImFic29sdXRlIGxlZnQtMyB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgdGV4dC1ncmF5LTQwMFwiPjxjaXJjbGUgY3g9XCIxMVwiIGN5PVwiMTFcIiByPVwiOFwiLz48cGF0aCBkPVwibTIxIDIxLTQuMy00LjNcIi8+PC9zdmc+JztcbiAgICAgIGNvbnN0IENIRVZST05fTEVGVF9TVkcgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwb2x5bGluZSBwb2ludHM9XCIxNSAxOCA5IDEyIDE1IDZcIi8+PC9zdmc+JztcbiAgICAgIGNvbnN0IENIRVZST05fUklHSFRfU1ZHID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cG9seWxpbmUgcG9pbnRzPVwiOSAxOCAxNSAxMiA5IDZcIi8+PC9zdmc+JztcbiAgICAgIGNvbnN0IEZJTEVURVhUX1NWRyA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIgY2xhc3M9XCJ0ZXh0LWJsdWUtNjAwIG10LTEgc2hyaW5rLTBcIj48cGF0aCBkPVwiTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3WlwiLz48cGF0aCBkPVwiTTE0IDJ2NGEyIDIgMCAwIDAgMiAyaDRcIi8+PHBhdGggZD1cIk0xMCA5SDhcIi8+PHBhdGggZD1cIk0xNiAxM0g4XCIvPjxwYXRoIGQ9XCJNMTYgMTdIOFwiLz48L3N2Zz4nO1xuICAgICAgY29uc3QgQ1BVX1NWRyA9ICc8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiMTJcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyLjVcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cImlubGluZSBzdHJva2UtWzIuNV0gbXItMS41XCI+PHJlY3QgeD1cIjE2XCIgeT1cIjE2XCIgd2lkdGg9XCI2XCIgaGVpZ2h0PVwiNlwiIHJ4PVwiMVwiLz48cmVjdCB4PVwiMlwiIHk9XCIxNlwiIHdpZHRoPVwiNlwiIGhlaWdodD1cIjZcIiByeD1cIjFcIi8+PHJlY3QgeD1cIjlcIiB5PVwiOVwiIHdpZHRoPVwiNlwiIGhlaWdodD1cIjZcIiByeD1cIjFcIi8+PHJlY3QgeD1cIjE2XCIgeT1cIjJcIiB3aWR0aD1cIjZcIiBoZWlnaHQ9XCI2XCIgcng9XCIxXCIvPjxyZWN0IHg9XCIyXCIgeT1cIjJcIiB3aWR0aD1cIjZcIiBoZWlnaHQ9XCI2XCIgcng9XCIxXCIvPjxwYXRoIGQ9XCJNOSAxdjhcIi8+PHBhdGggZD1cIk0xNSAxdjhcIi8+PHBhdGggZD1cIk05IDE1djhcIi8+PHBhdGggZD1cIk0xNSAxNXY4XCIvPjxwYXRoIGQ9XCJNMSA5aDhcIi8+PHBhdGggZD1cIk0xIDE1aDhcIi8+PHBhdGggZD1cIk0xNSA5aDlcIi8+PHBhdGggZD1cIk0xNSAxNWg5XCIvPjwvc3ZnPic7XG4gICAgICBjb25zdCBTRVRUSU5HU19TVkcgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiaW5saW5lIHRleHQtYmx1ZS02MDAgbXItMS41XCI+PHBhdGggZD1cIk0xMi4yMiAyaC0uNDRhMiAyIDAgMCAwLTIgMnYuMThhMiAyIDAgMCAxLTEgMS43M2wtLjQzLjI1YTIgMiAwIDAgMS0yIDBsLS4xNS0uMDhhMiAyIDAgMCAwLTIuNzMuNzNsLS4yMi4zOGEyIDIgMCAwIDAgLjczIDIuNzNsLjE1LjFhMiAyIDAgMCAxIDEgMS43MnYuNTFhMiAyIDAgMCAxLTEgMS43NGwtLjE1LjA5YTIgMiAwIDAgMC0uNzMgMi43M2wuMjIuMzhhMiAyIDAgMCAwIDIuNzMuNzNsLjE1LS4wOGEyIDIgMCAwIDEgMiAwbC40My4yNWEyIDIgMCAwIDEgMSAxLjczVjIwYTIgMiAwIDAgMCAyIDJoLjQ0YTIgMiAwIDAgMCAyLTJ2LS4xOGEyIDIgMCAwIDEgMS0xLjczbC40My0uMjVhMiAyIDAgMCAxIDIgMGwuMTUuMDhhMiAyIDAgMCAwIDIuNzMtLjczbC4yMi0uMzlhMiAyIDAgMCAwLS43My0yLjczbC0uMTUtLjA4YTIgMiAwIDAgMS0xLTEuNzR2LS41YTIgMiAwIDAgMSAxLTEuNzRsLjE1LS4xYTIgMiAwIDAgMCAuNzMtMi43M2wtLjIyLS4zOGEyIDIgMCAwIDAtMi43My0uNzNsLS4xNS4wOGEyIDIgMCAwIDEtMiAwbC0uNDMtLjI1YTIgMiAwIDAgMS0xLTEuNzNWNGEyIDIgMCAwIDAtMi0yelwiLz48Y2lyY2xlIGN4PVwiMTJcIiBjeT1cIjEyXCIgcj1cIjNcIi8+PC9zdmc+JztcbiAgICAgIGNvbnN0IFVQTE9BRF9TVkcgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyMlwiIGhlaWdodD1cIjIyXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwidGV4dC1ibHVlLTYwMCBkYXJrOnRleHQtYmx1ZS00MDBcIj48cGF0aCBkPVwiTTIxIDE1djRhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJ2LTRcIi8+PHBvbHlsaW5lIHBvaW50cz1cIjE3IDggMTIgMyA3IDhcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTJcIiB5MT1cIjNcIiB5Mj1cIjE1XCIvPjwvc3ZnPic7XG4gICAgICBjb25zdCBTUEFSS0xFU19TVkcgPSAnPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxNFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiIGNsYXNzPVwiaW5saW5lIG1yLTEuNVwiPjxwYXRoIGQ9XCJtMTIgMy0xLjkxMiA1LjgxM2EyIDIgMCAwIDEtMS4yNzUgMS4yNzVMMyAxMmw1LjgxMyAxLjkxMmEyIDIgMCAwIDEgMS4yNzUgMS4yNzVMMTIgMjFsMS45MTItNS44MTNhMiAyIDAgMCAxIDEuMjc1LTEuMjc1TDIxIDEybC01LjgxMy0xLjkxMmEyIDIgMCAwIDEtMS4yNzUtMS4yNzVMMTIgM1pcIi8+PHBhdGggZD1cIm01IDMgMSAyLjVMOC41IDYgNiA3IDUgOS41IDQgNyAxLjUgNiA0IDUgNSAzWlwiLz48cGF0aCBkPVwibTE5IDE3IDEgMi41IDIuNS41LTIuNSAxLTEgMi41LTEtMi41LTIuNS0xIDIuNS0xIDEtMi41WlwiLz48L3N2Zz4nO1xuICAgICAgY29uc3QgQUxFUlRfU1ZHID0gJzxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTRcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIiBjbGFzcz1cIm10LTAuNSBzaHJpbmstMCB0ZXh0LWFtYmVyLTYwMCBkYXJrOnRleHQtYW1iZXItNDAwXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiLz48bGluZSB4MT1cIjEyXCIgeDI9XCIxMlwiIHkxPVwiOFwiIHkyPVwiMTJcIi8+PGxpbmUgeDE9XCIxMlwiIHgyPVwiMTIuMDFcIiB5MT1cIjE2XCIgeTI9XCIxNlwiLz48L3N2Zz4nO1xuXG4gICAgICAvLyBMaXZlIFRoZW1lIFN0YXRlIFNldHVwXG4gICAgICBsZXQgaXNEYXJrTW9kZSA9ICR7aXNEYXJrTW9kZURlZmF1bHR9O1xuXG4gICAgICAvLyBBcHAgRW5naW5lIFN0YXRlIFZhcmlhYmxlc1xuICAgICAgbGV0IHJhd0Z1bGxUZXh0ID0gJyc7IC8vIFN0b3JlcyBjb21wbGV0ZSBvcmlnaW5hbCBwcmlzdGluZSBuZXN0ZWQgSlNPTiBzdHJpbmdcbiAgICAgIGxldCBpbnB1dFRleHQgPSAnJztcbiAgICAgIGxldCB0YXJnZXRTaXplID0gNDUwMDAwO1xuICAgICAgbGV0IGNodW5rcyA9IFtdO1xuICAgICAgbGV0IGFjdGl2ZUNodW5rSW5kZXggPSAwO1xuICAgICAgbGV0IGZpbGVOYW1lID0gJyc7XG4gICAgICBsZXQgZm9yY2VNb2RlID0gJ2F1dG8nO1xuICAgICAgbGV0IG1vZGVVc2VkID0gJ3Jhd190ZXh0JztcbiAgICAgIGxldCBoaWdobGlnaHRTeW50YXggPSB0cnVlO1xuICAgICAgbGV0IHRvdGFsSW5wdXRTaXplQnl0ZXMgPSAwO1xuXG4gICAgICAvLyBJbi1jaHVuayBMb2NhbCBTZWFyY2ggU3RhdGVzXG4gICAgICBsZXQgc2VhcmNoVGVybSA9ICcnO1xuICAgICAgbGV0IHNlYXJjaFJlc3VsdHMgPSBbXTtcbiAgICAgIGxldCBzZWFyY2hJbmRleCA9IC0xO1xuXG4gICAgICAvLyBTZXR1cCBpbml0aWFsIHZpc3VhbCBhc3NldHNcbiAgICAgIGZ1bmN0aW9uIGluaXRpYWxpemVBc3NldHMoKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWRnZS1jcHUtY29udGFpbmVyJykuaW5uZXJIVE1MID0gQ1BVX1NWRztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhZGdlLXNldHRpbmdzLWNvbnRhaW5lcicpLmlubmVySFRNTCA9IFNFVFRJTkdTX1NWRztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3B6b25lLWljb24tY29udGFpbmVyJykuaW5uZXJIVE1MID0gVVBMT0FEX1NWRztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0bi1wcm9jZXNzLWljb24nKS5pbm5lckhUTUwgPSBDSEVDS19TVkc7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGFya2xlcy1pY29uLWNvbnRhaW5lcicpLmlubmVySFRNTCA9IFNQQVJLTEVTX1NWRztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGViYXItZmlsZXRleHQtaWNvbicpLmlubmVySFRNTCA9IEZJTEVURVhUX1NWRztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvcHktaWNvbi1wbGFjZWhvbGRlcicpLmlubmVySFRNTCA9IENPUFlfU1ZHO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZS1pY29uLXBsYWNlaG9sZGVyJykuaW5uZXJIVE1MID0gRE9XTkxPQURfU1ZHO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2Fybi1hbGVydC1pY29uLWNvbnRhaW5lcicpLmlubmVySFRNTCA9IEFMRVJUX1NWRztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1pY29uLXBsYWNlaG9sZGVyJykuaW5uZXJIVE1MID0gU0VBUkNIX1NWRztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25hdi1wcmV2LWljb24nKS5pbm5lckhUTUwgPSBDSEVWUk9OX0xFRlRfU1ZHO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LW5leHQtaWNvbicpLmlubmVySFRNTCA9IENIRVZST05fUklHSFRfU1ZHO1xuXG4gICAgICAgIC8vIFJlbmRlciBjb3JyZWN0IFN1biBvciBNb29uIGluc2lkZSB0b2dnbGUgYWN0aW9uXG4gICAgICAgIHVwZGF0ZVRoZW1lU3dpdGNoZXJCdXR0b24oKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdG9nZ2xlRGFya01vZGUoKSB7XG4gICAgICAgIGlzRGFya01vZGUgPSAhaXNEYXJrTW9kZTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1hcHAtcm9vdCcpO1xuICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlbWUtdG9nZ2xlLWJ0bicpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGlzRGFya01vZGUpIHtcbiAgICAgICAgICByb290LmNsYXNzTmFtZSA9ICdkYXJrIGJnLXppbmMtOTUwIHRleHQtemluYy0xMDAgbWluLWgtc2NyZWVuIGZvbnQtc2FucyB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0yMDAgZmxleCBmbGV4LWNvbCc7XG4gICAgICAgICAgYnRuLnRpdGxlID0gXCJQYXNzYSBhbGxhIG1vZGFsaXTDoCBjaGlhcmFcIjtcbiAgICAgICAgICBidG4uaW5uZXJIVE1MID0gU1VOX1NWRztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByb290LmNsYXNzTmFtZSA9ICdiZy1bI0Y5RkFGQl0gdGV4dC16aW5jLTkwMCBtaW4taC1zY3JlZW4gZm9udC1zYW5zIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTIwMCBmbGV4IGZsZXgtY29sJztcbiAgICAgICAgICBidG4udGl0bGUgPSBcIlBhc3NhIGFsbGEgbW9kYWxpdMOgIHNjdXJhXCI7XG4gICAgICAgICAgYnRuLmlubmVySFRNTCA9IE1PT05fU1ZHO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZVRoZW1lU3dpdGNoZXJCdXR0b24oKSB7XG4gICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVtZS10b2dnbGUtYnRuJyk7XG4gICAgICAgIGlmIChpc0RhcmtNb2RlKSB7XG4gICAgICAgICAgYnRuLmlubmVySFRNTCA9IFNVTl9TVkc7XG4gICAgICAgICAgYnRuLnRpdGxlID0gXCJQYXNzYSBhbGxhIG1vZGFsaXTDoCBjaGlhcmFcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBidG4uaW5uZXJIVE1MID0gTU9PTl9TVkc7XG4gICAgICAgICAgYnRuLnRpdGxlID0gXCJQYXNzYSBhbGxhIG1vZGFsaXTDoCBzY3VyYVwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJlLXJ1bnMgdGhlIHNwbGl0dGluZyBhbGdvcml0aG0gb24gdGhlIG9yaWdpbmFsIGZ1bGwgdGV4dCBhc3luY2hyb25vdXNseVxuICAgICAgZnVuY3Rpb24gcmVwcm9jZXNzSlNPTkRhdGEoKSB7XG4gICAgICAgIGlmICghcmF3RnVsbFRleHQpIHJldHVybjtcblxuICAgICAgICBzaG93TG9hZGluZygnUmljYWxjb2xhbmRvIGRpdmlzaW9uZSBkZWkgcGV6emkuLi4nKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBzcGxpdEpTT05Db250ZW50KHJhd0Z1bGxUZXh0LCB0YXJnZXRTaXplLCBmb3JjZU1vZGUpO1xuICAgICAgICAgICAgY2h1bmtzID0gcmVzdWx0cy5jaHVua3M7XG4gICAgICAgICAgICBtb2RlVXNlZCA9IHJlc3VsdHMubW9kZVVzZWQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIENvbnN0cmFpbiBpbmRpY2VzXG4gICAgICAgICAgICBhY3RpdmVDaHVua0luZGV4ID0gTWF0aC5taW4oYWN0aXZlQ2h1bmtJbmRleCwgY2h1bmtzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgaWYgKGFjdGl2ZUNodW5rSW5kZXggPCAwKSBhY3RpdmVDaHVua0luZGV4ID0gMDtcblxuICAgICAgICAgICAgcmVuZGVyRGFzaGJvYXJkKHJlc3VsdHMuZXJyb3IpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYWxlcnQoXCJFcnJvcmUgZHVyYW50ZSBsYSBkaXZpc2lvbmUgbGl2ZSBkZWwgY29kaWNlOiBcIiArIChlcnIubWVzc2FnZSB8fCBlcnIpKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEyMCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNldFRhcmdldFNpemVWYWx1ZShzaXplKSB7XG4gICAgICAgIHRhcmdldFNpemUgPSBzaXplO1xuICAgICAgICBbMTAwMDAwLCAyNTAwMDAsIDQ1MDAwMCwgMTAwMDAwMF0uZm9yRWFjaChzID0+IHtcbiAgICAgICAgICBjb25zdCBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2l6ZS1idG4tJyArIHMpO1xuICAgICAgICAgIGlmIChidG4pIHtcbiAgICAgICAgICAgIGlmIChzID09PSBzaXplKSB7XG4gICAgICAgICAgICAgIGJ0bi5jbGFzc05hbWUgPSBcInB5LTIgcHgtMSByb3VuZGVkLXhsIHRleHQteHMgZm9udC1ib2xkIGJvcmRlciB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlciBiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlIGJvcmRlci1ibHVlLTYwMFwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnRuLmNsYXNzTmFtZSA9IFwicHktMiBweC0xIHJvdW5kZWQteGwgdGV4dC14cyBmb250LWJvbGQgYm9yZGVyIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyIGJnLXppbmMtNTAgZGFyazpiZy16aW5jLTgwMCB0ZXh0LXppbmMtNzAwIGRhcms6dGV4dC16aW5jLTMwMCBib3JkZXItemluYy0yMDAgZGFyazpib3JkZXItemluYy03MDAgaG92ZXI6YmctemluYy0xMDAgZGFyazpob3ZlcjpiZy16aW5jLTcwMFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVHJpZ2dlciBkeW5hbWljIHJlZnJlc2ggaWYgd2UgYWxyZWFkeSBoYWQgZmlsZXMgbG9hZGVkXG4gICAgICAgIGlmIChyYXdGdWxsVGV4dCkge1xuICAgICAgICAgIHJlcHJvY2Vzc0pTT05EYXRhKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFuZGxlTW9kZUNoYW5nZShzZWxlY3RFbCkge1xuICAgICAgICBmb3JjZU1vZGUgPSBzZWxlY3RFbC52YWx1ZTtcbiAgICAgICAgaWYgKHJhd0Z1bGxUZXh0KSB7XG4gICAgICAgICAgcmVwcm9jZXNzSlNPTkRhdGEoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiB0b2dnbGVQcm9jZXNzQnV0dG9uKCkge1xuICAgICAgICBjb25zdCBhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bhc3RlLXRleHRhcmVhJyk7XG4gICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9jZXNzLWJ0bicpO1xuICAgICAgICBpZiAoYXJlYSAmJiBidG4pIHtcbiAgICAgICAgICBpZiAoYXJlYS52YWx1ZS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidG4uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGZvcm1hdEJ5dGVzKGJ5dGVzKSB7XG4gICAgICAgIGlmIChieXRlcyA9PT0gMCkgcmV0dXJuICcwIEInO1xuICAgICAgICBjb25zdCBrID0gMTAyNDtcbiAgICAgICAgY29uc3Qgc2l6ZXMgPSBbJ0InLCAnS0InLCAnTUInLCAnR0InXTtcbiAgICAgICAgY29uc3QgaSA9IE1hdGguZmxvb3IoTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coaykpO1xuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCgoYnl0ZXMgLyBNYXRoLnBvdyhrLCBpKSkudG9GaXhlZCgyKSkgKyAnICcgKyBzaXplc1tpXTtcbiAgICAgIH1cblxuICAgICAgLy8gSGlnaC1wZXJmb3JtYW5jZSBwYXJzZXIgZW5naW5lXG4gICAgICBmdW5jdGlvbiBzcGxpdEpTT05Db250ZW50KHJhd1RleHQsIHRhcmdldENodW5rU2l6ZUJ5dGVzLCBjaG9zZW5Nb2RlKSB7XG4gICAgICAgIGNvbnN0IHRyaW1tZWQgPSByYXdUZXh0LnRyaW0oKTtcbiAgICAgICAgaWYgKCF0cmltbWVkKSB7XG4gICAgICAgICAgcmV0dXJuIHsgY2h1bmtzOiBbXSwgbW9kZVVzZWQ6ICdyYXdfdGV4dCcsIGVycm9yOiAnSWwgdGVzdG8gaW5zZXJpdG8gw6ggdnVvdG8uJyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyaW1tZWQubGVuZ3RoIDw9IHRhcmdldENodW5rU2l6ZUJ5dGVzKSB7XG4gICAgICAgICAgbGV0IGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgSlNPTi5wYXJzZSh0cmltbWVkKTtcbiAgICAgICAgICAgIGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICAgIH0gY2F0Y2gge31cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaHVua3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnQmxvY2NvIFVuaWNvJyxcbiAgICAgICAgICAgICAgICBzaXplQnl0ZXM6IG5ldyBCbG9iKFt0cmltbWVkXSkuc2l6ZSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0cmltbWVkLFxuICAgICAgICAgICAgICAgIGlzVmFsaWRKU09OOiBpc1ZhbGlkLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbW9kZVVzZWQ6ICdhdXRvJyxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcnNlZCA9IG51bGw7XG4gICAgICAgIGxldCBpc1BhcnNlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgcGFyc2VFcnJvciA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcGFyc2VkID0gSlNPTi5wYXJzZSh0cmltbWVkKTtcbiAgICAgICAgICBpc1BhcnNlZCA9IHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHBhcnNlRXJyb3IgPSBlcnIgJiYgZXJyLm1lc3NhZ2UgPyBlcnIubWVzc2FnZSA6ICdFcnJvcmUgZ2VuZXJpY28gZGkgcGFyc2luZyBKU09OJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNodW5rTGlzdCA9IFtdO1xuICAgICAgICBsZXQgdXNlZE1vZGUgPSAncmF3X3RleHQnO1xuXG4gICAgICAgIGlmIChpc1BhcnNlZCAmJiBjaG9zZW5Nb2RlICE9PSAncmF3X3RleHQnKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocGFyc2VkKSAmJiBjaG9zZW5Nb2RlICE9PSAnb2JqZWN0X2tleXMnKSB7XG4gICAgICAgICAgICB1c2VkTW9kZSA9ICdhcnJheV9pdGVtcyc7XG4gICAgICAgICAgICBsZXQgY3VycmVudEdyb3VwID0gW107XG4gICAgICAgICAgICBsZXQgY3VycmVudExlbkVzdGltYXRlID0gMjtcbiAgICAgICAgICAgIGxldCBjaHVua0luZGV4ID0gMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJzZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHBhcnNlZFtpXTtcbiAgICAgICAgICAgICAgY29uc3QgaXRlbVN0ciA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xuICAgICAgICAgICAgICBjb25zdCBpdGVtTGVuID0gaXRlbVN0ci5sZW5ndGggKyAxO1xuXG4gICAgICAgICAgICAgIGlmIChjdXJyZW50R3JvdXAubGVuZ3RoID4gMCAmJiBjdXJyZW50TGVuRXN0aW1hdGUgKyBpdGVtTGVuID4gdGFyZ2V0Q2h1bmtTaXplQnl0ZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaHVua0pzb24gPSBKU09OLnN0cmluZ2lmeShjdXJyZW50R3JvdXAsIG51bGwsIDIpO1xuICAgICAgICAgICAgICAgIGNodW5rTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIGluZGV4OiBjaHVua0luZGV4LFxuICAgICAgICAgICAgICAgICAgbGFiZWw6ICdCbG9jY28gJyArIChjaHVua0luZGV4ICsgMSkgKyAnIChFbGVtZW50aSAnICsgKGkgLSBjdXJyZW50R3JvdXAubGVuZ3RoKSArICcgLSAnICsgKGkgLSAxKSArICcpJyxcbiAgICAgICAgICAgICAgICAgIHNpemVCeXRlczogbmV3IEJsb2IoW2NodW5rSnNvbl0pLnNpemUsXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBjaHVua0pzb24sXG4gICAgICAgICAgICAgICAgICBpc1ZhbGlkSlNPTjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IFtpdGVtXTtcbiAgICAgICAgICAgICAgICBjdXJyZW50TGVuRXN0aW1hdGUgPSAyICsgaXRlbVN0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY2h1bmtJbmRleCsrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMZW5Fc3RpbWF0ZSArPSBpdGVtTGVuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50R3JvdXAubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBjb25zdCBjaHVua0pzb24gPSBKU09OLnN0cmluZ2lmeShjdXJyZW50R3JvdXAsIG51bGwsIDIpO1xuICAgICAgICAgICAgICBjaHVua0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGNodW5rSW5kZXgsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdCbG9jY28gJyArIChjaHVua0luZGV4ICsgMSkgKyAnIChFbGVtZW50aSAnICsgKHBhcnNlZC5sZW5ndGggLSBjdXJyZW50R3JvdXAubGVuZ3RoKSArICcgLSAnICsgKHBhcnNlZC5sZW5ndGggLSAxKSArICcpJyxcbiAgICAgICAgICAgICAgICBzaXplQnl0ZXM6IG5ldyBCbG9iKFtjaHVua0pzb25dKS5zaXplLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNodW5rSnNvbixcbiAgICAgICAgICAgICAgICBpc1ZhbGlkSlNPTjogdHJ1ZSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGFyc2VkID09PSAnb2JqZWN0JyAmJiBwYXJzZWQgIT09IG51bGwgJiYgY2hvc2VuTW9kZSAhPT0gJ2FycmF5X2l0ZW1zJykge1xuICAgICAgICAgICAgdXNlZE1vZGUgPSAnb2JqZWN0X2tleXMnO1xuICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHBhcnNlZCk7XG4gICAgICAgICAgICBsZXQgY3VycmVudEdyb3VwID0ge307XG4gICAgICAgICAgICBsZXQgY3VycmVudExlbkVzdGltYXRlID0gMjtcbiAgICAgICAgICAgIGxldCBjaHVua0luZGV4ID0gMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IFtrZXksIHZhbF0gPSBlbnRyaWVzW2ldO1xuICAgICAgICAgICAgICBjb25zdCBlbnRyeVN0ciA9IEpTT04uc3RyaW5naWZ5KGtleSkgKyAnOicgKyBKU09OLnN0cmluZ2lmeSh2YWwpO1xuICAgICAgICAgICAgICBjb25zdCBlbnRyeUxlbiA9IGVudHJ5U3RyLmxlbmd0aCArIDE7XG5cbiAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGN1cnJlbnRHcm91cCkubGVuZ3RoID4gMCAmJiBjdXJyZW50TGVuRXN0aW1hdGUgKyBlbnRyeUxlbiA+IHRhcmdldENodW5rU2l6ZUJ5dGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2h1bmtKc29uID0gSlNPTi5zdHJpbmdpZnkoY3VycmVudEdyb3VwLCBudWxsLCAyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBrTGlzdCA9IE9iamVjdC5rZXlzKGN1cnJlbnRHcm91cCk7XG4gICAgICAgICAgICAgICAgY2h1bmtMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgaW5kZXg6IGNodW5rSW5kZXgsXG4gICAgICAgICAgICAgICAgICBsYWJlbDogJ0Jsb2NjbyAnICsgKGNodW5rSW5kZXggKyAxKSArICcgKCcgKyBrTGlzdFswXSArICcgLi4uICcgKyBrTGlzdFtrTGlzdC5sZW5ndGggLSAxXSArICcpJyxcbiAgICAgICAgICAgICAgICAgIHNpemVCeXRlczogbmV3IEJsb2IoW2NodW5rSnNvbl0pLnNpemUsXG4gICAgICAgICAgICAgICAgICBjb250ZW50OiBjaHVua0pzb24sXG4gICAgICAgICAgICAgICAgICBpc1ZhbGlkSlNPTjogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cCA9IHsgW2tleV06IHZhbCB9O1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMZW5Fc3RpbWF0ZSA9IDIgKyBlbnRyeVN0ci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY2h1bmtJbmRleCsrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRHcm91cFtrZXldID0gdmFsO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRMZW5Fc3RpbWF0ZSArPSBlbnRyeUxlbjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY3VycmVudEdyb3VwKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNodW5rSnNvbiA9IEpTT04uc3RyaW5naWZ5KGN1cnJlbnRHcm91cCwgbnVsbCwgMik7XG4gICAgICAgICAgICAgIGNvbnN0IGtMaXN0ID0gT2JqZWN0LmtleXMoY3VycmVudEdyb3VwKTtcbiAgICAgICAgICAgICAgY2h1bmtMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgIGluZGV4OiBjaHVua0luZGV4LFxuICAgICAgICAgICAgICAgIGxhYmVsOiAnQmxvY2NvICcgKyAoY2h1bmtJbmRleCArIDEpICsgJyAoJyArIGtMaXN0WzBdICsgJyAuLi4gJyArIGtMaXN0W2tMaXN0Lmxlbmd0aCAtIDFdICsgJyknLFxuICAgICAgICAgICAgICAgIHNpemVCeXRlczogbmV3IEJsb2IoW2NodW5rSnNvbl0pLnNpemUsXG4gICAgICAgICAgICAgICAgY29udGVudDogY2h1bmtKc29uLFxuICAgICAgICAgICAgICAgIGlzVmFsaWRKU09OOiB0cnVlLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2h1bmtMaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHVzZWRNb2RlID0gJ3Jhd190ZXh0JztcbiAgICAgICAgICBjb25zdCBsaW5lcyA9IHRyaW1tZWQuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgIGxldCBjaHVua0luZGV4ID0gMDtcbiAgICAgICAgICBsZXQgY3VycmVudFRleHQgPSAnJztcbiAgICAgICAgICBsZXQgY3VycmVudExlbkJ5dGVzID0gMDtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXSArICdcXG4nO1xuICAgICAgICAgICAgY29uc3QgbGluZUJ5dGVzID0gbmV3IEJsb2IoW2xpbmVdKS5zaXplO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudFRleHQubGVuZ3RoID4gMCAmJiBjdXJyZW50TGVuQnl0ZXMgKyBsaW5lQnl0ZXMgPiB0YXJnZXRDaHVua1NpemVCeXRlcykge1xuICAgICAgICAgICAgICBjaHVua0xpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGNodW5rSW5kZXgsXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdCbG9jY28gJyArIChjaHVua0luZGV4ICsgMSkgKyAnIChSaWdoZSB+JyArIChjaHVua0luZGV4ICogMTUwMCkgKyAnIGluIHBvaSknLFxuICAgICAgICAgICAgICAgIHNpemVCeXRlczogY3VycmVudExlbkJ5dGVzLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGN1cnJlbnRUZXh0LFxuICAgICAgICAgICAgICAgIGlzVmFsaWRKU09OOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgY3VycmVudFRleHQgPSBsaW5lO1xuICAgICAgICAgICAgICBjdXJyZW50TGVuQnl0ZXMgPSBsaW5lQnl0ZXM7XG4gICAgICAgICAgICAgIGNodW5rSW5kZXgrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRUZXh0ICs9IGxpbmU7XG4gICAgICAgICAgICAgIGN1cnJlbnRMZW5CeXRlcyArPSBsaW5lQnl0ZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRUZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNodW5rTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgaW5kZXg6IGNodW5rSW5kZXgsXG4gICAgICAgICAgICAgIGxhYmVsOiAnQmxvY2NvICcgKyAoY2h1bmtJbmRleCArIDEpICsgJyAoRmlubyBhIHJpZ2EgJyArIGxpbmVzLmxlbmd0aCArICcpJyxcbiAgICAgICAgICAgICAgc2l6ZUJ5dGVzOiBjdXJyZW50TGVuQnl0ZXMsXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IGN1cnJlbnRUZXh0LFxuICAgICAgICAgICAgICBpc1ZhbGlkSlNPTjogZmFsc2UsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBjaHVua3M6IGNodW5rTGlzdCwgbW9kZVVzZWQ6IHVzZWRNb2RlLCBlcnJvcjogcGFyc2VFcnJvciA/ICdOb3RhOiBQYXJzaW5nIGZhbGxpdG8sIGRpdmlzbyBjb21lIHRlc3RvIGdyZXp6by4gKCcgKyBwYXJzZUVycm9yICsgJyknIDogdW5kZWZpbmVkIH07XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNob3dMb2FkaW5nKHN0YWdlKSB7XG4gICAgICAgIGNvbnN0IHRleHRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkaW5nLXN0YWdlLXRleHQnKTtcbiAgICAgICAgaWYgKHRleHRFbCkgdGV4dEVsLmlubmVyVGV4dCA9IHN0YWdlO1xuICAgICAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmctb3ZlcmxheScpO1xuICAgICAgICBpZiAob3ZlcmxheSkge1xuICAgICAgICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdmbGV4Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGlkZUxvYWRpbmcoKSB7XG4gICAgICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZy1vdmVybGF5Jyk7XG4gICAgICAgIGlmIChvdmVybGF5KSB7XG4gICAgICAgICAgb3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICBvdmVybGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2ZsZXgnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwcm9jZXNzSlNPTkRhdGEodGV4dCwgbmFtZSkge1xuICAgICAgICBpZiAoIXRleHQgfHwgIXRleHQudHJpbSgpKSB7XG4gICAgICAgICAgaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByYXdGdWxsVGV4dCA9IHRleHQ7XG4gICAgICAgIHNob3dMb2FkaW5nKCdJbml6aWFsaXp6YXppb25lLi4uJyk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgQmxvYihbdGV4dF0pLnNpemU7XG4gICAgICAgICAgICB0b3RhbElucHV0U2l6ZUJ5dGVzID0gYnl0ZXM7XG5cbiAgICAgICAgICAgIGlmIChieXRlcyA8IDIwMDAwMCkge1xuICAgICAgICAgICAgICBpbnB1dFRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgICBjb25zdCBhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Bhc3RlLXRleHRhcmVhJyk7XG4gICAgICAgICAgICAgIGlmIChhcmVhKSBhcmVhLnZhbHVlID0gdGV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlucHV0VGV4dCA9ICdbRmlsZSBKU09OIGdyYW5kZSBjYXJpY2F0byBjb24gc3VjY2Vzc286ICcgKyBmb3JtYXRCeXRlcyhieXRlcykgKyAnXSc7XG4gICAgICAgICAgICAgIGNvbnN0IGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFzdGUtdGV4dGFyZWEnKTtcbiAgICAgICAgICAgICAgaWYgKGFyZWEpIGFyZWEudmFsdWUgPSBpbnB1dFRleHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgIGZpbGVOYW1lID0gbmFtZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgIGZpbGVOYW1lID0gJ3Bhc3RlZF9qc29uLmpzb24nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQZXJmb3JtIHNwbGl0dGluZyBpbW1lZGlhdGVseSBhbmQgc3luY2hyb25vdXNseSBpbnNpZGUgdHJ5LWNhdGNoIHRvIGF2b2lkIHVuaGFuZGxlZCBhc3luYyBlc2NhcGVzXG4gICAgICAgICAgICBjb25zdCByZXN1bHRzID0gc3BsaXRKU09OQ29udGVudCh0ZXh0LCB0YXJnZXRTaXplLCBmb3JjZU1vZGUpO1xuICAgICAgICAgICAgY2h1bmtzID0gcmVzdWx0cy5jaHVua3M7XG4gICAgICAgICAgICBtb2RlVXNlZCA9IHJlc3VsdHMubW9kZVVzZWQ7XG4gICAgICAgICAgICBhY3RpdmVDaHVua0luZGV4ID0gMDtcblxuICAgICAgICAgICAgcmVuZGVyRGFzaGJvYXJkKHJlc3VsdHMuZXJyb3IpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgYWxlcnQoXCJFcnJvcmUgZHVyYW50ZSBsJ2VsYWJvcmF6aW9uZSBkZWwgZmlsZSBKU09OOiBcIiArIChlcnIubWVzc2FnZSB8fCBlcnIpKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDgwKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGFzdGVGcm9tQ2xpcGJvYXJkKCkge1xuICAgICAgICBpZiAoIW5hdmlnYXRvci5jbGlwYm9hcmQgfHwgIW5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQpIHtcbiAgICAgICAgICBhbGVydChcIkxhIGxldHR1cmEgZGlyZXR0YSBkZWdsaSBhcHB1bnRpIG5vbiDDqCBzdXBwb3J0YXRhIGRhbCBicm93c2VyIGluIHF1ZXN0byBjb250ZXN0byBsb2NhbGUgbyBzdWwgdGVsZWZvbm8gKHJpY2hpZWRlIHByb3RvY29sbG8gc2ljdXJvIEhUVFBTIG8gYXV0b3JpenphemlvbmkgZGVsIGJyb3dzZXIpLiBcXG5cXG5QZXIgZmF2b3JlLCB1c2EgbGEgc2NvcmNpYXRvaWEgY2xhc3NpY2E6IHRpZW5pIHByZW11dG8gZWQgaW5jb2xsYSBtYW51YWxtZW50ZSAoQ3RybCtWKSBkZW50cm8gbGEgY2FzZWxsYSBkaSB0ZXN0by5cIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd0xvYWRpbmcoJ1JpY2hpZXN0YSBhY2Nlc3NvIGFwcHVudGkuLi4nKTtcbiAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgaWYgKCF0ZXh0IHx8ICF0ZXh0LnRyaW0oKSkge1xuICAgICAgICAgICAgICBhbGVydChcIklsIGNvbnRlbnV0byBjb3BpYXRvIG5lZ2xpIGFwcHVudGkgw6ggdnVvdG8gbyBub24gw6ggZGVsIHRlc3RvIHZhbGlkby5cIik7XG4gICAgICAgICAgICAgIGhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3dMb2FkaW5nKCdFbGFib3JhemlvbmUgZGF0aSBpbmNvbGxhdGkuLi4nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByb2Nlc3NKU09ORGF0YSh0ZXh0LCAnY2xpcGJvYXJkX2pzb24uanNvbicpO1xuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgYWxlcnQoXCJJbCBicm93c2VyIGhhIG5lZ2F0byBsJ2FjY2Vzc28gYWdsaSBhcHB1bnRpLiBcXG5cXG5Tb2x1emlvbmU6IEluY29sbGEgbWFudWFsbWVudGUgKEN0cmwrViBvIHRpZW5pIHByZW11dG8pIGRlbnRybyBsYSBjYXNlbGxhIGRpIHRlc3RvIHF1aSBzb3R0by5cIik7XG4gICAgICAgICAgICBoaWRlTG9hZGluZygpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoYW5kbGVQcm9jZXNzVGV4dCgpIHtcbiAgICAgICAgY29uc3QgYXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXN0ZS10ZXh0YXJlYScpO1xuICAgICAgICBpZiAoIWFyZWEpIHJldHVybjtcbiAgICAgICAgY29uc3QgdGV4dCA9IGFyZWEudmFsdWU7XG4gICAgICAgIGlmICghdGV4dC50cmltKCkpIHJldHVybjtcblxuICAgICAgICBmaWxlTmFtZSA9ICdwYXN0ZWRfanNvbi5qc29uJztcbiAgICAgICAgZm9yY2VNb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwbGl0LW1vZGUtc2VsZWN0JykudmFsdWU7XG4gICAgICAgIHByb2Nlc3NKU09ORGF0YSh0ZXh0LCBmaWxlTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZUZpbGVVcGxvYWQoaW5wdXRFbCkge1xuICAgICAgICBjb25zdCBmaWxlID0gKGlucHV0RWwuZmlsZXMgJiYgaW5wdXRFbC5maWxlcy5sZW5ndGggPiAwKSA/IGlucHV0RWwuZmlsZXNbMF0gOiBudWxsO1xuICAgICAgICBpZiAoIWZpbGUpIHJldHVybjtcblxuICAgICAgICBmaWxlTmFtZSA9IGZpbGUubmFtZTtcbiAgICAgICAgZm9yY2VNb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NwbGl0LW1vZGUtc2VsZWN0JykudmFsdWU7XG5cbiAgICAgICAgc2hvd0xvYWRpbmcoJ0xldHR1cmEgZGVsIGZpbGUuLi4nKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgICAgIHByb2Nlc3NKU09ORGF0YSh0ZXh0LCBmaWxlLm5hbWUpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdFcnJvcmUgbmVsbGEgbGV0dHVyYSBkZWwgZmlsZS4nKTtcbiAgICAgICAgICAgIGhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgICAgfSwgMTUwKTtcbiAgICAgIH1cblxuICAgICAgLy8gRHJhZyBhbmQgRHJvcCBmaWxlcyBzYWZlbHlcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZURyYWdFbnRlcihlKSB7IGUucHJldmVudERlZmF1bHQoKTsgZS5zdG9wUHJvcGFnYXRpb24oKTsgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3B6b25lJykuY2xhc3NMaXN0LmFkZCgnYm9yZGVyLWJsdWUtNTAwJyk7IH1cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZURyYWdPdmVyKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9XG4gICAgICBmdW5jdGlvbiBoYW5kbGVEcmFnTGVhdmUoZSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcm9wem9uZScpLmNsYXNzTGlzdC5yZW1vdmUoJ2JvcmRlci1ibHVlLTUwMCcpOyB9XG4gICAgICBmdW5jdGlvbiBoYW5kbGVEcm9wRmlsZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3B6b25lJykuY2xhc3NMaXN0LnJlbW92ZSgnYm9yZGVyLWJsdWUtNTAwJyk7XG4gICAgICAgIGNvbnN0IGZpbGUgPSAoZS5kYXRhVHJhbnNmZXIgJiYgZS5kYXRhVHJhbnNmZXIuZmlsZXMgJiYgZS5kYXRhVHJhbnNmZXIuZmlsZXMubGVuZ3RoID4gMCkgPyBlLmRhdGFUcmFuc2Zlci5maWxlc1swXSA6IG51bGw7XG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuO1xuXG4gICAgICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuICAgICAgICBmb3JjZU1vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3BsaXQtbW9kZS1zZWxlY3QnKS52YWx1ZTtcblxuICAgICAgICBzaG93TG9hZGluZygnQ2FyaWNhbWVudG8gZmlsZSB0cmFzY2luYXRvLi4uJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICAgIHByb2Nlc3NKU09ORGF0YSh0ZXh0LCBmaWxlLm5hbWUpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdFcnJvcmUgZGkgbGV0dHVyYSBkZWwgZmlsZS4nKTtcbiAgICAgICAgICAgIGhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgICAgfSwgMTUwKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFuZGxlR2VuZXJhdGVTYW1wbGUoKSB7XG4gICAgICAgIGZpbGVOYW1lID0gJ2NhbXBpb25lXzEwTUIuanNvbic7XG4gICAgICAgIGZvcmNlTW9kZSA9ICdhdXRvJztcblxuICAgICAgICBzaG93TG9hZGluZygnR2VuZXJhemlvbmUgZGVpIGRhdGkgY2FtcGlvbmUgKDE1LjAwMCByZWNvcmQpLi4uJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaXRlbXMgPSBbXTtcbiAgICAgICAgICBjb25zdCBzYW1wbGVOYW1lcyA9IFsnUmFmZmFlbGUnLCAnTWFyY28nLCAnU29maWEnLCAnR2l1bGlhJywgJ0VsZW5hJywgJ0FsZXNzYW5kcm8nLCAnTWF0dGVvJywgJ0NoaWFyYScsICdMZW9uYXJkbycsICdEYXZpZGUnXTtcbiAgICAgICAgICBjb25zdCBzYW1wbGVDaXRpZXMgPSBbJ1JvbWEnLCAnTWlsYW5vJywgJ05hcG9saScsICdUb3Jpbm8nLCAnRmlyZW56ZScsICdCYXJpJywgJ1ZlbmV6aWEnLCAnQm9sb2duYScsICdHZW5vdmEnLCAnUGFsZXJtbyddO1xuICAgICAgICAgIGNvbnN0IHNhbXBsZUpvYnMgPSBbJ0luZ2VnbmVyZScsICdEZXNpZ25lcicsICdNZWRpY28nLCAnSW5zZWduYW50ZScsICdTdmlsdXBwYXRvcmUnLCAnQ3VvY28nLCAnU2NyaXR0b3JlJywgJ0FzdHJvbmF1dGEnLCAnQXZ2b2NhdG8nLCAnQmFyaXN0YSddO1xuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTUwMDA7IGkrKykge1xuICAgICAgICAgICAgaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgIGlkOiBpLFxuICAgICAgICAgICAgICBndWlkOiAnaWQtZ2VuLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgMTEpICsgJy0nICsgaSxcbiAgICAgICAgICAgICAgYXR0aXZvOiBNYXRoLnJhbmRvbSgpID4gMC4zLFxuICAgICAgICAgICAgICBwcm9maWxvOiB7XG4gICAgICAgICAgICAgICAgbm9tZTogc2FtcGxlTmFtZXNbaSAlIHNhbXBsZU5hbWVzLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgY2l0dGE6IHNhbXBsZUNpdGllc1tNYXRoLnJhbmRvbSgpID4gMC41ID8gKGkgJSBzYW1wbGVDaXRpZXMubGVuZ3RoKSA6IDBdLFxuICAgICAgICAgICAgICAgIHByb2Zlc3Npb25lOiBzYW1wbGVKb2JzW2kgJSBzYW1wbGVKb2JzLmxlbmd0aF0sXG4gICAgICAgICAgICAgICAgcHVudGVnZ2lvOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKSArIDEwMFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjcm9ub2xvZ2lhX2FjY2Vzc2k6IFtcbiAgICAgICAgICAgICAgICB7IHRpbWVzdGFtcDogbmV3IERhdGUoRGF0ZS5ub3coKSAtIE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMDAwKS50b0lTT1N0cmluZygpLCBpcDogJzE5Mi4xNjguMS4nICsgKGkgJSAyNTUpIH0sXG4gICAgICAgICAgICAgICAgeyB0aW1lc3RhbXA6IG5ldyBEYXRlKERhdGUubm93KCkgLSBNYXRoLnJhbmRvbSgpICogNTAwMDAwMCkudG9JU09TdHJpbmcoKSwgaXA6ICcxMC4wLjAuJyArIChpICUgMjU1KSB9XG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIG1ldGFkYXRpOiB7XG4gICAgICAgICAgICAgICAgY3JlYXRvX2lsOiAnMjAyNi0wNi0xMVQwNjoxNzo1MVonLFxuICAgICAgICAgICAgICAgIGxpbmd1YTogaSAlIDMgPT09IDAgPyAnaXRfSVQnIDogJ2VuX1VTJyxcbiAgICAgICAgICAgICAgICB0YWdzOiBbJ2pzb24nLCAnc3BsaXQnLCAndGVzdGVyJywgJ3RhZ18nICsgKGkgJSAxMCldXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGdlbmVyYXRlZFN0ciA9IEpTT04uc3RyaW5naWZ5KGl0ZW1zLCBudWxsLCAyKTtcbiAgICAgICAgICBwcm9jZXNzSlNPTkRhdGEoZ2VuZXJhdGVkU3RyLCAnY2FtcGlvbmVfMTBNQi5qc29uJyk7XG4gICAgICAgIH0sIDE1MCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlc2V0KCkge1xuICAgICAgICByYXdGdWxsVGV4dCA9ICcnO1xuICAgICAgICBpbnB1dFRleHQgPSAnJztcbiAgICAgICAgY2h1bmtzID0gW107XG4gICAgICAgIGZpbGVOYW1lID0gJyc7XG4gICAgICAgIGFjdGl2ZUNodW5rSW5kZXggPSAwO1xuICAgICAgICB0b3RhbElucHV0U2l6ZUJ5dGVzID0gMDtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFzdGUtdGV4dGFyZWEnKS52YWx1ZSA9ICcnO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuLWlucHV0JykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW4tZGFzaGJvYXJkJykuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItcmVzZXQtYnRuJykuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIHRvZ2dsZVByb2Nlc3NCdXR0b24oKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFuZGxlUHJldkNodW5rKCkge1xuICAgICAgICBpZiAoYWN0aXZlQ2h1bmtJbmRleCA+IDApIHtcbiAgICAgICAgICBzZWxlY3RDaHVuayhhY3RpdmVDaHVua0luZGV4IC0gMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGFuZGxlTmV4dENodW5rKCkge1xuICAgICAgICBpZiAoYWN0aXZlQ2h1bmtJbmRleCA8IGNodW5rcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgc2VsZWN0Q2h1bmsoYWN0aXZlQ2h1bmtJbmRleCArIDEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNlbGVjdENodW5rKGluZGV4KSB7XG4gICAgICAgIGFjdGl2ZUNodW5rSW5kZXggPSBpbmRleDtcbiAgICAgICAgXG4gICAgICAgIC8vIFJlc2V0IGxvY2FsIHNlYXJjaCBpbnNpZGUgdGhlIGJsb2NrXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaHVuay1zZWFyY2gtaW5wdXQnKS52YWx1ZSA9ICcnO1xuICAgICAgICBzZWFyY2hUZXJtID0gJyc7XG4gICAgICAgIHNlYXJjaFJlc3VsdHMgPSBbXTtcbiAgICAgICAgc2VhcmNoSW5kZXggPSAtMTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1yZXN1bHRzLWNvbnRyb2xzJykuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG5cbiAgICAgICAgcmVuZGVyQWN0aXZlQ2h1bmtEYXRhKCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGVzY2FwZUh0bWwodGV4dCkge1xuICAgICAgICByZXR1cm4gdGV4dFxuICAgICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEhpZ2gtcGVyZm9ybWFuY2UgcmVndWxhciBleHByZXNzaW9uIHRva2VuaXplciBmb3Igc3ludGF4IGhpZ2hsaWdodGluZ1xuICAgICAgZnVuY3Rpb24gY29tcGlsZUhpZ2hsaWdodGVkKHJhdykge1xuICAgICAgICBpZiAoIWhpZ2hsaWdodFN5bnRheCB8fCByYXcubGVuZ3RoID4gNzAwMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIGVzY2FwZUh0bWwocmF3KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVzY2FwZWQgPSBlc2NhcGVIdG1sKHJhdyk7XG4gICAgICAgIHJldHVybiBlc2NhcGVkLnJlcGxhY2UoXG4gICAgICAgICAgLyhcIihcXFxcdVthLXpBLVowLTldezR9fFxcXFxbXnVdfFteXFxcXFwiXSkqXCIoXFxzKjopP3xcXGIodHJ1ZXxmYWxzZXxudWxsKVxcYnwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWystXT9cXGQrKT8pL2csXG4gICAgICAgICAgKG1hdGNoKSA9PiB7XG4gICAgICAgICAgICBsZXQgY2xzID0gJ3RleHQtYW1iZXItMzAwIGZvbnQtbW9ubyc7XG4gICAgICAgICAgICBpZiAobWF0Y2guc3RhcnRzV2l0aCgnXCInKSkge1xuICAgICAgICAgICAgICBpZiAobWF0Y2guZW5kc1dpdGgoJzonKSkge1xuICAgICAgICAgICAgICAgIGNscyA9ICd0ZXh0LWluZGlnby00MDAgZGFyazp0ZXh0LXBpbmstNDAwIGZvbnQtc2VtaWJvbGQgZm9udC1tb25vJztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbHMgPSAndGV4dC1lbWVyYWxkLTcwMCBkYXJrOnRleHQtZ3JlZW4tNDAwIGZvbnQtbW9ubyc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPT09ICd0cnVlJyB8fCBtYXRjaCA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICBjbHMgPSAndGV4dC1wdXJwbGUtNjAwIGRhcms6dGV4dC1vcmFuZ2UtMzUwIGZvbnQtbWVkaXVtIGZvbnQtbW9ubyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoID09PSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgY2xzID0gJ3RleHQtZ3JheS00MDAgZm9udC1tb25vIGl0YWxpYyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIGNscyArICdcIj4nICsgbWF0Y2ggKyAnPC9zcGFuPic7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyBSZW5kZXIgTGF5b3V0IFN0YXRlc1xuICAgICAgZnVuY3Rpb24gcmVuZGVyRGFzaGJvYXJkKHBhcnNpbmdFcnJvcikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NyZWVuLWlucHV0JykuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JlZW4tZGFzaGJvYXJkJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItcmVzZXQtYnRuJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG5cbiAgICAgICAgLy8gRmlsbCBTdGF0cyBDYXJkc1xuICAgICAgICBjb25zdCBieXRlcyA9IHRvdGFsSW5wdXRTaXplQnl0ZXM7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvLWZpbGUtbmFtZScpLmlubmVyVGV4dCA9IGZpbGVOYW1lO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby10b3RhbC1zaXplLXNpZGUnKS5pbm5lclRleHQgPSAnVG90YWxlOiAnICsgZm9ybWF0Qnl0ZXMoYnl0ZXMpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby10b3RhbC1zaXplJykuaW5uZXJUZXh0ID0gZm9ybWF0Qnl0ZXMoYnl0ZXMpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5mby10YXJnZXQtbGltaXQnKS5pbm5lclRleHQgPSBmb3JtYXRCeXRlcyh0YXJnZXRTaXplKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2luZm8tdG90YWwtY2h1bmtzJykuaW5uZXJUZXh0ID0gY2h1bmtzLmxlbmd0aDtcblxuICAgICAgICAvLyBPcHRpb25hbGx5IHNob3cgcGFyc2luZyB3YXJuaW5nIGVycm9yXG4gICAgICAgIGNvbnN0IGVyckJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbmZvLWVycm9yLWJveCcpO1xuICAgICAgICBpZiAocGFyc2luZ0Vycm9yKSB7XG4gICAgICAgICAgZXJyQm94LmlubmVyVGV4dCA9IHBhcnNpbmdFcnJvcjtcbiAgICAgICAgICBlcnJCb3guY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXJyQm94LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVuZGVyIERlc2t0b3Agc2lkZWJhciBsaXN0XG4gICAgICAgIGNvbnN0IGxpc3RDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVza3RvcC1jaHVua3MtbGlzdCcpO1xuICAgICAgICBsaXN0Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgICAgICBcbiAgICAgICAgLy8gUmVuZGVyIE1vYmlsZSBzZWxlY3Qgb3B0aW9uc1xuICAgICAgICBjb25zdCBtb2JpbGVTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9iaWxlLWNodW5rLXNlbGVjdCcpO1xuICAgICAgICBtb2JpbGVTZWxlY3QuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgY2h1bmtzLmZvckVhY2goKGNodW5rLCBpKSA9PiB7XG4gICAgICAgICAgLy8gbW9iaWxlIHNlbGVjdFxuICAgICAgICAgIGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgIG9wdC52YWx1ZSA9IGk7XG4gICAgICAgICAgb3B0LmlubmVyVGV4dCA9ICcjJyArIChpICsgMSkgKyAnIC0gJyArIGNodW5rLmxhYmVsICsgJyAoJyArIGZvcm1hdEJ5dGVzKGNodW5rLnNpemVCeXRlcykgKyAnKSc7XG4gICAgICAgICAgbW9iaWxlU2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XG5cbiAgICAgICAgICAvLyBkZXNrdG9wIGJ1dHRvblxuICAgICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgIGJ0bi5pZCA9ICdzaWRlLWNodW5rLWJ0bi0nICsgaTtcbiAgICAgICAgICBidG4ub25jbGljayA9ICgpID0+IHNlbGVjdENodW5rKGkpO1xuICAgICAgICAgIGJ0bi5jbGFzc05hbWUgPSBcInRleHQtbGVmdCBwLTIuNSByb3VuZGVkLXhsIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyIGJnLVsjRjlGQUZCXSBob3ZlcjpiZy1ncmF5LTEwMCB0ZXh0LXppbmMtNzAwIGJsb2NrIHctZnVsbFwiO1xuICAgICAgICAgIGJ0bi5pbm5lckhUTUwgPVxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXIgdGV4dC14c1wiPicgK1xuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJ0cnVuY2F0ZSBibG9jayBtYXgtdy1bMTMwcHhdIGZvbnQtbWVkaXVtXCI+JyArIGNodW5rLmxhYmVsICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwidGV4dC1bMTBweF0gb3BhY2l0eS03NSBmb250LW1vbm8gZm9udC1ib2xkXCI+JyArIGZvcm1hdEJ5dGVzKGNodW5rLnNpemVCeXRlcykgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgbGlzdENvbnRhaW5lci5hcHBlbmRDaGlsZChidG4pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZW5kZXJBY3RpdmVDaHVua0RhdGEoKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVuZGVyQWN0aXZlQ2h1bmtEYXRhKCkge1xuICAgICAgICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBjdXJyZW50Q2h1bmsgPSBjaHVua3NbYWN0aXZlQ2h1bmtJbmRleF07XG5cbiAgICAgICAgLy8gdXBkYXRlIG1vYmlsZSBzZWxlY3Rpb24gcGlja2VyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2JpbGUtY2h1bmstc2VsZWN0JykudmFsdWUgPSBhY3RpdmVDaHVua0luZGV4O1xuXG4gICAgICAgIC8vIHVwZGF0ZSBhY3RpdmUgY2xhc3NlcyBvbiBkZXNrdG9wIHNpZGViYXIga2V5cyBsaXN0XG4gICAgICAgIGNodW5rcy5mb3JFYWNoKChfLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgYnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtY2h1bmstYnRuLScgKyBpKTtcbiAgICAgICAgICBpZiAoYnRuKSB7XG4gICAgICAgICAgICBpZiAoaSA9PT0gYWN0aXZlQ2h1bmtJbmRleCkge1xuICAgICAgICAgICAgICBidG4uY2xhc3NOYW1lID0gXCJ0ZXh0LWxlZnQgcC0yLjUgcm91bmRlZC14bCB0cmFuc2l0aW9uLWFsbCBjdXJzb3ItcG9pbnRlciBiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlIGZvbnQtYm9sZCBib3JkZXItbC00IGJvcmRlci1ibHVlLTkwMCBibG9jayB3LWZ1bGxcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJ0bi5jbGFzc05hbWUgPSBcInRleHQtbGVmdCBwLTIuNSByb3VuZGVkLXhsIHRyYW5zaXRpb24tYWxsIGN1cnNvci1wb2ludGVyIGJnLVsjRjlGQUZCXSBob3ZlcjpiZy1ncmF5LTEwMCBkYXJrOmJnLXppbmMtODAwIGRhcms6aG92ZXI6YmctemluYy04NTAvODAgdGV4dC16aW5jLTcwMCBkYXJrOnRleHQtemluYy0zMDAgYmxvY2sgdy1mdWxsXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTZXR1cCB2aWV3aW5nIGJhZGdlIHBhcnRcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXdpbmctcGFydC1iYWRnZScpLmlubmVyVGV4dCA9IFN0cmluZyhhY3RpdmVDaHVua0luZGV4ICsgMSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZXdpbmctcGFydC1tZXRhJykuaW5uZXJUZXh0ID0gJ1NpemU6ICcgKyBmb3JtYXRCeXRlcyhjdXJyZW50Q2h1bmsuc2l6ZUJ5dGVzKSArICcgfCAnICsgKGN1cnJlbnRDaHVuay5pc1ZhbGlkSlNPTiA/ICdWYWxpZCBzeW50YXgnIDogJ1JhdyBjb250ZW50Jyk7XG5cbiAgICAgICAgLy8gVG9nZ2xlIHN5bnRheCBjb2xvcmluZyBidXR0b24gU1ZHIHJlbmRlclxuICAgICAgICBjb25zdCBjb2xvckJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcHQtdG9nZ2xlLWNvbG9ycycpO1xuICAgICAgICBpZiAoaGlnaGxpZ2h0U3ludGF4KSB7XG4gICAgICAgICAgY29sb3JCdG4uaW5uZXJIVE1MID0gRVlFT0ZGX1NWRztcbiAgICAgICAgICBjb2xvckJ0bi50aXRsZSA9IFwiRGlzYXR0aXZhIGNvbG9yaVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbG9yQnRuLmlubmVySFRNTCA9IEVZRV9TVkc7XG4gICAgICAgICAgY29sb3JCdG4udGl0bGUgPSBcIkF0dGl2YSBjb2xvcmlcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldHVwIGxhcmdlIHdhcm5pbmcgYWxlcnRzXG4gICAgICAgIGNvbnN0IHdhcm4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlnaGxpZ2h0LXdhcm5pbmcnKTtcbiAgICAgICAgaWYgKGN1cnJlbnRDaHVuay5jb250ZW50Lmxlbmd0aCA+IDcwMDAwMCkge1xuICAgICAgICAgIHdhcm4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgY29sb3JCdG4uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7IC8vIGhpZGUgY29sb3JzIGJ1dHRvbiBpZiBodWdlIGZpbGUgYnlwYXNzZXMgaGlnaGxpZ2h0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2Fybi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICBjb2xvckJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbmRlciBjb2RlIGJsb2NrXG4gICAgICAgIGNvbnN0IHByZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYXctY29kZS1ibG9jaycpO1xuICAgICAgICBpZiAoaGlnaGxpZ2h0U3ludGF4ICYmIGN1cnJlbnRDaHVuay5jb250ZW50Lmxlbmd0aCA8PSA3MDAwMDApIHtcbiAgICAgICAgICBwcmUuaW5uZXJIVE1MID0gY29tcGlsZUhpZ2hsaWdodGVkKGN1cnJlbnRDaHVuay5jb250ZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmUuaW5uZXJUZXh0ID0gY3VycmVudENodW5rLmNvbnRlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOYXZpZ2F0aW9uIHN0YXRlIGJhclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWJ0bi1zdGF0dXMtYmFkZ2UnKS5pbm5lclRleHQgPSAnUEFSVCAnICsgKGFjdGl2ZUNodW5rSW5kZXggKyAxKSArICcgT0YgJyArIGNodW5rcy5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICAvLyBQcmV2IGJ1dHRvbiBib3VuZGFyeSBkaXNhYmxlZC9hY3RpdmUgY2xhc3Mgc3RhdGVzXG4gICAgICAgIGNvbnN0IHByZXZCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWJ0bi1wcmV2Jyk7XG4gICAgICAgIGlmIChhY3RpdmVDaHVua0luZGV4ID09PSAwKSB7XG4gICAgICAgICAgcHJldkJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgcHJldkJ0bi5jbGFzc05hbWUgPSBcImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgcHgtNiBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGwgY3Vyc29yLW5vdC1hbGxvd2VkIHRleHQtZ3JheS00MDAgYmctZ3JheS0xMDUgZGFyazp0ZXh0LXppbmMtNjAwIGRhcms6YmctemluYy04MDBcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmV2QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgcHJldkJ0bi5jbGFzc05hbWUgPSBcImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgcHgtNiBweS0yIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgdHJhbnNpdGlvbi1hbGwgYWN0aXZlOnNjYWxlLTk1IGN1cnNvci1wb2ludGVyIGJvcmRlciBib3JkZXItZ3JheS0zMDAgZGFyazpib3JkZXItemluYy03NTAgdGV4dC1ncmF5LTcwMCBkYXJrOnRleHQtemluYy0xNTAgYmctd2hpdGUgZGFyazpiZy16aW5jLTgwMCBob3ZlcjpiZy1ncmF5LTUwXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOZXh0IGJ1dHRvbiBib3VuZGFyeSBkaXNhYmxlZC9hY3RpdmUgY2xhc3Mgc3RhdGVzXG4gICAgICAgIGNvbnN0IG5leHRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWJ0bi1uZXh0Jyk7XG4gICAgICAgIGlmIChhY3RpdmVDaHVua0luZGV4ID09PSBjaHVua3MubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIG5leHRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIG5leHRCdG4uY2xhc3NOYW1lID0gXCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHB4LTYgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ib2xkIHRyYW5zaXRpb24tYWxsIGN1cnNvci1ub3QtYWxsb3dlZCB0ZXh0LWdyYXktNDAwIGJnLWdyYXktMTA1IGRhcms6dGV4dC16aW5jLTYwMCBkYXJrOmJnLXppbmMtODAwXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgIG5leHRCdG4uY2xhc3NOYW1lID0gXCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHB4LTYgcHktMiByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ib2xkIHRyYW5zaXRpb24tYWxsIGFjdGl2ZTpzY2FsZS05NSBjdXJzb3ItcG9pbnRlciBiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlIGhvdmVyOmJnLWJsdWUtNzAwIHNoYWRvdy1tZFwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHRvZ2dsZUhpZ2hsaWdodFN5bnRheCgpIHtcbiAgICAgICAgaGlnaGxpZ2h0U3ludGF4ID0gIWhpZ2hsaWdodFN5bnRheDtcbiAgICAgICAgcmVuZGVyQWN0aXZlQ2h1bmtEYXRhKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFjdGlvbnNcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGNvcHlBY3RpdmVDaHVuaygpIHtcbiAgICAgICAgaWYgKGNodW5rcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgICAgY29uc3QgY3VycmVudENodW5rID0gY2h1bmtzW2FjdGl2ZUNodW5rSW5kZXhdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChuYXZpZ2F0b3IuY2xpcGJvYXJkICYmIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KSB7XG4gICAgICAgICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChjdXJyZW50Q2h1bmsuY29udGVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFVuc2VjdXJlIGNvbnRleHQgRmFsbGJhY2tcbiAgICAgICAgICAgIGNvbnN0IHRlbXBUZXh0QXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICB0ZW1wVGV4dEFyZWEudmFsdWUgPSBjdXJyZW50Q2h1bmsuY29udGVudDtcbiAgICAgICAgICAgIHRlbXBUZXh0QXJlYS5zdHlsZS50b3AgPSAnMCc7XG4gICAgICAgICAgICB0ZW1wVGV4dEFyZWEuc3R5bGUubGVmdCA9ICcwJztcbiAgICAgICAgICAgIHRlbXBUZXh0QXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgICAgICAgICB0ZW1wVGV4dEFyZWEuc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcFRleHRBcmVhKTtcbiAgICAgICAgICAgIHRlbXBUZXh0QXJlYS5mb2N1cygpO1xuICAgICAgICAgICAgdGVtcFRleHRBcmVhLnNlbGVjdCgpO1xuICAgICAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRlbXBUZXh0QXJlYSk7XG4gICAgICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleGVjQ29tbWFuZCBjb3B5IGZhaWxlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBjb25zdCBidG5UZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvcHktYnRuLXRleHQnKTtcbiAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3B5LWljb24tcGxhY2Vob2xkZXInKTtcbiAgICAgICAgICBcbiAgICAgICAgICBidG5UZXh0LmlubmVyVGV4dCA9ICdDb3BpZWQhIOKchSc7XG4gICAgICAgICAgcGxhY2Vob2xkZXIuaW5uZXJIVE1MID0gQ0hFQ0tfU1ZHO1xuICAgICAgICAgIFxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgYnRuVGV4dC5pbm5lclRleHQgPSAnQ29weSc7XG4gICAgICAgICAgICBwbGFjZWhvbGRlci5pbm5lckhUTUwgPSBDT1BZX1NWRztcbiAgICAgICAgICB9LCAyMDAwKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgYWxlcnQoJ0Vycm9yZSBkaSBjb3BpYS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBkb3dubG9hZEFjdGl2ZUNodW5rKCkge1xuICAgICAgICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBjdXJyZW50Q2h1bmsgPSBjaHVua3NbYWN0aXZlQ2h1bmtJbmRleF07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtjdXJyZW50Q2h1bmsuY29udGVudF0sIHsgdHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nIH0pO1xuICAgICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgICAgICAgbGluay5kb3dubG9hZCA9ICdjaHVua18nICsgKGN1cnJlbnRDaHVuay5pbmRleCArIDEpICsgJy5qc29uJztcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpbmspO1xuICAgICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICAgICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgYWxlcnQoJ0ltcG9zc2liaWxlIHNjYXJpY2FyZS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBTZWFyY2ggZW5naW5lIGluc2lkZSBjaHVuayBjb250ZW50IGJsb2NrXG4gICAgICBmdW5jdGlvbiBoYW5kbGVTZWFyY2hTZWFyY2goKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NodW5rLXNlYXJjaC1pbnB1dCcpO1xuICAgICAgICBzZWFyY2hUZXJtID0gaW5wdXQudmFsdWUudHJpbSgpO1xuXG4gICAgICAgIGlmICghc2VhcmNoVGVybSB8fCBzZWFyY2hUZXJtLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICBzZWFyY2hSZXN1bHRzID0gW107XG4gICAgICAgICAgc2VhcmNoSW5kZXggPSAtMTtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLXJlc3VsdHMtY29udHJvbHMnKS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50Q2h1bmsgPSBjaHVua3NbYWN0aXZlQ2h1bmtJbmRleF07XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBjdXJyZW50Q2h1bmsuY29udGVudDtcbiAgICAgICAgXG4gICAgICAgIHNlYXJjaFJlc3VsdHMgPSBbXTtcbiAgICAgICAgbGV0IGluZGV4ID0gY29udGVudC50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgd2hpbGUgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHNlYXJjaFJlc3VsdHMucHVzaChpbmRleCk7XG4gICAgICAgICAgaW5kZXggPSBjb250ZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2hUZXJtLnRvTG93ZXJDYXNlKCksIGluZGV4ICsgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VhcmNoSW5kZXggPSAwO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtcmVzdWx0cy1jb250cm9scycpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY291bnRlcicpLmlubmVyVGV4dCA9ICcxIG9mICcgKyBzZWFyY2hSZXN1bHRzLmxlbmd0aDtcbiAgICAgICAgICBzY3JvbGxUb1Bvc2l0aW9uKHNlYXJjaFJlc3VsdHNbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlYXJjaEluZGV4ID0gLTE7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1yZXN1bHRzLWNvbnRyb2xzJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jb3VudGVyJykuaW5uZXJUZXh0ID0gJzAgb2YgMCc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbmF2aWdhdGVTZWFyY2goZGlyKSB7XG4gICAgICAgIGlmIChzZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgICBzZWFyY2hJbmRleCA9IChzZWFyY2hJbmRleCArIGRpciArIHNlYXJjaFJlc3VsdHMubGVuZ3RoKSAlIHNlYXJjaFJlc3VsdHMubGVuZ3RoO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWNvdW50ZXInKS5pbm5lclRleHQgPSAoc2VhcmNoSW5kZXggKyAxKSArICcgb2YgJyArIHNlYXJjaFJlc3VsdHMubGVuZ3RoO1xuICAgICAgICBzY3JvbGxUb1Bvc2l0aW9uKHNlYXJjaFJlc3VsdHNbc2VhcmNoSW5kZXhdKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2Nyb2xsVG9Qb3NpdGlvbihjaGFySWR4KSB7XG4gICAgICAgIGNvbnN0IHByZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYXctY29kZS1ibG9jaycpO1xuICAgICAgICBpZiAoIXByZSkgcmV0dXJuO1xuICAgICAgICBjb25zdCB0b3RhbExlbiA9IGNodW5rc1thY3RpdmVDaHVua0luZGV4XS5jb250ZW50Lmxlbmd0aDtcbiAgICAgICAgY29uc3QgcmF0aW8gPSBjaGFySWR4IC8gdG90YWxMZW47XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHByZS5zY3JvbGxIZWlnaHQgKiByYXRpbyAtIDEwMDtcbiAgICAgICAgcHJlLnNjcm9sbFRvKHtcbiAgICAgICAgICB0b3A6IE1hdGgubWF4KDAsIHRhcmdldCksXG4gICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBJbnRlcmNldHRvcmUgZGVnbGkgZXZlbnRpIGRpIGluY29sbGEgcGVyIGZpbGUgbyB0ZXN0aSBwZXNhbnRpIChHbG9iYWxlIGNvbWUgaW4gUmVhY3QpXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vIDEuIENoZWNrIGlmIHdlIGhhdmUgZmlsZXMgaW4gY2xpcGJvYXJkXG4gICAgICAgIGNvbnN0IGZpbGVzID0gKGUuY2xpcGJvYXJkRGF0YSAmJiBlLmNsaXBib2FyZERhdGEuZmlsZXMpID8gZS5jbGlwYm9hcmREYXRhLmZpbGVzIDogbnVsbDtcbiAgICAgICAgaWYgKGZpbGVzICYmIGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgY29uc3QgZmlsZSA9IGZpbGVzWzBdO1xuICAgICAgICAgIGZpbGVOYW1lID0gZmlsZS5uYW1lO1xuICAgICAgICAgIHNob3dMb2FkaW5nKCdGaWxlIGluY29sbGF0byEgTGV0dHVyYSBpbiBjb3Jzby4uLicpO1xuICAgICAgICAgIFxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gcmVhZGVyLnJlc3VsdDtcbiAgICAgICAgICAgICAgcHJvY2Vzc0pTT05EYXRhKHRleHQsIGZpbGUubmFtZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgYWxlcnQoJ0Vycm9yZSBuZWxsYSBsZXR0dXJhIGRlbCBmaWxlIGluY29sbGF0by4nKTtcbiAgICAgICAgICAgICAgaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgICAgICB9LCAxNTApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIuIENoZWNrIGlmIHdlIGhhdmUgdGV4dCBpbiBjbGlwYm9hcmRcbiAgICAgICAgY29uc3QgdGV4dCA9IChlLmNsaXBib2FyZERhdGEgJiYgdHlwZW9mIGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhID09PSAnZnVuY3Rpb24nKSA/IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0JykgOiAnJztcbiAgICAgICAgaWYgKHRleHQgJiYgdGV4dC50cmltKCkpIHtcbiAgICAgICAgICBjb25zdCB0cmltbWVkID0gdGV4dC50cmltKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy8gU2UgbCd1dGVudGUgc3RhIG1vZGlmaWNhbmRvIGxhIGJhcnJhIGRpIHJpY2VyY2EgaW50ZXJuYSBkZWwgcGV6em8sIGxhc2NpYSBmYXJlIG5hdGl2ZSBwYXN0ZVxuICAgICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgIGlmIChhY3RpdmVFbGVtZW50ICYmIGFjdGl2ZUVsZW1lbnQuaWQgPT09ICdjaHVuay1zZWFyY2gtaW5wdXQnKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIENvbnNlbnRlIG5hdGl2ZSBwYXN0ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJpbGV2YW1lbnRvIGF1dG9tYXRpY28gaW50ZWxsaWdlbnRlIGRpIHRlc3RvIEpTT046IHNlIGluaXppYSBjb24geyBvIFssIGVsYWJvcmEgaW1tZWRpYXRhbWVudGUgQVVUT01BVElDQU1FTlRFIVxuICAgICAgICAgIGlmICh0cmltbWVkLnN0YXJ0c1dpdGgoJ3snKSB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJ1snKSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2hvd0xvYWRpbmcoJ0VsYWJvcmF6aW9uZSBKU09OIGluY29sbGF0byBhdXRvbWF0aWNvLi4uJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcm9jZXNzSlNPTkRhdGEodGV4dCwgJ3Bhc3RlZF9qc29uLmpzb24nKTtcbiAgICAgICAgICAgIH0sIDEyMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU2Ugw6ggZm9jdXNlZCBzdWxsYSB0ZXh0YXJlYSBlZCDDqCB0ZXN0byBlbm9ybWUgKD4gMTAwIEtCKSBtYSBub24gw6ggcGVyIGZvcnphIEpTT04gdmFsaWRvLFxuICAgICAgICAgIC8vIGxvIGludGVyY2V0dGlhbW8gcGVyIGV2aXRhcmUgbGFnIHRyZW1lbmRpIGRlbCB0aHJlYWQgVUkgbmF0aXZvIGRlbGxlIHRleHRhcmVhXG4gICAgICAgICAgaWYgKGFjdGl2ZUVsZW1lbnQgJiYgYWN0aXZlRWxlbWVudC5pZCA9PT0gJ3Bhc3RlLXRleHRhcmVhJyAmJiB0ZXh0Lmxlbmd0aCA+IDEwMDAwMCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2hvd0xvYWRpbmcoJ1BhcmlmaWNhbmRvIHRlc3RvIGluY29sbGF0byBwZXNhbnRlLi4uJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcm9jZXNzSlNPTkRhdGEodGV4dCwgJ3Bhc3RlZF9oZWF2eV9qc29uLmpzb24nKTtcbiAgICAgICAgICAgIH0sIDEyMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gSW5pdGlhbGl6YXRpb24gY2FsbGVyXG4gICAgICBpbml0aWFsaXplQXNzZXRzKCk7XG4gICAgICB0b2dnbGVQcm9jZXNzQnV0dG9uKCk7XG4gICAgPC9zY3JpcHQ+XG4gIDwvYm9keT5cbjwvaHRtbD5gO1xufVxuXG4iXSwibWFwcGluZ3MiOiJBQUtPLGdCQUFTLG9CQUFvQixvQkFBNkIsTUFBYztBQUM3RSxTQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUNBb0Q0QixvQkFBb0IsbUNBQW1DLDRCQUE0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBeUNqRyxvQkFBb0IsK0JBQStCLDJCQUEyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSx5QkE2WDVFLGlCQUFpQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFrM0IxQzsiLCJuYW1lcyI6W119