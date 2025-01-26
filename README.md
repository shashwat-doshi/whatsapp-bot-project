# whatsapp-bot-project

### Sample config.js

```js
const config = {
  // API endpoint URL
  apiUrl: "https://gate.whapi.cloud",
  // API token from your channel
  token: "YOUR_API_TOKEN",
  // The ID of the group to which we will send the message. Use to find out the ID: https://whapi.readme.io/reference/getgroups
  group: "YOUR_GROUP_ID",
  // The ID of the product we will send for the example. Create a product in your WhatsApp and find out the product ID: https://whapi.readme.io/reference/getproducts
  product: "YOUR_PRODUCT_ID",
  // Bot`s URL (for static file). Webhook Link to your server. At ( {server link}/hook ), when POST is requested, processing occurs
  botUrl: "NGROK_URL",
  // Bot's Port (for hook handler). Don't use 443 port.
  port: "8080",
};

export default config;
```
