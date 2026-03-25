export const requireRole = (allowedRoles = []) => {
  const rolesSet = new Set(allowedRoles);

  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !rolesSet.has(role)) {
      return res.status(403).json({
        status: "error",
        message: "Forbidden: insufficient role permissions",
      });
    }

    next();
  };
};

