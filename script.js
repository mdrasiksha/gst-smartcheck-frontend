(() => {
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
  const FREE_UPLOAD_LIMIT = 10;
  const BASE_URL = "https://gst-smartcheck.onrender.com";

  const form = document.getElementById("uploadForm");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("invoiceFile");
  const filePreview = document.getElementById("filePreview");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const emailInput = document.getElementById("email");
  const outputFormatInputs = document.querySelectorAll('input[name="outputFormat"]');
  const submitButton = document.getElementById("submitButton");
  const submitButtonText = document.getElementById("submitButtonText");
  const submitSpinner = document.getElementById("submitSpinner");
  const statusMessage = document.getElementById("statusMessage");
  const remainingPill = document.getElementById("remainingPill");

  let usedFreeUploads = 0;

  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes)) return "Size unavailable";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const setStatus = (message, type = "info") => {
    statusMessage.textContent = message;
    statusMessage.className = "mt-4 text-sm";
    if (type === "success") statusMessage.classList.add("text-emerald-300");
    if (type === "error") statusMessage.classList.add("text-rose-300");
    if (type === "info") statusMessage.classList.add("text-slate-300");
  };

  const updateRemaining = (remaining) => {
    if (!Number.isFinite(remaining)) {
      remainingPill.textContent = `${Math.max(0, FREE_UPLOAD_LIMIT - usedFreeUploads)} free invoices remaining`;
      return;
    }

    usedFreeUploads = Math.max(0, FREE_UPLOAD_LIMIT - remaining);
    remainingPill.textContent = `${Math.max(0, remaining)} free invoices remaining`;
  };

  const setLoadingState = (isLoading) => {
    submitButton.disabled = isLoading;
    submitSpinner.classList.toggle("hidden", !isLoading);
    submitButtonText.textContent = isLoading ? "Converting..." : "Convert Invoice";
  };

  const getSelectedFile = () => fileInput.files?.[0];

  const renderFilePreview = () => {
    const file = getSelectedFile();

    if (!file) {
      filePreview.classList.add("hidden");
      return;
    }

    filePreview.classList.remove("hidden");
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
  };

  const validate = () => {
    const email = emailInput.value.trim();
    const file = getSelectedFile();

    if (!email) throw new Error("Please enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");
    if (!file) throw new Error("Please select a PDF invoice.");
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are supported.");
    }
    if (file.size > MAX_FILE_SIZE_BYTES) throw new Error("File is too large. Maximum size is 10MB.");
  };

  const extractFilename = (response) => {
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
    if (!match) return null;
    return decodeURIComponent(match[1].replace(/"/g, "").trim());
  };

  const downloadBlob = (blob, filename) => {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  };

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("border-blue-400", "bg-slate-900/70");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("border-blue-400", "bg-slate-900/70");
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("border-blue-400", "bg-slate-900/70");

    const droppedFile = event.dataTransfer?.files?.[0];
    if (!droppedFile) return;

    const transfer = new DataTransfer();
    transfer.items.add(droppedFile);
    fileInput.files = transfer.files;
    renderFilePreview();
  });

  fileInput.addEventListener("change", renderFilePreview);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      validate();
      setLoadingState(true);
      setStatus("Processing invoice...", "info");

      const file = getSelectedFile();
      const email = emailInput.value.trim();
      const outputFormat = Array.from(outputFormatInputs).find((input) => input.checked)?.value || "xlsx";

      const formData = new FormData();
      formData.append("email", email);
      formData.append("file", file);
      formData.append("output_format", outputFormat);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Conversion failed. Please try again.");
      }

      const remainingHeader = Number(response.headers.get("X-Remaining"));
      if (Number.isFinite(remainingHeader)) updateRemaining(remainingHeader);

      const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
      if (contentType.includes("application/json")) {
        const payload = await response.json();
        if (Number.isFinite(payload.remaining)) updateRemaining(payload.remaining);
        if (!payload.file_url) throw new Error("Conversion finished but no download URL was returned.");
        window.location.assign(payload.file_url);
      } else {
        const blob = await response.blob();
        const extension = outputFormat === "xml" ? "xml" : "xlsx";
        const filename = extractFilename(response) || `converted_invoice.${extension}`;
        downloadBlob(blob, filename);
      }

      setStatus("✅ Invoice processed successfully", "success");
    } catch (error) {
      setStatus(`❌ ${error.message || "Something went wrong."}`, "error");
    } finally {
      setLoadingState(false);
    }
  });

  updateRemaining(FREE_UPLOAD_LIMIT);
})();
