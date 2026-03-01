import 'dotenv/config'

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  POSTGRES_USER: getEnv('POSTGRES_USER'),
  POSTGRES_DB: getEnv('POSTGRES_DB'),
  POSTGRES_PASSWORD: getEnv('POSTGRES_PASSWORD'),
  POSTGRES_HOST: getEnv('POSTGRES_HOST', 'localhost'),
  POSTGRES_PORT: Number.parseInt(getEnv('POSTGRES_PORT', '5432'), 10),
} as const
