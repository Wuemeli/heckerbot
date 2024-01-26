export async function usercount(client: any) {
  let totaluser = 0;
  let uniqueUsers = new Set();

  for (const guild of client.guilds.cache.values()) {
    const members = await guild.members.fetch();

    members.filter(member => !member.user.bot).forEach(member => uniqueUsers.add(member.id));
  }

  totaluser = uniqueUsers.size;

  return totaluser;
}