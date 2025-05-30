import readline from 'readline/promises';
import { HRMediator } from '../mediators/HRMediator';
import { ReportGenerator } from '../reports/ReportGenerator';
import { Logger } from '../utils/logger';
import { ErrorHandler } from '../utils/errorHandler';

/**
 * Interfaz de línea de comandos para el sistema HR
 */
export class CLI {
    private rl: readline.Interface;
    private mediator: HRMediator;
    private reportGenerator: ReportGenerator;
    private logger: Logger;
    private errorHandler: ErrorHandler;

    constructor(mediator: HRMediator, reportGenerator: ReportGenerator, logger: Logger, errorHandler: ErrorHandler) {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.mediator = mediator;
        this.reportGenerator = reportGenerator;
        this.logger = logger;
        this.errorHandler = errorHandler;
    }

    /**
     * Inicia la interfaz de línea de comandos
     */
    async start() {
        this.logger.log('Iniciando interfaz de línea de comandos');
        console.log('=== Sistema de Gestión de Empleados ===');

        while (true) {
            try {
                const choice = await this.showMenu();
                
                switch (choice) {
                    case '1':
                        await this.showAllEmployees();
                        break;
                    case '2':
                        await this.addEmployee();
                        break;
                    case '3':
                        await this.updateEmployee();
                        break;
                    case '4':
                        await this.generateReport();
                        break;
                    case '5':
                        console.log('Saliendo del sistema...');
                        this.rl.close();
                        return;
                    default:
                        console.log('Opción no válida');
                }
            } catch (error) {
                this.errorHandler.handleError(error, 'Error en la interfaz CLI');
                console.log('Ocurrió un error. Intente nuevamente.');
            }
        }
    }

    private async showMenu(): Promise<string> {
        console.log('\nMenú Principal:');
        console.log('1. Ver todos los empleados');
        console.log('2. Agregar nuevo empleado');
        console.log('3. Actualizar empleado existente');
        console.log('4. Generar reporte de salarios');
        console.log('5. Salir');
        return this.rl.question('Seleccione una opción: ');
    }

    private async showAllEmployees(): Promise<void> {
        console.log('\nObteniendo lista de empleados...');
        const employees = await this.mediator.getAllEmployees();
        
        if (employees.length === 0) {
            console.log('No se encontraron empleados');
            return;
        }

        console.log('\nLista de Empleados:');
        employees.forEach((emp, index) => {
            console.log(`${index + 1}. ${emp.name} (${emp.department}) - ID: ${emp.id}`);
        });
    }

    private async addEmployee(): Promise<void> {
        console.log('\nAgregar Nuevo Empleado:');
        
        const name = await this.rl.question('Nombre completo: ');
        const email = await this.rl.question('Email: ');
        const department = await this.rl.question('Departamento: ');
        const salaryStr = await this.rl.question('Salario: ');
        const salary = parseFloat(salaryStr);

        const newEmployee = {
            id: `TEMP-${Date.now()}`,
            name,
            email,
            department,
            salary,
            hireDate: new Date()
        };

        await this.mediator.addEmployee(newEmployee);
        console.log('Empleado agregado exitosamente!');
    }

    private async updateEmployee(): Promise<void> {
        console.log('\nActualizar Empleado:');
        const id = await this.rl.question('ID del empleado a actualizar: ');
        
        const existingEmployee = await this.mediator.findEmployeeById(id);
        if (!existingEmployee) {
            console.log('Empleado no encontrado');
            return;
        }

        console.log(`Editando empleado: ${existingEmployee.name}`);
        const name = await this.rl.question(`Nombre (${existingEmployee.name}): `) || existingEmployee.name;
        const email = await this.rl.question(`Email (${existingEmployee.email}): `) || existingEmployee.email;
        const department = await this.rl.question(`Departamento (${existingEmployee.department}): `) || existingEmployee.department;
        const salaryStr = await this.rl.question(`Salario (${existingEmployee.salary}): `) || existingEmployee.salary.toString();
        const salary = parseFloat(salaryStr);

        const updatedEmployee = {
            ...existingEmployee,
            name,
            email,
            department,
            salary
        };

        await this.mediator.updateEmployee(updatedEmployee);
        console.log('Empleado actualizado exitosamente!');
    }

    private async generateReport(): Promise<void> {
        console.log('\nGenerando reporte...');
        const employees = await this.mediator.getAllEmployees();
        const report = this.reportGenerator.generateSalaryReport(employees);
        console.log('\n' + report);
    }
}