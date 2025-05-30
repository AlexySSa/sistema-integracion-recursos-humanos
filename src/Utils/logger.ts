/**
 * Logger para registro de eventos de la aplicación
 */
export class Logger {
    /**
     * Registra un mensaje informativo
     * @param message Mensaje a registrar
     */
    log(message: string): void {
        console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
    }

    /**
     * Registra un mensaje de error
     * @param message Mensaje de error
     */
    error(message: string): void {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    }

    /**
     * Registra una advertencia
     * @param message Mensaje de advertencia
     */
    warn(message: string): void {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }

    /**
     * Registra información de depuración
     * @param message Mensaje de depuración
     */
    debug(message: string): void {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    }
}