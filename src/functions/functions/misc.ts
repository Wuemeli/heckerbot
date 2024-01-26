import { getData, setData } from '../redis/index';

export async function usercount(client: any) {
  const userCount = await getData('userCount' );
  if (userCount) return userCount;

  let totaluser = 0;
  let uniqueUsers = new Set();

  const guilds = Array.from(client.guilds.cache.values());
  const totalGuilds = guilds.length;

  console.log(`Starting user count for ${totalGuilds} guilds.`);

  for (let i = 0; i < totalGuilds; i++) {
    const guild = guilds[i];
    const members = await guild.members.fetch();
    const humanMembers = members.filter(member => !member.user.bot);

    console.log(`Processed ${i + 1}/${totalGuilds} guilds. Estimated time remaining: ${Math.round((totalGuilds - i - 1) / 60)} minutes.`);

    humanMembers.forEach(member => uniqueUsers.add(member.id));
  }

  totaluser = uniqueUsers.size;

  console.log(`Finished user count. Total users: ${totaluser}`);

  await setData('userCount', JSON.stringify(totaluser));
  return totaluser;
}