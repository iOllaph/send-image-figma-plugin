const WEBHOOK_URL = "";

const AUTH_USER = "";
const AUTH_PASS = "";

figma.showUI(__html__, { width: 300, height: 250 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "login") {
    // No authentication anymore
    figma.clientStorage.setAsync("session", "ok");
    figma.notify("Logged in!");
  }

  if (msg.type === "send") {
    await sendImage();
  }
};

async function sendImage() {
  console.log("➡️ sendImage() called");

  const selection = figma.currentPage.selection;
  console.log("📌 Selection:", selection);

  if (selection.length !== 1) {
    console.log("❌ Invalid selection length:", selection.length);
    figma.notify("Select exactly one frame");
    return;
  }

  const node = selection[0];
  console.log("🖼️ Selected node:", node.name, node.type);

  const pngBytes = await node.exportAsync({ format: "PNG" });
  console.log("📦 PNG bytes length:", pngBytes.byteLength);

  console.log("🌐 Sending POST request to:", WEBHOOK_URL);

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    body: new Uint8Array(pngBytes)
  });

  console.log("📥 Server response status:", res.status);

  if (!res.ok) {
    console.log("❌ Response not OK:", res);
    figma.notify("Failed to send image");
    return;
  }

  figma.notify("Image sent!");
  console.log("✅ Image sent successfully");
}

