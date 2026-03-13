const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowed =
      /^https:\/\/.*-3000\.app\.github\.dev$/.test(origin) ||
      /^https?:\/\/localhost:\d+$/.test(origin) ||
      /^https?:\/\/127\.0\.0\.1:\d+$/.test(origin);

    if (allowed) return callback(null, true);

    return callback(new Error(`CORS not allowed for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

app.use(helmet());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;