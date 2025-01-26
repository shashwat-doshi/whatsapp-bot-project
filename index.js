import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import FormData from "form-data";
import config from "./config.js";

/**
 * Send request to Whapi.Cloud
 * @param endpoint - endpoint path
 * @param params - request body
 * @param method - GET, POST, PATCH, DELETE
 * @returns {Promise<object>}
 */
async function sendWhapiRequest(endpoint, params = {}, method = "POST") {
  // send request to endpoint with params, with POST by default
  let options = {
    method: method,
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
  };
  let url = `${config.apiUrl}/${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    if (method === "GET") url += "?" + new URLSearchParams(params);
    // if GET method set in params, then params move to query
    else
      options.body = params?.media
        ? toFormData(params)
        : JSON.stringify(params); // if in params media - transform to formData, else - json
  }
  const response = await fetch(url, options); // send request
  let json = await response.json();
  console.log("Whapi response:", JSON.stringify(json, null, 2));
  return json;
}

/**
 * Convert object to FormData
 * @param obj
 * @returns {FormData}
 */
function toFormData(obj) {
  const form = new FormData();
  for (let key in obj) {
    form.append(key, obj[key]);
  }
  return form;
}

async function setHook() {
  // request for set hook and receive messages
  if (config.botUrl) {
    /** type {import('./whapi').Settings} */
    const settings = {
      webhooks: [
        {
          url: config.botUrl,
          events: [
            // default event for getting messages
            { type: "messages", method: "post" },
          ],
          mode: "method",
        },
      ],
    };
    await sendWhapiRequest("settings", settings, "PATCH");
  }
}

async function handleNewMessages(req, res) {
  // handle messages
  try {
    /** type {import('./whapi').Message[]} */
    const messages = req?.body?.messages;
    for (let message of messages) {
      console.log("here", message.chat_id);
      if (message.from_me) continue;
      /** type {import('./whapi').Sender} */
      const sender = {
        to: message.chat_id,
      };
      let endpoint = "messages/text";
      // const recievedText = message.text.body.toLowerCase();

      switch (message.chat_id) {
        case "971503507141-1418050753@g.us":
          sender.body = "Jai shree Krishna mummy and daddy 😘😘😘😘";
          break;
        case "9715084039500@s.whatsapp.net":
          sender.body = "Jai shree Krishna uncle";
          break;
        case "14379892320@s.whatsapp.net": {
          sender.body = "Oh chubby, zara nach ke dikha 💃";
          break;
        }
      }

      await sendWhapiRequest(endpoint, sender); // send request
    }
    res.send("Ok");
  } catch (e) {
    res.send(e.message);
  }
}

// Create a new instance of express
const app = express();
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("Bot is running");
});

app.post("/hook/messages", handleNewMessages); // route for get messages

setHook().then(() => {
  const port = config.port;
  app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
  });
});
