
// const express = require('express');
// require('dotenv').config();
// const mongoose = require('mongoose');
// const cors = require('cors');
// const passport = require('passport');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();

// const studentRoutes = require('./src/routes/student.routes');
// const departmentRoutes = require('./src/routes/department.routes');
// const semesterRoutes = require('./src/routes/semester.routes');
// const courseRoutes = require('./src/routes/course.routes');

// // require('./db');

// // Increase the JSON payload limit
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// app.use(express.static('public'));
// app.use(cookieParser());
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001']
// }));
// app.use(passport.initialize());
// const dbURI = 'mongodb://127.0.0.1:27017/zibeh';
// // const dbURI = "mongodb+srv://superMe:superMe123@alistiqama.iupxq.mongodb.net/test?retryWrites=true&w=majority&appName=alIstiqama";

// // const dbURI = process.env.MONGODB_URI;
// const PORT = process.env.PORT || 3000;
// mongoose.connect(dbURI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log('App running on port 3000');
//     });
//   })
//   .catch((err) => console.log('Connection error:', err));

// // GridFS Setup
// let gfs;
// mongoose.connection.once('open', () => {
//   gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: 'uploads'
//   });
// });

// app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//   res.json({ message: "Welcome to the API" });
// });

// app.use(studentRoutes);
// app.use(departmentRoutes);
// app.use(semesterRoutes);
// // app.use(courseRoutes);


// module.exports = app;



const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// import your route modules
const studentRoutes    = require('./src/routes/student.routes');
const admintRoutes = require('./src/routes/admin.routes');
const parentRoutes   = require('./src/routes/parent.routes');
const teacherRoutes   = require('./src/routes/teachers.route');
const complainRoute   = require('./src/routes/complaint.routes');

// connect to database
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/atbu';
const MONGODB_URI = 'mongodb+srv://abdulbasidhussain:nazeef123@cluster0.yflxqwa.mongodb.net/atbu?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();

// middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(cookieParser());
app.use(passport.initialize());

// serve static assets (if any)
app.use(express.static('public'));

// view engine (if needed)
app.set('view engine', 'ejs');

// GridFS setup (optional)
let gfs;
mongoose.connection.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// mount route handlers with base paths
app.use('/students',    studentRoutes);
app.use('/parents', parentRoutes);
app.use('/teachers',   teacherRoutes);
app.use('/complain',   complainRoute);
// app.use('/departments', departmentRoutes);
app.use('/admin',   admintRoutes);
// app.use('/courses',     courseRoutes);

// example for additional routes
// app.use('/users', usersRoutes);
// app.use('/auth',  authRoutes);
// ...

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
