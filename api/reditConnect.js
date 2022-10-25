const redis = require('redis');
const { promisify } = require("util");

//connect to redis


//const redis_client = redis.createClient();

let redis_client = redis.createClient({
    url: 'redis://redis:6379',
})


redis_client.connect()

 redis_client.on('connect', function(){
    console.log('redis client connected')
});


redis_client.on('ready', ()=>{
    console.log("client is connected to redis and ready to use..")
});

redis_client.on('error', (err)=>{
    console.log(err)
});

redis_client.on('end', ()=>{
    console.log('client diconnected from redis')
});

process.on('SIGINT', ()=>{
    redis_client.quit()
})


module.exports = redis_client