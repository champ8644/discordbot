import axios from 'axios';

const webhookURL =
  "https://discord.com/api/webhooks/762171138855403520/ZtyZxHfoU9THsZWFpClTM7fbCEpo2FV-AbNQQPTw0GQ4tps7zCoAdiBOgSYfJuYnzJrv";

export function sendToClean(msg: string) {
  return axios.post(webhookURL, { content: msg });
}
