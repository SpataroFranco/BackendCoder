export const adminAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol !== "admin") {
    console.log("Acceso solo para admins");
    return res.status(401).json({ message: "Unauthorized"})
  } 
  next();
};

export const userAccess = (req, res, next) => {
  if (req.session.user && req.session.user.rol !== "user") {
    console.log("Acceso solo para Users");
    return res.status(401).json({ message: "Unauthorized"})
  }
  next()
};
