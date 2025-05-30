import { Adapter } from "../interfaces/Adapter";
import { Employee } from "../interfaces/Employee";

// Simulamos un formato típico de BambooHR, más minimalista
const bambooData = [
  {
    emp_id: "BMB001",
    name: "Elena López",
    email_address: "elena@bamboo.com",
    job_title: "Contadora",
    team: "Finanzas",
    monthly_salary: 1400,
    date_joined: "2020-08-01"
  }
];

export class BambooHRAdapter implements Adapter {
  async getEmployees(): Promise<Employee[]> {
    return bambooData.map(emp => ({
      id: emp.emp_id,
      fullName: emp.name,
      email: emp.email_address,
      position: emp.job_title,
      department: emp.team,
      salary: emp.monthly_salary,
      startDate: emp.date_joined
    }));
  }

  async addEmployee(employee: Employee): Promise<void> {
    bambooData.push({
      emp_id: employee.id,
      name: employee.fullName,
      email_address: employee.email,
      job_title: employee.position,
      team: employee.department,
      monthly_salary: employee.salary,
      date_joined: employee.startDate
    });
  }

  async updateEmployee(employee: Employee): Promise<void> {
    const index = bambooData.findIndex(e => e.emp_id === employee.id);
    if (index !== -1) {
      bambooData[index] = {
        emp_id: employee.id,
        name: employee.fullName,
        email_address: employee.email,
        job_title: employee.position,
        team: employee.department,
        monthly_salary: employee.salary,
        date_joined: employee.startDate
      };
    }
  }
}
