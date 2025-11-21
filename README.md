# **Frame Relay — Export Selected Figma Frames via Webhook**

Frame Relay is a lightweight Figma plugin that lets you **export any selected frame as a PNG** and automatically **send it to your server via a webhook**.
Ideal for automation pipelines, image processing systems, CDNs, prototyping flows, and custom integrations.

---

## **✨ Features**

* Export the selected frame as **high-quality PNG**
* Automatically POST the image to a **custom webhook**
* Store the webhook URL securely inside the plugin
* One-click workflow: *select frame → send → done*
* Simple UI with automatic mode switching
* Supports any REST endpoint

---

## **🚀 How It Works**

1. Open the plugin.
2. Enter your webhook URL and save it.
3. Select any Figma frame.
4. Click **Enviar imagem** to send the PNG to your server.
5. The server receives a POST request with:

   * `image`: Base64 PNG
   * `frameName`: name of the selected frame
   * `timestamp`: ISO date

---

## **📦 Payload Example**

**POST** sent to your webhook:

```json
{
  "frameName": "Home",
  "timestamp": "2025-11-21T18:04:22.019Z",
  "image": "data:image/png;base64,iVBORw0KGgo..."
}
```

---

## **🛠 Installation (Dev)**

Clone the project:

```sh
git clone https://github.com/your-repo/frame-relay
```

In Figma:

1. Open **Figma → Plugins → Development → Import plugin from manifest**
2. Select the project folder containing `manifest.json`
3. Run the plugin from **Plugins → Development → Frame Relay**

---

## **📂 Plugin Structure**

```
/ui
  index.html   → Webview UI
code.js        → Plugin core logic
manifest.json  → Figma plugin config
icon.png       → Plugin icon (512x512)
```

---

## **🔧 Configuration**

The plugin stores the webhook URL inside Figma’s private plugin storage:

```ts
figma.clientStorage.setAsync("webhookUrl", url)
```

You can always change it by clicking **Alterar URL** in the plugin UI.

---

## **🔐 Security Notes**

* The plugin does **not** log or transmit your webhook URL anywhere except to your selected endpoint.
* All data stays inside your machine and your server.

---

## **⚙️ Requirements**

* Figma Desktop (browser mode does not support exporting PNG via plugin API).
* A reachable HTTPS webhook endpoint.

---

## **🤝 Contributing**

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to improve.

---

## **📄 License**

MIT License — free for commercial and personal use.

---