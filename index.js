require('dotenv').config({ path: ['.env.development', '.env.production'] });
require('express-async-errors');
const {limiter} = require('./utils');
const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
//

const connectDb = require('./db/ConnectDb');

const AuthRouter = require('./routes/Auth-routes');
const PostRouter = require('./routes/Post-routes');
const CommentRouter = require('./routes/Comment-routes');
const UserRouter = require('./routes/User-routes');


const ErrorHandlerMiddleware = require('./middleware/Error-handler');
const NotFound = require('./middleware/not-found');



app.use(express.json());
app.use(limiter);
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/BlogApi/v2/auth', AuthRouter);
app.use('/BlogApi/v2/post', PostRouter);
app.use('/BlogApi/v2/user', UserRouter);
app.use('/BlogApi/v2/comment', CommentRouter);

app.use(NotFound);
app.use(ErrorHandlerMiddleware);
//app.use(Caching)



const port =  process.env.PORT || 3000 ;

app.listen(port, async () => {
    console.log(`Server is running on port ${port} in mode ${process.env.NODE_ENV}`);
    await connectDb()
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to database');
    });
})