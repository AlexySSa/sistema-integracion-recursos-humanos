import readline from 'readline/promises';
import { HRMediator } from '../mediators/HRMediator';
import { ReportGenerator } from '../reports/ReportGenerator';
import { Logger } from '../utils/logger';
import { ErrorHandler } from '../utils/errorHandler';
import { validateEmail, validateSalary } from '../utils/validators';
import { Employee } from '../interfaces/Employee';

export class CLI {
  private rl: readline.Interface;
  private mediator: HRMediator;
  private reportGenerator: typeof ReportGenerator;
  private logger: Logger;
  private errorHandler: ErrorHandler;

  constructor(
    mediator: HRMediator,
    logger: Logger,
    errorHandler: ErrorHandler
  ) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.mediator = mediator;
    this.logger = logger; // 🔥 ESTA LÍNEA ERA CLAVE
    this.reportGenerator = ReportGenerator;
    this.errorHandler = errorHandler;
  }

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
            console.log('❌ Opción no válida');
        }
      } catch (error) {
        this.errorHandler.handleError(error as Error, 'Error en la interfaz CLI');
        console.log('Ocurrió un error. Intente nuevamente.');
      }
    }
  }

  private async showMenu(): Promise<string> {
    console.log('\n📋 Menú Principal:');
    console.log('1. Ver todos los empleados');
    console.log('2. Agregar nuevo empleado');
    console.log('3. Actualizar empleado existente');
    console.log('4. Generar reporte');
    console.log('5. Salir');
    return this.rl.question('Seleccione una opción: ');
  }

private async showAllEmployees(): Promise<void> {
  const sourcedEmployees = await this.mediator.getAllEmployees();

  if (sourcedEmployees.length === 0) {
    console.log('No se encontraron empleados.');
    return;
  }

  console.log('\n👥 Lista de Empleados por sistema:');
  sourcedEmployees.forEach((entry, index) => {
    const emp = entry.data;
    const system = entry.source;

    console.log(
      `${index + 1}. ${emp.fullName} (${emp.department}) - ${emp.position} - ID: ${emp.id} [Sistema: ${system}]`
    );
  });
}


  private async addEmployee(): Promise<void> {
    console.log('\n🆕 Agregar Nuevo Empleado:');

    const fullName = await this.rl.question('Nombre completo: ');
    const email = await this.rl.question('Email: ');
    const position = await this.rl.question('Cargo o puesto: ');
    const department = await this.rl.question('Departamento: ');
    const salaryStr = await this.rl.question('Salario: ');
    const salary = parseFloat(salaryStr);

    try {
      validateEmail(email);
      validateSalary(salary);
    } catch (error) {
      this.errorHandler.handleError(error as Error, 'Validación de campos');
      return;
    }

    const newEmployee: Employee = {
       id: `EMP${Math.floor(Math.random() * 900 + 100)}`,
      fullName,
      email,
      position,
      department,
      salary,
      startDate: new Date().toISOString()
    };

    await this.mediator.addEmployee(newEmployee);
    console.log('✅ Empleado agregado exitosamente.');
  }

  private async updateEmployee(): Promise<void> {
    console.log('\n✏️ Actualizar Empleado:');
    const id = await this.rl.question('ID del empleado a actualizar: ');

    const existingEmployee = await this.mediator.findEmployeeById(id);
    if (!existingEmployee) {
      console.log('❌ Empleado no encontrado');
      return;
    }

    console.log(`Editando empleado: ${existingEmployee.fullName}`);

    const fullName = await this.rl.question(`Nombre (${existingEmployee.fullName}): `) || existingEmployee.fullName;
    const email = await this.rl.question(`Email (${existingEmployee.email}): `) || existingEmployee.email;
    const position = await this.rl.question(`Cargo (${existingEmployee.position}): `) || existingEmployee.position;
    const department = await this.rl.question(`Departamento (${existingEmployee.department}): `) || existingEmployee.department;
    const salaryStr = await this.rl.question(`Salario (${existingEmployee.salary}): `) || existingEmployee.salary.toString();
    const salary = parseFloat(salaryStr);

    try {
      validateEmail(email);
      validateSalary(salary);
    } catch (error) {
      this.errorHandler.handleError(error as Error, 'Validación de campos actualizados');
      return;
    }

    const updatedEmployee: Employee = {
      ...existingEmployee,
      fullName,
      email,
      position,
      department,
      salary
    };

    await this.mediator.updateEmployee(updatedEmployee);
    console.log('✅ Empleado actualizado exitosamente.');
  }

  private async generateReport(): Promise<void> {
    const sourced = await this.mediator.getAllEmployees();
const employees = sourced.map(entry => entry.data); // solo sacamos los datos puros
this.reportGenerator.generarResumen(employees);

  }
}
