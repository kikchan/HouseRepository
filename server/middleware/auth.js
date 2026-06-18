export function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }

  res.status(401).json({ error: 'Authentication required' });
}

export function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }

  res.status(403).json({ error: 'Admin access required' });
}
