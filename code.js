let webhookUrl = "";

figma.showUI(__html__, { width: 300, height: 260 });

// Load saved URL on startup
(async () => {
  const saved = await figma.clientStorage.getAsync("webhookUrl");
  if (saved) {
    webhookUrl = saved;
    figma.ui.postMessage({ type: "logged-in", webhookUrl });
  }
})();

// Handle UI events
figma.ui.onmessage = async (msg) => {

  if (msg.type === "set-url") {
    webhookUrl = msg.url;
    await figma.clientStorage.setAsync("webhookUrl", webhookUrl);
    figma.ui.postMessage({ type: "logged-in", webhookUrl });
    figma.notify("URL configurada!");
  }

  if (msg.type === "send") {
    await sendImage();
  }
};

async function sendImage() {
  const selection = figma.currentPage.selection;

  if (selection.length !== 1) {
    figma.notify("Selecione apenas um frame!");
    figma.ui.postMessage({ type: "send-failed" });
    return;
  }

  const node = selection[0];
  const pngBytes = await node.exportAsync({ format: "PNG" });

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      body: new Uint8Array(pngBytes)
    });

    if (!res.ok) {
      figma.notify("Erro ao enviar imagem!");
      figma.ui.postMessage({ type: "send-failed" });
      return;
    }

    figma.notify("Imagem enviada!");
    figma.ui.postMessage({ type: "send-success" });

  } catch (err) {
    figma.notify("Erro de rede!");
    figma.ui.postMessage({ type: "send-failed" });
  }
}
