
export const appConfig = () => ({

    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10),
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
  
    NFL_URL: process.env.NFL_URL,
  });