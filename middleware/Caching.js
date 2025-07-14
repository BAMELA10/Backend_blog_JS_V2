const cache = require('node-cache');

const memcache = new cache();
const Caching = (req, res, next) => {
    
    const key = "__cache__" + `${req.originalUrl}`;

    //get data in memcached if exist
    const CachedData = memcache.get(key);

    if(CachedData)
    {
        return res.json(JSON.parse(CachedData)).status(200);
    }
    
    // if data is not Exist add data in Cache
    const responseJson = res.json.bind(res);
    res.json = (body) => {
        memcache.set(key, JSON.stringify(body) , 600);
        return responseJson(body)
    }

    
    next()


};

module.exports = Caching