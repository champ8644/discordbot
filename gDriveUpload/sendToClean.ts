import axios from 'axios';

import webhook from './webhook_secret.json';

const webhookURL = webhook.webhookURL;

export function sendToClean(msg: string) {
  return axios.post(webhookURL, { content: msg });
}
