import { Logger } from './logger';

export class ErrorHandler {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  handleError(error: unknown, context: string, showUser: boolean = true): void {
    const errorMessage = `[${context}] ${(error instanceof Error) ? error.message : 'Error desconocido'}`;
    
    if (this.logger && typeof this.logger.error === 'function') {
      this.logger.error(errorMessage);
    } else {
      console.error('[ERROR HANDLER] Logger no está definido');
    }

    if (showUser) {
      console.error(`Error: ${errorMessage}`);
    }
  }
}
