import { Adapter } from "../interfaces/Adapter";
import { Employee } from "../interfaces/Employee";

// Simulamos que Oracle devuelve datos en "formato XML" convertido a objetos raros
const oracleData = [
  {
    employee: {
      "@id": "ORC123",
      name: { value: "Carlos Pérez" },
      contact: { email: "carlos@oracle.com" },
      job: { title: "Ingeniero", dept: "TI" },
      compensation: { amount: "1500" },
      joinDate: { iso: "2021-06-15" }
    }
  }
];

export class OracleAdapter implements Adapter {
  async getEmployees(): Promise<Employee[]> {
    return oracleData.map(entry => {
      const emp = entry.employee;
      return {
        id: emp["@id"],
        fullName: emp.name.value,
        email: emp.contact.email,
        position: emp.job.title,
        department: emp.job.dept,
        salary: parseFloat(emp.compensation.amount),
        startDate: emp.joinDate.iso
      };
    });
  }

  async addEmployee(employee: Employee): Promise<void> {
    oracleData.push({
      employee: {
        "@id": employee.id,
        name: { value: employee.fullName },
        contact: { email: employee.email },
        job: { title: employee.position, dept: employee.department },
        compensation: { amount: employee.salary.toString() },
        joinDate: { iso: employee.startDate }
      }
    });
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const index = oracleData.findIndex(entry => entry.employee["@id"] === employee.id);
    if (index !== -1) {
      oracleData[index] = {
        employee: {
          "@id": employee.id,
          name: { value: employee.fullName },
          contact: { email: employee.email },
          job: { title: employee.position, dept: employee.department },
          compensation: { amount: employee.salary.toString() },
          joinDate: { iso: employee.startDate }
        }
      };
    }
  }
}
// Este adaptador simula la interacción con una base de datos Oracle