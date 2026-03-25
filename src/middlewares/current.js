import passport from "passport";

// Middleware listo para usar en rutas:
// router.get("/path", current, (req,res)=>{ ... })
export const current = passport.authenticate("current", { session: false });

