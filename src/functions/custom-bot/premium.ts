import axios from 'axios';
import custombotSchema from '../../schemas/custombotSchema';

axios.defaults.headers.common["Accept-Encoding"] = "gzip";

export async function checkExpiredPremium() {
  const response = await axios.get(`https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/entitlements`, {
    headers: {
      Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
    },
  });

  const now = new Date();

  for (const entitlement of response.data) {
    const { user_id, deleted, ends_at } = entitlement;

    if (!deleted) {
      const endDate = new Date(ends_at);

      if (now >= endDate) {
        await custombotSchema.deleteOne({ userId: user_id });
      }
    }
  }
}


export async function hasPremium(userID: string) {
  const response = await axios.get(`https://discord.com/api/v10/applications/${process.env.CLIENT_ID}/entitlements`, {
    headers: {
      Authorization: `Bot ${process.env.CLIENT_TOKEN}`,
    },
  });

  const now = new Date();

  for (const entitlement of response.data) {
    const { user_id, deleted, starts_at, ends_at } = entitlement;

    if (user_id === userID && !deleted) {
      const startDate = new Date(starts_at);
      const endDate = new Date(ends_at);

      if (now >= startDate && now <= endDate) {
        return true;
      }
    }
  }

  return false;
}