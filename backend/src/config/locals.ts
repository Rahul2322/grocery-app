import dotenv from "dotenv";
 dotenv.config();
    interface Config {
    nodeEnv: string | undefined;
    port: string | undefined;
    dbName: string | undefined;
    dbPort: string | undefined;
    dbUserName: string | undefined;
    dbPassword: string | undefined;
    dbHost: string | undefined;
    jwtSecretKey: string | undefined;
    jwtExpiryTime: string | undefined;
    redisHost: string | undefined;
    redisPort: string | undefined;
    [key: string]: string | undefined;
}
const config: Config = {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    dbName: process.env.DB_NAME,
    dbPort: process.env.DB_PORT,
    dbUserName: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiryTime: process.env.JWT_EXPIRY_TIME,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,

};
    export const getConfigKey = (key: string): string => {

    let value = config[key];
    console.log(value, "key");
    if (!value) {
        console.log(
        "Locals Error",
        `The key ${key} provided is invalid. Please pass the valid key`
        );
    }
    return value as string;
    };
