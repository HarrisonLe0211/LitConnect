exports.notFound = (_req, res) => res.status(404).json({ message: 'Route not found' });

exports.errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err?.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id format' });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error', details: err.keyValue });
  }

  return res.status(500).json({ message: 'Server error' });
};