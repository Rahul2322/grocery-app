import { createClient, RedisClientType } from 'redis';
import { getConfigKey } from './locals';

const client: RedisClientType = createClient({
  socket: {
    host: getConfigKey("redisHost"),   
    port: Number(getConfigKey("redisPort")),          
  }
});


client.connect();

client.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

export default client

