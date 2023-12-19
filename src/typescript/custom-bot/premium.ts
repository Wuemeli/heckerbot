import { Client } from 'discord.js';
import premiumSchema from '../../schemas/premiumSchema';

export function setupEntitlementEvents(client: Client) {
  if (!process.env.PREMIUM) return;

  client.on('ENTITLEMENT_CREATE', async (entitlement) => {
    const { user_id, starts_at, ends_at } = entitlement;
    await premiumSchema.findOneAndUpdate(
      { userID: user_id },
      { premium: true, premiumSince: starts_at, premiumExpires: ends_at },
      { upsert: true }
    );
  });

  client.on('ENTITLEMENT_UPDATE', async (entitlement) => {
    const { user_id, ends_at } = entitlement;
    await premiumSchema.findOneAndUpdate(
      { userID: user_id },
      { premiumExpires: ends_at },
      { upsert: true }
    );
  });

  client.on('ENTITLEMENT_DELETE', async (entitlement) => {
    const { user_id } = entitlement;
    await premiumSchema.findOneAndUpdate(
      { userID: user_id },
      { premium: false },
      { upsert: true }
    );
  });
}

export async function hasPremium(userID: string) {
  const userPremium = await premiumSchema.findOne({ userID });
  return userPremium?.premium || false;
}