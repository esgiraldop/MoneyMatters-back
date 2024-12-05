export const EnvConfig = () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST_MONEYM,
      port: parseInt(process.env.DATABASE_PORT_MONEYM, 10) || 5432,
      username: process.env.DATABASE_USERNAME_MONEYM,
      password: process.env.DATABASE_PASSWORD_MONEYM,
      database: process.env.DATABASE_NAME_MONEYM,
    },
  };
};
