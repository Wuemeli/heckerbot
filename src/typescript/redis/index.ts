import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

export async function getData(key: string) {
  const data = await client.get(key)
  return data
}

export async function setData(key: string, value: any) {
  await client.set(key, value, { ex: Number(process.env.REDIS_EXPIRE) });
}