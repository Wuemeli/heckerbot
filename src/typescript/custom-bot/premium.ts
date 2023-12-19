import { Client } from 'discord.js';

export function setupEntitlementEvents(client: Client) {
  if (!process.env.PREMIUM) return;
  
  client.on('ENTITLEMENT_CREATE', (entitlement) => {
    console.log('A new entitlement was created:', entitlement);
  });

  client.on('ENTITLEMENT_UPDATE', (entitlement) => {
    console.log('An entitlement was updated:', entitlement);
  });

  client.on('ENTITLEMENT_DELETE', (entitlement) => {
    console.log('An entitlement was deleted:', entitlement);
  });
}