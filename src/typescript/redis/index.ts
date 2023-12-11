import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

export async function getData(key: string) {
  const data = await redis.get(key)
  return data
}

export async function setData(key: string, value: any) {
  await redis.set(key, value, { ex: Number(process.env.REDIS_EXPIRE) });
}