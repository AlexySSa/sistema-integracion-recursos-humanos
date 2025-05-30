// Estructura común de un empleado
export interface Employee {
  id: string;
  fullName: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  startDate: string; // formato ISO
}
