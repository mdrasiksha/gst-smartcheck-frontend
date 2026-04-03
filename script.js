(() => {
  const uploadEndpoint = "https://gst-smartcheck-docker.onrender.com/upload";

  const form = document.getElementById("uploadForm");
  const fileInput = document.getElementById("invoiceFile");
  const dropZone = document.getElementById("dropZone");
  const pickFileButton = document.getElementById("pickFileButton");
  const dropPrompt = document.getElementById("dropPrompt");
  const fileSuccess = document.getElementById("fileSuccess");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const convertButton = document.getElementById("convertButton");
  const convertLabel = document.getElementById("convertLabel");
  const submitSpinner = document.getElementById("submitSpinner");
  const statusMessage = document.getElementById("statusMessage");

  const formatBytes = (bytes) => {
    if (!bytes) return "0 KB";
    const units = ["Bytes", "KB", "MB", "GB"];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const showFile = (file) => {
    if (!file) return;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    dropPrompt.classList.add("hidden");
    fileSuccess.classList.remove("hidden");
    statusMessage.textContent = "Ready to convert.";
    statusMessage.className = "mt-4 text-center text-sm text-emerald-300";
    convertButton.disabled = false;
  };

  const setLoading = (loading) => {
    convertButton.disabled = loading;
    submitSpinner.classList.toggle("hidden", !loading);
    convertLabel.textContent = loading ? "Processing..." : "Convert";
  };

  pickFileButton.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    showFile(file);
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("border-blue-400", "bg-blue-500/10");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("border-blue-400", "bg-blue-500/10");
    });
  });

  dropZone.addEventListener("drop", (event) => {
    const droppedFiles = event.dataTransfer?.files;
    if (!droppedFiles?.length) return;

    const [file] = droppedFiles;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      statusMessage.textContent = "Please upload a PDF file.";
      statusMessage.className = "mt-4 text-center text-sm text-rose-300";
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    showFile(file);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileInput.files?.[0];
    if (!file) {
      statusMessage.textContent = "Please select a PDF first.";
      statusMessage.className = "mt-4 text-center text-sm text-rose-300";
      return;
    }

    setLoading(true);
    statusMessage.textContent = "Uploading your file securely...";
    statusMessage.className = "mt-4 text-center text-sm text-slate-300";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("output_format", form.querySelector('input[name="outputFormat"]:checked')?.value || "xlsx");

    try {
      const response = await fetch(uploadEndpoint, { method: "POST", body: formData });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Upload failed. Please try again.");
      }

      statusMessage.textContent = "Conversion complete. Download should start automatically.";
      statusMessage.className = "mt-4 text-center text-sm text-emerald-300";

      if (payload.file_url) {
        window.location.assign(payload.file_url);
      }
    } catch (error) {
      statusMessage.textContent = `❌ ${error.message || "Unable to process file right now."}`;
      statusMessage.className = "mt-4 text-center text-sm text-rose-300";
    } finally {
      setLoading(false);
    }
  });
})();
