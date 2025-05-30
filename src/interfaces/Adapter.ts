// Interfaz que deben implementar todos los adaptadores
import { Employee } from './Employee';

export interface Adapter {
  getEmployees(): Promise<Employee[]>;
  addEmployee(employee: Employee): Promise<void>;
  updateEmployee(employee: Employee): Promise<void>;
}
