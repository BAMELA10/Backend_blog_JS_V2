
const logger = (req, res, next) => {
    const start = Date.now();
    const End = res.end;
    res.end = (...args) => {
        const duration = Date.now() - start;

        if(res.statusCode == 200)
        {
            console.log(`[${new Date(start)}] INFO ${res.statusCode} ${req.method} ${req.originalUrl} ${duration.toString()}ms`);
        }
        else 
        {
            console.log(`[${start.toString()}] ERROR ${res.statusCode} ${req.method} ${req.originalUrl} ${duration.toString()}ms`);
        }
        
        return End.apply(res, args)
    }

    next();
};

module.exports = logger