
# **Figma Image Sender Plugin**

This Figma plugin allows you to select a frame, export it as PNG, and send the binary image directly to your self-hosted API via an HTTP POST request.
Local authentication (username/password stored in the plugin) is supported to restrict usage.

---

## **Features**

* Local login (static username/password inside plugin code).
* Figma UI for login and sending.
* Exports the selected frame as PNG bytes.
* Sends the PNG via HTTP POST to your relay server.
* Compatible with Docker-hosted relay services.

---

## **How It Works**

### **1. Login UI**

The plugin renders a simple HTML UI containing:

* Username input
* Password input
* Login button
* “Send Selected Frame” button

The UI communicates with the plugin controller via `parent.postMessage`.

### **2. Local Authentication**

Authentication does **not** contact any external API.
Static credentials are defined in the plugin’s main code:

```js
const AUTH_USER = "myUser123";
const AUTH_PASS = "superSecret456";
```

If the credentials match, the plugin stores a fake token in Figma client storage:

```js
await figma.clientStorage.setAsync("sessionToken", "local-static-token");
```

### **3. Sending the Frame**

When "Send Selected Frame" is clicked:

1. The plugin checks if exactly one frame is selected
2. That frame is exported as PNG
3. The image is sent with:

```js
fetch("http://YOUR_SERVER:8001/send-image", {
  method: "POST",
  body: new Uint8Array(pngBytes)
});
```

No authorization header is used.

### **4. Manifest Network Access**

To allow the HTTP call, the manifest needs:

```json
"networkAccess": {
  "allowedDomains": ["*"]
}
```

Or a stricter version if preferred.

---

## **Installation**

1. Clone or download the plugin folder.
2. In Figma → **Plugins → Development → Import plugin from manifest**.
3. Select `manifest.json`.

---

## **Usage**

1. Select **one frame** in your Figma file.
2. Open the plugin.
3. Enter the static username & password.
4. Click **Login**.
5. Click **Send Selected Frame**.

You will see console logs in **Figma → Plugin Console** to help debugging.

---

## **Relay Endpoint Requirements**

Your relay must accept raw PNG bytes via:

* **Method:** POST
* **Content-Type:** `image/png` (optional, since plugin sends only the body)
* **Body:** PNG binary

Example expected endpoint:

```
POST http://your-relay-domain-or-ip:8001/send-image
```

---

## **Troubleshooting**

### **“Select exactly one frame”**

You selected multiple nodes or no frames.
Choose one frame only.

### **“Failed to send image”**

Possible reasons:

* Relay port not published
* Wrong relay URL
* Endpoint not accepting raw bytes
* Server inaccessible (firewall, local network, swarm node)

### **CSP or network errors**

Ensure the manifest has:

```json
"networkAccess": {
  "allowedDomains": ["*"]
}
```