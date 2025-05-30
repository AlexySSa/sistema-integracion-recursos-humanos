import { Adapter } from "../interfaces/Adapter";
import { Employee } from "../interfaces/Employee";

// Simulamos que los datos vienen en un formato SAP con campos raros
const sapData = [
  { CODE: "001", NAME: "Ana Torres", EMAIL: "ana@sap.com", ROLE: "HR", AREA: "Recursos", SAL: 1200, ENTRY: "2022-01-10" },
];

export class SAPAdapter implements Adapter {
  async getEmployees(): Promise<Employee[]> {
    // Traducimos de SAP a nuestro modelo común
    return sapData.map(emp => ({
      id: emp.CODE,
      fullName: emp.NAME,
      email: emp.EMAIL,
      position: emp.ROLE,
      department: emp.AREA,
      salary: emp.SAL,
      startDate: emp.ENTRY
    }));
  }

  async addEmployee(employee: Employee): Promise<void> {
    // Convertir el formato común al de SAP y agregarlo
    sapData.push({
      CODE: employee.id,
      NAME: employee.fullName,
      EMAIL: employee.email,
      ROLE: employee.position,
      AREA: employee.department,
      SAL: employee.salary,
      ENTRY: employee.startDate
    });
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const index = sapData.findIndex(e => e.CODE === employee.id);
    if (index !== -1) {
      sapData[index] = {
        CODE: employee.id,
        NAME: employee.fullName,
        EMAIL: employee.email,
        ROLE: employee.position,
        AREA: employee.department,
        SAL: employee.salary,
        ENTRY: employee.startDate
      };
    }
  }
}
