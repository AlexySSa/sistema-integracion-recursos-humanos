import { Adapter } from "../interfaces/Adapter";
import { Employee } from "../interfaces/Employee";

// Simulación de respuesta tipo JSON de una API REST
const workdayData = [
  {
    id: "WD456",
    attributes: {
      full_name: "Lucía Gómez",
      mail: "lucia@workday.com",
      role: "Diseñadora",
      division: "Creativo",
      pay: 1350,
      hired: "2023-03-20"
    }
  }
];

export class WorkdayAdapter implements Adapter {
  async getEmployees(): Promise<Employee[]> {
    return workdayData.map(entry => ({
      id: entry.id,
      fullName: entry.attributes.full_name,
      email: entry.attributes.mail,
      position: entry.attributes.role,
      department: entry.attributes.division,
      salary: entry.attributes.pay,
      startDate: entry.attributes.hired
    }));
  }

  async addEmployee(employee: Employee): Promise<void> {
    workdayData.push({
      id: employee.id,
      attributes: {
        full_name: employee.fullName,
        mail: employee.email,
        role: employee.position,
        division: employee.department,
        pay: employee.salary,
        hired: employee.startDate
      }
    });
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const index = workdayData.findIndex(entry => entry.id === employee.id);
    if (index !== -1) {
      workdayData[index] = {
        id: employee.id,
        attributes: {
          full_name: employee.fullName,
          mail: employee.email,
          role: employee.position,
          division: employee.department,
          pay: employee.salary,
          hired: employee.startDate
        }
      };
    }
  }
}
// Este adaptador simula la interacción con una base de datos Workday