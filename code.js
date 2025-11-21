const WEBHOOK_URL = "";
const AUTH_PASS = "";

figma.showUI(__html__, { width: 300, height: 250 });

// Listen UI events
figma.ui.onmessage = async (msg) => {
  
  if (msg.type === "login") {
    if (msg.password !== AUTH_PASS) {
      figma.notify("Senha incorreta!");
      return;
    }

    await figma.clientStorage.setAsync("session", "ok");
    figma.ui.postMessage({ type: "logged-in" });
    figma.notify("Logado!");
  }

  if (msg.type === "send") {
    await sendImage();
  }
};

async function sendImage() {
  const selection = figma.currentPage.selection;

  if (selection.length !== 1) {
    figma.notify("Selecione um frame apenas!");
    return;
  }

  const node = selection[0];
  const pngBytes = await node.exportAsync({ format: "PNG" });

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    body: new Uint8Array(pngBytes)
  });

  if (!res.ok) {
    figma.notify("Falha ao enviar a mensage, por favor tente mais tarde!");
    return;
  }

  figma.notify("Frame enviado!");
}
