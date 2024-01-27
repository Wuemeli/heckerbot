import { getData, setData } from '../redis/index';

export async function usercount(client: any) {
  const userCount = await getData(`userCount:${client.user.id}`);
  if (userCount) return userCount;

  let totaluser = 0;
  let uniqueUsers = new Set();

  const guilds = Array.from(client.guilds.cache.values());
  const totalGuilds = guilds.length;

  for (let i = 0; i < totalGuilds; i++) {
    const guild = guilds[i];
    const members = await guild.members.fetch();
    const humanMembers = members.filter(member => !member.user.bot);

    humanMembers.forEach(member => uniqueUsers.add(member.id));
  }

  totaluser = uniqueUsers.size;

  await setData(`userCount:${client.user.id}`, JSON.stringify(totaluser));
  return totaluser;
}