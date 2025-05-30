import { Adapter } from '../interfaces/Adapter';
import { Employee } from '../interfaces/Employee';
import { Logger } from '../utils/logger';
import { ErrorHandler } from '../utils/errorHandler';
import { validateEmployee, validateEmail, validateSalary } from '../utils/validators';

/**
 * HRMediator - Clase mediadora que centraliza las operaciones entre
 * la interfaz de usuario y los diferentes adapters de sistemas HR
 */
export class HRMediator {
    private adapters: Adapter[] = [];
    private logger: Logger;
    private errorHandler: ErrorHandler;

    constructor(adapters: Adapter[], logger: Logger, errorHandler: ErrorHandler) {
        this.adapters = adapters;
        this.logger = logger;
        this.errorHandler = errorHandler;
    }

    /**
     * Obtiene todos los empleados de todos los sistemas conectados
     * @returns Promise con array de empleados unificados
     */
    async getAllEmployees(): Promise<Employee[]> {
        this.logger.log('Iniciando obtención de todos los empleados');
        const allEmployees: Employee[] = [];

        for (const adapter of this.adapters) {
            try {
                const employees = await adapter.fetchEmployees();
                allEmployees.push(...employees);
                this.logger.log(`Obtenidos ${employees.length} empleados de ${adapter.constructor.name}`);
            } catch (error) {
                this.errorHandler.handleError(error, `Error obteniendo empleados de ${adapter.constructor.name}`);
            }
        }

        this.logger.log(`Total de empleados obtenidos: ${allEmployees.length}`);
        return allEmployees;
    }

    /**
     * Agrega un nuevo empleado a todos los sistemas compatibles
     * @param employee Objeto empleado a agregar
     * @throws Error si la validación falla o no se puede agregar
     */
    async addEmployee(employee: Employee): Promise<void> {
        try {
            // Validaciones
            validateEmployee(employee);
            validateEmail(employee.email);
            validateSalary(employee.salary);

            this.logger.log(`Intentando agregar empleado: ${employee.name}`);

            const results = await Promise.allSettled(
                this.adapters.map(adapter => adapter.addEmployee(employee))
            );

            // Verificar si al menos un adapter lo agregó
            const successful = results.some(r => r.status === 'fulfilled');
            if (!successful) {
                throw new Error('No se pudo agregar el empleado en ningún sistema');
            }

            this.logger.log('Empleado agregado exitosamente en al menos un sistema');
        } catch (error) {
            this.errorHandler.handleError(error, 'Error agregando empleado');
            throw error;
        }
    }

    /**
     * Actualiza un empleado existente en los sistemas que lo contengan
     * @param employee Objeto empleado con datos actualizados
     * @throws Error si la validación falla o el empleado no existe
     */
    async updateEmployee(employee: Employee): Promise<void> {
        try {
            validateEmployee(employee);
            validateEmail(employee.email);
            validateSalary(employee.salary);

            this.logger.log(`Intentando actualizar empleado ID: ${employee.id}`);

            // Verificar existencia en al menos un sistema
            const allEmployees = await this.getAllEmployees();
            const exists = allEmployees.some(e => e.id === employee.id);
            if (!exists) {
                throw new Error(`Empleado con ID ${employee.id} no encontrado en ningún sistema`);
            }

            const results = await Promise.allSettled(
                this.adapters.map(adapter => adapter.updateEmployee(employee))
            );

            const successful = results.some(r => r.status === 'fulfilled');
            if (!successful) {
                throw new Error('No se pudo actualizar el empleado en ningún sistema');
            }

            this.logger.log('Empleado actualizado exitosamente');
        } catch (error) {
            this.errorHandler.handleError(error, 'Error actualizando empleado');
            throw error;
        }
    }

    /**
     * Busca un empleado por ID en todos los sistemas
     * @param id ID del empleado a buscar
     * @returns Empleado encontrado o undefined
     */
    async findEmployeeById(id: string): Promise<Employee | undefined> {
        const allEmployees = await this.getAllEmployees();
        return allEmployees.find(e => e.id === id);
    }
}