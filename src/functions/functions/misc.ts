export async function usercount(client: any) {
  let totaluser = 0;
  let uniqueUsers = new Set();

  const fetchPromises = Array.from(client.guilds.cache.values(), guild =>
    guild.members.fetch().then(members =>
      members.filter(member => !member.user.bot).map(member => member.id)
    )
  );

  const memberIdsArrays = await Promise.all(fetchPromises);

  memberIdsArrays.flat().forEach(id => uniqueUsers.add(id));

  totaluser = uniqueUsers.size;

  return totaluser;
}
