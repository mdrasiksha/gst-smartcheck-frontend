document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const status = document.getElementById("statusMessage");
    status.innerText = "Processing...";

    const email = document.getElementById("email").value;
    const file = document.getElementById("invoiceFile").files[0];

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    try {
        const response = await fetch("https://gst-smartcheck.onrender.com/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            status.innerText = `❌ ${errorData.error}`;
            return;
        }

        const payload = await response.json();
        const remaining = payload.remaining;
        const usageCount = payload.usage_count ?? 0;

        if (!payload.file_url) {
            status.innerText = "❌ Conversion completed but download link is missing.";
            return;
        }

        window.location.assign(payload.file_url);

        if (usageCount > 5) {
            status.innerText = "⚠️ You have reached your 5 free invoices.";
            return;
        }

        status.innerText = `✅ Success! Free uploads remaining: ${remaining}`;
    } catch (error) {
        status.innerText = "❌ Backend not running.";
    }
});
