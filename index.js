require('dotenv').config({ path: ['.env.development', '.env.production'] });
require('express-async-errors');
const {limiter} = require('./utils');
const express = require('express');
const fs = require('fs');
const https = require('https')


const app = express();
const cookieParser = require('cookie-parser');
const SecurityHttpOption = {
    key: fs.readFileSync(__dirname + "/ssl/meadowlark.pem"),
    cert: fs.readFileSync(__dirname + "/ssl/meadowlark.crt")
}

const connectDb = require('./db/ConnectDb');

const AuthRouter = require('./routes/Auth-routes');
const PostRouter = require('./routes/Post-routes');
const CommentRouter = require('./routes/Comment-routes');
const UserRouter = require('./routes/User-routes');


const ErrorHandlerMiddleware = require('./middleware/Error-handler');
const NotFound = require('./middleware/not-found');
const logger = require('./utils/looging');


app.use(logger);
app.use(express.json());
app.use(limiter);
app.use(cookieParser(process.env.COOKIE_SECRET));



app.use('/BlogApi/v2/auth', AuthRouter);
app.use('/BlogApi/v2/post', PostRouter);
app.use('/BlogApi/v2/user', UserRouter);
app.use('/BlogApi/v2/comment', CommentRouter);

app.use(NotFound);
app.use(ErrorHandlerMiddleware);

const port =  process.env.PORT || 3000 ;

https.createServer(SecurityHttpOption, app).listen(port, async () => {
    console.log(`Server is running on port ${port} in mode ${process.env.NODE_ENV}`);
    await connectDb()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to database');
    });
})