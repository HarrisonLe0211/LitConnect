const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.options(/.*/, cors({ origin: true, credentials: true })); // ✅ FIX
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;