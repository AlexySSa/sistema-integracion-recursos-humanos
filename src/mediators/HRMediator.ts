import { Adapter } from '../interfaces/Adapter';
import { Employee } from '../interfaces/Employee';
import { Logger } from '../utils/logger';
import { ErrorHandler } from '../utils/errorHandler';
import {
  validateEmployee,
  validateEmail,
  validateSalary
} from '../utils/validators';

/**
 * Estructura de empleado con origen
 */
export interface SourcedEmployee {
  data: Employee;
  source: string;
}

export class HRMediator {
  private adapters: Adapter[] = [];
  private logger: Logger;
  private errorHandler: ErrorHandler;

  constructor(adapters: Adapter[], logger: Logger, errorHandler: ErrorHandler) {
    this.adapters = adapters;
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  async getAllEmployees(): Promise<SourcedEmployee[]> {
    this.logger.log('Iniciando obtención de todos los empleados');
    const allEmployees: SourcedEmployee[] = [];

    for (const adapter of this.adapters) {
      try {
        const employees = await adapter.getEmployees();
        allEmployees.push(
          ...employees.map(emp => ({
            data: emp,
            source: adapter.constructor.name
          }))
        );
        this.logger.log(
          `Obtenidos ${employees.length} empleados de ${adapter.constructor.name}`
        );
      } catch (error) {
        this.errorHandler.handleError(
          error,
          `Error obteniendo empleados de ${adapter.constructor.name}`
        );
      }
    }

    this.logger.log(`Total de empleados obtenidos: ${allEmployees.length}`);
    return allEmployees;
  }

  async addEmployee(employee: Employee): Promise<void> {
    try {
      validateEmployee(employee);
      validateEmail(employee.email);
      validateSalary(employee.salary);

      this.logger.log(`Intentando agregar empleado: ${employee.fullName}`);

      const results = await Promise.allSettled(
        this.adapters.map((adapter) => adapter.addEmployee(employee))
      );

      const successful = results.some((r) => r.status === 'fulfilled');
      if (!successful) {
        throw new Error(
          'No se pudo agregar el empleado en ningún sistema'
        );
      }

      this.logger.log('Empleado agregado exitosamente en al menos un sistema');
    } catch (error) {
      this.errorHandler.handleError(error, 'Error agregando empleado');
      throw error;
    }
  }

  async updateEmployee(employee: Employee): Promise<void> {
    try {
      validateEmployee(employee);
      validateEmail(employee.email);
      validateSalary(employee.salary);

      this.logger.log(`Intentando actualizar empleado ID: ${employee.id}`);

      const allEmployees = await this.getAllEmployees();
      const exists = allEmployees.some((e) => e.data.id === employee.id);
      if (!exists) {
        throw new Error(
          `Empleado con ID ${employee.id} no encontrado en ningún sistema`
        );
      }

      const results = await Promise.allSettled(
        this.adapters.map((adapter) => adapter.updateEmployee(employee))
      );

      const successful = results.some((r) => r.status === 'fulfilled');
      if (!successful) {
        throw new Error('No se pudo actualizar el empleado en ningún sistema');
      }

      this.logger.log('Empleado actualizado exitosamente');
    } catch (error) {
      this.errorHandler.handleError(error, 'Error actualizando empleado');
      throw error;
    }
  }

  async findEmployeeById(id: string): Promise<Employee | undefined> {
    const allEmployees = await this.getAllEmployees();
    const match = allEmployees.find((entry) => entry.data.id === id);
    return match?.data;
  }
}
