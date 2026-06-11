export function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
export function splitJSONContent(rawText, targetChunkSizeBytes = 45e4, forceMode) {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { chunks: [], modeUsed: "raw_text", error: "Il testo inserito è vuoto." };
  }
  if (trimmed.length <= targetChunkSizeBytes) {
    let isValid = false;
    try {
      JSON.parse(trimmed);
      isValid = true;
    } catch {
    }
    return {
      chunks: [
        {
          index: 0,
          label: "Blocco Unico",
          sizeBytes: new Blob([trimmed]).size,
          content: trimmed,
          isValidJSON: isValid
        }
      ],
      modeUsed: "auto"
    };
  }
  let parsed = null;
  let parseError = null;
  let isParsed = false;
  try {
    parsed = JSON.parse(trimmed);
    isParsed = true;
  } catch (err) {
    parseError = err?.message || "Errore generico di parsing JSON";
  }
  const chunks = [];
  let modeUsed = "raw_text";
  if (isParsed && forceMode !== "raw_text") {
    if (Array.isArray(parsed) && forceMode !== "object_keys") {
      modeUsed = "array_items";
      let currentGroup = [];
      let currentLenEstimate = 2;
      let chunkIndex = 0;
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        const itemStr = JSON.stringify(item);
        const itemLen = itemStr.length + 1;
        if (currentGroup.length > 0 && currentLenEstimate + itemLen > targetChunkSizeBytes) {
          const chunkJson = JSON.stringify(currentGroup, null, 2);
          const size = new Blob([chunkJson]).size;
          chunks.push({
            index: chunkIndex,
            label: `Blocco ${chunkIndex + 1} (Elementi ${i - currentGroup.length} - ${i - 1})`,
            sizeBytes: size,
            content: chunkJson,
            itemCount: currentGroup.length,
            isValidJSON: true
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
        const size = new Blob([chunkJson]).size;
        chunks.push({
          index: chunkIndex,
          label: `Blocco ${chunkIndex + 1} (Elementi ${parsed.length - currentGroup.length} - ${parsed.length - 1})`,
          sizeBytes: size,
          content: chunkJson,
          itemCount: currentGroup.length,
          isValidJSON: true
        });
      }
    } else if (typeof parsed === "object" && parsed !== null && forceMode !== "array_items") {
      modeUsed = "object_keys";
      const entries = Object.entries(parsed);
      let currentGroup = {};
      let currentLenEstimate = 2;
      let chunkIndex = 0;
      let lastIndex = 0;
      for (let i = 0; i < entries.length; i++) {
        const [key, val] = entries[i];
        const entryStr = `"${key}":${JSON.stringify(val)}`;
        const entryLen = entryStr.length + 1;
        if (Object.keys(currentGroup).length > 0 && currentLenEstimate + entryLen > targetChunkSizeBytes) {
          const chunkJson = JSON.stringify(currentGroup, null, 2);
          const size = new Blob([chunkJson]).size;
          const kList = Object.keys(currentGroup);
          chunks.push({
            index: chunkIndex,
            label: `Blocco ${chunkIndex + 1} (${kList[0]} ... ${kList[kList.length - 1]})`,
            sizeBytes: size,
            content: chunkJson,
            rawKeys: kList,
            isValidJSON: true
          });
          currentGroup = { [key]: val };
          currentLenEstimate = 2 + entryStr.length;
          chunkIndex++;
          lastIndex = i;
        } else {
          currentGroup[key] = val;
          currentLenEstimate += entryLen;
        }
      }
      if (Object.keys(currentGroup).length > 0) {
        const chunkJson = JSON.stringify(currentGroup, null, 2);
        const size = new Blob([chunkJson]).size;
        const kList = Object.keys(currentGroup);
        chunks.push({
          index: chunkIndex,
          label: `Blocco ${chunkIndex + 1} (${kList[0]} ... ${kList[kList.length - 1]})`,
          sizeBytes: size,
          content: chunkJson,
          rawKeys: kList,
          isValidJSON: true
        });
      }
    } else {
      modeUsed = "raw_text";
    }
  }
  if (chunks.length === 0) {
    modeUsed = "raw_text";
    const lines = trimmed.split("\n");
    let chunkIndex = 0;
    let currentText = "";
    let currentLenBytes = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] + "\n";
      const lineBytes = new Blob([line]).size;
      if (currentText.length > 0 && currentLenBytes + lineBytes > targetChunkSizeBytes) {
        chunks.push({
          index: chunkIndex,
          label: `Blocco ${chunkIndex + 1} (Righe ~${chunkIndex * 1500} in poi)`,
          sizeBytes: currentLenBytes,
          content: currentText,
          isValidJSON: false
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
      chunks.push({
        index: chunkIndex,
        label: `Blocco ${chunkIndex + 1} (Fino a riga ${lines.length})`,
        sizeBytes: currentLenBytes,
        content: currentText,
        isValidJSON: false
      });
    }
  }
  if (chunks.length === 0) {
    let charIndex = 0;
    let chunkIndex = 0;
    const sizeChars = Math.floor(targetChunkSizeBytes / 2) || 1e5;
    while (charIndex < trimmed.length) {
      const chunkText = trimmed.substring(charIndex, charIndex + sizeChars);
      const sizeBytes = new Blob([chunkText]).size;
      chunks.push({
        index: chunkIndex,
        label: `Blocco ${chunkIndex + 1} (Caratteri ${charIndex} - ${charIndex + chunkText.length})`,
        sizeBytes,
        content: chunkText,
        isValidJSON: false
      });
      charIndex += sizeChars;
      chunkIndex++;
    }
  }
  return {
    chunks,
    modeUsed,
    error: parseError ? `Nota: Parsing fallito, diviso come testo grezzo. (${parseError})` : void 0
  };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEpTT05DaHVuaywgU3BsaXRNb2RlIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogRm9ybWF0byBkaSBjb21vZG8gcGVyIGxlIGRpbWVuc2lvbmkgZGVpIGZpbGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEJ5dGVzKGJ5dGVzOiBudW1iZXIpOiBzdHJpbmcge1xuICBpZiAoYnl0ZXMgPT09IDApIHJldHVybiAnMCBCJztcbiAgY29uc3QgayA9IDEwMjQ7XG4gIGNvbnN0IHNpemVzID0gWydCJywgJ0tCJywgJ01CJywgJ0dCJ107XG4gIGNvbnN0IGkgPSBNYXRoLmZsb29yKE1hdGgubG9nKGJ5dGVzKSAvIE1hdGgubG9nKGspKTtcbiAgcmV0dXJuIHBhcnNlRmxvYXQoKGJ5dGVzIC8gTWF0aC5wb3coaywgaSkpLnRvRml4ZWQoMikpICsgJyAnICsgc2l6ZXNbaV07XG59XG5cbi8qKlxuICogQWxnb3JpdG1vIGludGVsbGlnZW50ZSBkaSBzcGxpdHRpbmcgSlNPTlxuICogQ2VyY2EgZGkgZGl2aWRlcmUgaWwgZmlsZSBpbiBibG9jY2hpIHZhbGlkaSBkYWwgcHVudG8gZGkgdmlzdGEgc2ludGF0dGljb1xuICovXG5leHBvcnQgZnVuY3Rpb24gc3BsaXRKU09OQ29udGVudChcbiAgcmF3VGV4dDogc3RyaW5nLFxuICB0YXJnZXRDaHVua1NpemVCeXRlczogbnVtYmVyID0gNDUwMDAwLCAvLyBEZWZhdWx0IH40NTAgS0JcbiAgZm9yY2VNb2RlPzogU3BsaXRNb2RlXG4pOiB7IGNodW5rczogSlNPTkNodW5rW107IG1vZGVVc2VkOiBTcGxpdE1vZGU7IGVycm9yPzogc3RyaW5nIH0ge1xuICBjb25zdCB0cmltbWVkID0gcmF3VGV4dC50cmltKCk7XG4gIGlmICghdHJpbW1lZCkge1xuICAgIHJldHVybiB7IGNodW5rczogW10sIG1vZGVVc2VkOiAncmF3X3RleHQnLCBlcnJvcjogJ0lsIHRlc3RvIGluc2VyaXRvIMOoIHZ1b3RvLicgfTtcbiAgfVxuXG4gIC8vIFNlIGlsIGZpbGUgw6ggbW9sdG8gcGljY29sbywgcmVzdGl0dWlhbW8gdW4gc2luZ29sbyBibG9jY28gaW1tZWRpYXRvXG4gIGlmICh0cmltbWVkLmxlbmd0aCA8PSB0YXJnZXRDaHVua1NpemVCeXRlcykge1xuICAgIGxldCBpc1ZhbGlkID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIEpTT04ucGFyc2UodHJpbW1lZCk7XG4gICAgICBpc1ZhbGlkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIElnbm9yYSBlcnJvcmVcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY2h1bmtzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpbmRleDogMCxcbiAgICAgICAgICBsYWJlbDogJ0Jsb2NjbyBVbmljbycsXG4gICAgICAgICAgc2l6ZUJ5dGVzOiBuZXcgQmxvYihbdHJpbW1lZF0pLnNpemUsXG4gICAgICAgICAgY29udGVudDogdHJpbW1lZCxcbiAgICAgICAgICBpc1ZhbGlkSlNPTjogaXNWYWxpZCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBtb2RlVXNlZDogJ2F1dG8nLFxuICAgIH07XG4gIH1cblxuICAvLyBQcm92aWFtbyBhIGZhcmUgaWwgcGFyc2luZyBkZWwgSlNPTiBwZXIgY2FwaXJlIGxhIHN0cnV0dHVyYVxuICBsZXQgcGFyc2VkOiBhbnkgPSBudWxsO1xuICBsZXQgcGFyc2VFcnJvcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBpc1BhcnNlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgcGFyc2VkID0gSlNPTi5wYXJzZSh0cmltbWVkKTtcbiAgICBpc1BhcnNlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgcGFyc2VFcnJvciA9IGVycj8ubWVzc2FnZSB8fCAnRXJyb3JlIGdlbmVyaWNvIGRpIHBhcnNpbmcgSlNPTic7XG4gIH1cblxuICBjb25zdCBjaHVua3M6IEpTT05DaHVua1tdID0gW107XG4gIGxldCBtb2RlVXNlZDogU3BsaXRNb2RlID0gJ3Jhd190ZXh0JztcblxuICAvLyBTZSBsbyBhYmJpYW1vIHBhcnNhdG8gY29ycmV0dGFtZW50ZSBlIG5vbiBzaWFtbyBjb3N0cmV0dGkgYWxsYSBtb2RhbGl0w6AgcmF3X3RleHRcbiAgaWYgKGlzUGFyc2VkICYmIGZvcmNlTW9kZSAhPT0gJ3Jhd190ZXh0Jykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcnNlZCkgJiYgZm9yY2VNb2RlICE9PSAnb2JqZWN0X2tleXMnKSB7XG4gICAgICBtb2RlVXNlZCA9ICdhcnJheV9pdGVtcyc7XG4gICAgICAvLyBEaXZpZGlhbW8gbCdhcnJheVxuICAgICAgbGV0IGN1cnJlbnRHcm91cDogYW55W10gPSBbXTtcbiAgICAgIGxldCBjdXJyZW50TGVuRXN0aW1hdGUgPSAyOyAvLyBBcGVydHVyYSBzdGFmZmEgJ1snIGUgY2hpdXN1cmEgJ10nXG4gICAgICBsZXQgY2h1bmtJbmRleCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBwYXJzZWRbaV07XG4gICAgICAgIGNvbnN0IGl0ZW1TdHIgPSBKU09OLnN0cmluZ2lmeShpdGVtKTtcbiAgICAgICAgY29uc3QgaXRlbUxlbiA9IGl0ZW1TdHIubGVuZ3RoICsgMTsgLy8gKzEgcGVyIGxhIHZpcmdvbGEgJywnXG5cbiAgICAgICAgaWYgKGN1cnJlbnRHcm91cC5sZW5ndGggPiAwICYmIGN1cnJlbnRMZW5Fc3RpbWF0ZSArIGl0ZW1MZW4gPiB0YXJnZXRDaHVua1NpemVCeXRlcykge1xuICAgICAgICAgIC8vIFNhbHZpYW1vIGlsIGdydXBwbyBhdHR1YWxlXG4gICAgICAgICAgY29uc3QgY2h1bmtKc29uID0gSlNPTi5zdHJpbmdpZnkoY3VycmVudEdyb3VwLCBudWxsLCAyKTtcbiAgICAgICAgICBjb25zdCBzaXplID0gbmV3IEJsb2IoW2NodW5rSnNvbl0pLnNpemU7XG4gICAgICAgICAgY2h1bmtzLnB1c2goe1xuICAgICAgICAgICAgaW5kZXg6IGNodW5rSW5kZXgsXG4gICAgICAgICAgICBsYWJlbDogYEJsb2NjbyAke2NodW5rSW5kZXggKyAxfSAoRWxlbWVudGkgJHtpIC0gY3VycmVudEdyb3VwLmxlbmd0aH0gLSAke2kgLSAxfSlgLFxuICAgICAgICAgICAgc2l6ZUJ5dGVzOiBzaXplLFxuICAgICAgICAgICAgY29udGVudDogY2h1bmtKc29uLFxuICAgICAgICAgICAgaXRlbUNvdW50OiBjdXJyZW50R3JvdXAubGVuZ3RoLFxuICAgICAgICAgICAgaXNWYWxpZEpTT046IHRydWUsXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBSZXNldCBwZXIgaWwgcHJvc3NpbW8gYmxvY2NvXG4gICAgICAgICAgY3VycmVudEdyb3VwID0gW2l0ZW1dO1xuICAgICAgICAgIGN1cnJlbnRMZW5Fc3RpbWF0ZSA9IDIgKyBpdGVtU3RyLmxlbmd0aDtcbiAgICAgICAgICBjaHVua0luZGV4Kys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudEdyb3VwLnB1c2goaXRlbSk7XG4gICAgICAgICAgY3VycmVudExlbkVzdGltYXRlICs9IGl0ZW1MZW47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVWx0aW1vIHBlenpvIHJpbWFzdG9cbiAgICAgIGlmIChjdXJyZW50R3JvdXAubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjaHVua0pzb24gPSBKU09OLnN0cmluZ2lmeShjdXJyZW50R3JvdXAsIG51bGwsIDIpO1xuICAgICAgICBjb25zdCBzaXplID0gbmV3IEJsb2IoW2NodW5rSnNvbl0pLnNpemU7XG4gICAgICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgICBpbmRleDogY2h1bmtJbmRleCxcbiAgICAgICAgICBsYWJlbDogYEJsb2NjbyAke2NodW5rSW5kZXggKyAxfSAoRWxlbWVudGkgJHtwYXJzZWQubGVuZ3RoIC0gY3VycmVudEdyb3VwLmxlbmd0aH0gLSAke3BhcnNlZC5sZW5ndGggLSAxfSlgLFxuICAgICAgICAgIHNpemVCeXRlczogc2l6ZSxcbiAgICAgICAgICBjb250ZW50OiBjaHVua0pzb24sXG4gICAgICAgICAgaXRlbUNvdW50OiBjdXJyZW50R3JvdXAubGVuZ3RoLFxuICAgICAgICAgIGlzVmFsaWRKU09OOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXJzZWQgPT09ICdvYmplY3QnICYmIHBhcnNlZCAhPT0gbnVsbCAmJiBmb3JjZU1vZGUgIT09ICdhcnJheV9pdGVtcycpIHtcbiAgICAgIG1vZGVVc2VkID0gJ29iamVjdF9rZXlzJztcbiAgICAgIC8vIERpdmlkaWFtbyB1biBvZ2dldHRvIGdyYW5kZSBwZXIgbGUgc3VlIGNoaWF2aSBkaSBwcmltbyBsaXZlbGxvXG4gICAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMocGFyc2VkKTtcbiAgICAgIGxldCBjdXJyZW50R3JvdXA6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgICAgIGxldCBjdXJyZW50TGVuRXN0aW1hdGUgPSAyOyAvLyAneycgZSAnfSdcbiAgICAgIGxldCBjaHVua0luZGV4ID0gMDtcbiAgICAgIGxldCBsYXN0SW5kZXggPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgW2tleSwgdmFsXSA9IGVudHJpZXNbaV07XG4gICAgICAgIGNvbnN0IGVudHJ5U3RyID0gYFwiJHtrZXl9XCI6JHtKU09OLnN0cmluZ2lmeSh2YWwpfWA7XG4gICAgICAgIGNvbnN0IGVudHJ5TGVuID0gZW50cnlTdHIubGVuZ3RoICsgMTsgLy8gKzEgcGVyIGxhIHZpcmdvbGEgJywnXG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGN1cnJlbnRHcm91cCkubGVuZ3RoID4gMCAmJiBjdXJyZW50TGVuRXN0aW1hdGUgKyBlbnRyeUxlbiA+IHRhcmdldENodW5rU2l6ZUJ5dGVzKSB7XG4gICAgICAgICAgLy8gU2FsdmEgYmxvY2NvXG4gICAgICAgICAgY29uc3QgY2h1bmtKc29uID0gSlNPTi5zdHJpbmdpZnkoY3VycmVudEdyb3VwLCBudWxsLCAyKTtcbiAgICAgICAgICBjb25zdCBzaXplID0gbmV3IEJsb2IoW2NodW5rSnNvbl0pLnNpemU7XG4gICAgICAgICAgY29uc3Qga0xpc3QgPSBPYmplY3Qua2V5cyhjdXJyZW50R3JvdXApO1xuICAgICAgICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgICAgIGluZGV4OiBjaHVua0luZGV4LFxuICAgICAgICAgICAgbGFiZWw6IGBCbG9jY28gJHtjaHVua0luZGV4ICsgMX0gKCR7a0xpc3RbMF19IC4uLiAke2tMaXN0W2tMaXN0Lmxlbmd0aCAtIDFdfSlgLFxuICAgICAgICAgICAgc2l6ZUJ5dGVzOiBzaXplLFxuICAgICAgICAgICAgY29udGVudDogY2h1bmtKc29uLFxuICAgICAgICAgICAgcmF3S2V5czoga0xpc3QsXG4gICAgICAgICAgICBpc1ZhbGlkSlNPTjogdHJ1ZSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGN1cnJlbnRHcm91cCA9IHsgW2tleV06IHZhbCB9O1xuICAgICAgICAgIGN1cnJlbnRMZW5Fc3RpbWF0ZSA9IDIgKyBlbnRyeVN0ci5sZW5ndGg7XG4gICAgICAgICAgY2h1bmtJbmRleCsrO1xuICAgICAgICAgIGxhc3RJbmRleCA9IGk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudEdyb3VwW2tleV0gPSB2YWw7XG4gICAgICAgICAgY3VycmVudExlbkVzdGltYXRlICs9IGVudHJ5TGVuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChPYmplY3Qua2V5cyhjdXJyZW50R3JvdXApLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY2h1bmtKc29uID0gSlNPTi5zdHJpbmdpZnkoY3VycmVudEdyb3VwLCBudWxsLCAyKTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IG5ldyBCbG9iKFtjaHVua0pzb25dKS5zaXplO1xuICAgICAgICBjb25zdCBrTGlzdCA9IE9iamVjdC5rZXlzKGN1cnJlbnRHcm91cCk7XG4gICAgICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgICBpbmRleDogY2h1bmtJbmRleCxcbiAgICAgICAgICBsYWJlbDogYEJsb2NjbyAke2NodW5rSW5kZXggKyAxfSAoJHtrTGlzdFswXX0gLi4uICR7a0xpc3Rba0xpc3QubGVuZ3RoIC0gMV19KWAsXG4gICAgICAgICAgc2l6ZUJ5dGVzOiBzaXplLFxuICAgICAgICAgIGNvbnRlbnQ6IGNodW5rSnNvbixcbiAgICAgICAgICByYXdLZXlzOiBrTGlzdCxcbiAgICAgICAgICBpc1ZhbGlkSlNPTjogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEpTT04gdmFsaWRvIG1hIMOoIHVuIHNpbmdvbG8gdmFsb3JlIHByaW1pdGl2byBvIHRpcG8gbm9uIHN0cnV0dHVyYXRvIGdyYW5kZSAoc3RyaW5nYSBvIG51bWVybyBlbm9ybWUpXG4gICAgICBtb2RlVXNlZCA9ICdyYXdfdGV4dCc7XG4gICAgfVxuICB9XG5cbiAgLy8gU2UgaWwgcGFyc2luZyBoYSBmYWxsaXRvIG8gw6ggc3RhdGEgcmljaGllc3RhL3JpY2FkdXRhIGxhIG1vZGFsaXTDoCBSYXcgVGV4dFxuICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIG1vZGVVc2VkID0gJ3Jhd190ZXh0JztcbiAgICAvLyBEaXZpZGlhbW8gc2VtcGxpY2VtZW50ZSBwZXIgcmlnaGUgbyBwZXIgbHVuZ2hlenphIGZpc3NhIHNlIG5vbiBjaSBzb25vIHJpZ2hlXG4gICAgY29uc3QgbGluZXMgPSB0cmltbWVkLnNwbGl0KCdcXG4nKTtcbiAgICBsZXQgY2h1bmtJbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnRUZXh0ID0gJyc7XG4gICAgbGV0IGN1cnJlbnRMZW5CeXRlcyA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaW5lID0gbGluZXNbaV0gKyAnXFxuJztcbiAgICAgIGNvbnN0IGxpbmVCeXRlcyA9IG5ldyBCbG9iKFtsaW5lXSkuc2l6ZTtcblxuICAgICAgaWYgKGN1cnJlbnRUZXh0Lmxlbmd0aCA+IDAgJiYgY3VycmVudExlbkJ5dGVzICsgbGluZUJ5dGVzID4gdGFyZ2V0Q2h1bmtTaXplQnl0ZXMpIHtcbiAgICAgICAgLy8gQ2hpdWRpIGJsb2Njb1xuICAgICAgICBjaHVua3MucHVzaCh7XG4gICAgICAgICAgaW5kZXg6IGNodW5rSW5kZXgsXG4gICAgICAgICAgbGFiZWw6IGBCbG9jY28gJHtjaHVua0luZGV4ICsgMX0gKFJpZ2hlIH4ke2NodW5rSW5kZXggKiAxNTAwfSBpbiBwb2kpYCxcbiAgICAgICAgICBzaXplQnl0ZXM6IGN1cnJlbnRMZW5CeXRlcyxcbiAgICAgICAgICBjb250ZW50OiBjdXJyZW50VGV4dCxcbiAgICAgICAgICBpc1ZhbGlkSlNPTjogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRUZXh0ID0gbGluZTtcbiAgICAgICAgY3VycmVudExlbkJ5dGVzID0gbGluZUJ5dGVzO1xuICAgICAgICBjaHVua0luZGV4Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50VGV4dCArPSBsaW5lO1xuICAgICAgICBjdXJyZW50TGVuQnl0ZXMgKz0gbGluZUJ5dGVzO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVsdGltbyBibG9jY28gcmltYXN0b1xuICAgIGlmIChjdXJyZW50VGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICBjaHVua3MucHVzaCh7XG4gICAgICAgIGluZGV4OiBjaHVua0luZGV4LFxuICAgICAgICBsYWJlbDogYEJsb2NjbyAke2NodW5rSW5kZXggKyAxfSAoRmlubyBhIHJpZ2EgJHtsaW5lcy5sZW5ndGh9KWAsXG4gICAgICAgIHNpemVCeXRlczogY3VycmVudExlbkJ5dGVzLFxuICAgICAgICBjb250ZW50OiBjdXJyZW50VGV4dCxcbiAgICAgICAgaXNWYWxpZEpTT046IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLy8gU2UgcGVyIHF1YWxjaGUgbW90aXZvIHN0cmFubyBub24gaGEgcHJvZG90dG8gY2h1bmsgKGVzLiB1bmEgc29sYSByaWdhIGNvbG9zc2FsZSBjaGUgYWdnaXJhIGlsIGNoZWNrIHNvcHJhKVxuICBpZiAoY2h1bmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIERpdmlkaWFtbyBmb3J6YXRhbWVudGUgYSBwYWNjaGV0dGkgZGkgY2FyYXR0ZXJpIHB1cmlcbiAgICBsZXQgY2hhckluZGV4ID0gMDtcbiAgICBsZXQgY2h1bmtJbmRleCA9IDA7XG4gICAgY29uc3Qgc2l6ZUNoYXJzID0gTWF0aC5mbG9vcih0YXJnZXRDaHVua1NpemVCeXRlcyAvIDIpIHx8IDEwMDAwMDsgLy8gQXNzdW1pIDIgYnl0ZSBwZXIgY2hhciBjb21lIHNpY3VyZXp6YVxuXG4gICAgd2hpbGUgKGNoYXJJbmRleCA8IHRyaW1tZWQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjaHVua1RleHQgPSB0cmltbWVkLnN1YnN0cmluZyhjaGFySW5kZXgsIGNoYXJJbmRleCArIHNpemVDaGFycyk7XG4gICAgICBjb25zdCBzaXplQnl0ZXMgPSBuZXcgQmxvYihbY2h1bmtUZXh0XSkuc2l6ZTtcbiAgICAgIGNodW5rcy5wdXNoKHtcbiAgICAgICAgaW5kZXg6IGNodW5rSW5kZXgsXG4gICAgICAgIGxhYmVsOiBgQmxvY2NvICR7Y2h1bmtJbmRleCArIDF9IChDYXJhdHRlcmkgJHtjaGFySW5kZXh9IC0gJHtjaGFySW5kZXggKyBjaHVua1RleHQubGVuZ3RofSlgLFxuICAgICAgICBzaXplQnl0ZXM6IHNpemVCeXRlcyxcbiAgICAgICAgY29udGVudDogY2h1bmtUZXh0LFxuICAgICAgICBpc1ZhbGlkSlNPTjogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIGNoYXJJbmRleCArPSBzaXplQ2hhcnM7XG4gICAgICBjaHVua0luZGV4Kys7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjaHVua3MsXG4gICAgbW9kZVVzZWQsXG4gICAgZXJyb3I6IHBhcnNlRXJyb3IgPyBgTm90YTogUGFyc2luZyBmYWxsaXRvLCBkaXZpc28gY29tZSB0ZXN0byBncmV6em8uICgke3BhcnNlRXJyb3J9KWAgOiB1bmRlZmluZWQsXG4gIH07XG59XG4iXSwibWFwcGluZ3MiOiJBQUtPLGdCQUFTLFlBQVksT0FBdUI7QUFDakQsTUFBSSxVQUFVLEVBQUcsUUFBTztBQUN4QixRQUFNLElBQUk7QUFDVixRQUFNLFFBQVEsQ0FBQyxLQUFLLE1BQU0sTUFBTSxJQUFJO0FBQ3BDLFFBQU0sSUFBSSxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ2xELFNBQU8sWUFBWSxRQUFRLEtBQUssSUFBSSxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hFO0FBTU8sZ0JBQVMsaUJBQ2QsU0FDQSx1QkFBK0IsTUFDL0IsV0FDOEQ7QUFDOUQsUUFBTSxVQUFVLFFBQVEsS0FBSztBQUM3QixNQUFJLENBQUMsU0FBUztBQUNaLFdBQU8sRUFBRSxRQUFRLENBQUMsR0FBRyxVQUFVLFlBQVksT0FBTyw2QkFBNkI7QUFBQSxFQUNqRjtBQUdBLE1BQUksUUFBUSxVQUFVLHNCQUFzQjtBQUMxQyxRQUFJLFVBQVU7QUFDZCxRQUFJO0FBQ0YsV0FBSyxNQUFNLE9BQU87QUFDbEIsZ0JBQVU7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUVSO0FBRUEsV0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ047QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLFdBQVcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEVB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