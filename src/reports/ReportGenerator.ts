import { Employee } from "../interfaces/Employee";

export class ReportGenerator {
  static generarResumen(empleados: Employee[]): void {
    console.log("\n📊 Reporte General de Empleados\n");

    const total = empleados.length;
    const salarioTotal = empleados.reduce((acc, emp) => acc + emp.salary, 0);
    const salarioPromedio = salarioTotal / total;

    console.log(`👥 Total de empleados: ${total}`);
    console.log(`💵 Salario promedio: $${salarioPromedio.toFixed(2)}\n`);

    // Empleados por departamento
    const porDepartamento: Record<string, number> = {};

    empleados.forEach(emp => {
      if (!porDepartamento[emp.department]) {
        porDepartamento[emp.department] = 0;
      }
      porDepartamento[emp.department]++;
    });

    console.log("🏢 Empleados por departamento:");
    for (const [dept, cantidad] of Object.entries(porDepartamento)) {
      console.log(`- ${dept}: ${cantidad}`);
    }

    console.log();
  }
}
// Genera un reporte simple de empleados, mostrando total, promedio y distribución por departamento