import { Adapter } from "../interfaces/Adapter";
import { Employee } from "../interfaces/Employee";

// Simulación de un sistema legado con formato raro
const legacyData = [
  "LEG001|Juan Rivera|juan@legacy.com|Analista|IT|1250|2019-05-10"
];

export class LegacyAdapter implements Adapter {
  async getEmployees(): Promise<Employee[]> {
    return legacyData.map(line => {
      const [id, name, email, position, department, salary, date] = line.split("|");
      return {
        id,
        fullName: name,
        email,
        position,
        department,
        salary: parseFloat(salary),
        startDate: date
      };
    });
  }

  async addEmployee(employee: Employee): Promise<void> {
    const line = [
      employee.id,
      employee.fullName,
      employee.email,
      employee.position,
      employee.department,
      employee.salary.toString(),
      employee.startDate
    ].join("|");

    legacyData.push(line);
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const index = legacyData.findIndex(line => line.startsWith(employee.id + "|"));
    if (index !== -1) {
      const updatedLine = [
        employee.id,
        employee.fullName,
        employee.email,
        employee.position,
        employee.department,
        employee.salary.toString(),
        employee.startDate
      ].join("|");

      legacyData[index] = updatedLine;
    }
  }
}
