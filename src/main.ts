import { SAPAdapter } from "./adapters/SAPAdapter";
import { OracleAdapter } from "./adapters/OracleAdapter";
import { WorkdayAdapter } from "./adapters/WorkdayAdapter";
import { BambooHRAdapter } from "./adapters/BambooHRAdapter";
import { LegacyAdapter } from "./adapters/LegacyAdapter";

import { HRMediator } from "./mediators/HRMediator";
import { Logger } from "./utils/logger";
import { ErrorHandler } from "./utils/errorHandler";
import { CLI } from "./Ui/Cli"; // Asegurate que la ruta y el nombre coincidan

async function main() {
  // Adaptadores conectados
  const adapters = [
    new SAPAdapter(),
    new OracleAdapter(),
    new WorkdayAdapter(),
    new BambooHRAdapter(),
    new LegacyAdapter()
  ];

  // Logger
  const logger = new Logger();

  // Error handler (¡aquí estaba el error!)
  const errorHandler = new ErrorHandler(logger);

  // Mediador
  const mediator = new HRMediator(adapters, logger, errorHandler); // ✅ correcto


  // CLI del sistema
  const cli = new CLI(mediator, logger, errorHandler);

  // Iniciar menú
  await cli.start();
}

main();
