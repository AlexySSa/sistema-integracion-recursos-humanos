import { Logger } from './logger';

/**
 * Manejador centralizado de errores
 */
export class ErrorHandler {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    /**
     * Maneja un error, registrándolo y opcionalmente mostrándolo al usuario
     * @param error Error ocurrido
     * @param context Contexto donde ocurrió el error
     * @param showUser Si se debe mostrar al usuario
     */
    handleError(error: Error, context: string, showUser: boolean = true): void {
        const errorMessage = `[${context}] ${error.message}`;
        this.logger.error(errorMessage);
        
        if (showUser) {
            console.error(`Error: ${error.message}`);
        }
    }

    /**
     * Maneja advertencias (errores no críticos)
     * @param warning Mensaje de advertencia
     * @param context Contexto donde ocurrió
     */
    handleWarning(warning: string, context: string): void {
        const warningMessage = `[${context}] ${warning}`;
        this.logger.warn(warningMessage);
    }
}