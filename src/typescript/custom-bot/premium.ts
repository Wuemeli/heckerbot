import axios from 'axios';
import premiumSchema from '../../schemas/premiumSchema';
import custombotSchema from '../../schemas/custombotSchema';

export async function handleEntitlements() {
  if (!process.env.PREMIUM) return;

  const response = await axios.get(`https://discord.com/api/v10/applications/1092475154791145542/entitlements`, {
    headers: {
      Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
    },
  });

  for (const entitlement of response.data) {
    const { user_id, starts_at, ends_at, deleted } = entitlement;

    if (deleted) {
      await premiumSchema.findOneAndDelete({ userID: user_id });
      continue;
    }

    await premiumSchema.findOneAndUpdate(
      { userID: user_id },
      { premium: true, premiumSince: starts_at, premiumExpires: ends_at },
      { upsert: true }
    );
  }

  const expiredEntitlements = await premiumSchema.find({ premiumExpires: { $lt: new Date() } });
  for (const expiredEntitlement of expiredEntitlements) {
    await premiumSchema.findOneAndDelete({ userID: expiredEntitlement.userID });
    const check = await custombotSchema.findOne({ userID: expiredEntitlement.userID });
    if (check) {
      await custombotSchema.findOneAndDelete({ userID: expiredEntitlement.userID });
    }
  }
}

export async function hasPremium(userID: string) {
  const userPremium = await premiumSchema.findOne({ userID });
  if (!userPremium || !userPremium.premium) return false;
  return true;
}