// Fuente única para configuración en tiempo de ejecución.
// Reexportamos desde `src/env.js` para mantener compatibilidad con `src/server.js`.
import { MONGO_URL, PORT } from "../env.js";

export { MONGO_URL, PORT };

