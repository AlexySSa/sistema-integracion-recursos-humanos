/**
 * Valida que un objeto empleado tenga todos los campos requeridos
 * @param employee Objeto empleado a validar
 * @throws Error si falta algún campo requerido
 */
export function validateEmployee(employee: any): void {
    if (!employee) {
        throw new Error('El empleado no puede ser nulo');
    }
    
  const requiredFields = ['id', 'fullName', 'email', 'department', 'salary', 'position', 'startDate'];

    for (const field of requiredFields) {
        if (!employee[field]) {
            throw new Error(`Campo requerido faltante: ${field}`);
        }
    }
}

/**
 * Valida que un email tenga formato correcto
 * @param email Email a validar
 * @throws Error si el formato no es válido
 */
export function validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido');
    }
}

/**
 * Valida que un salario sea un número positivo
 * @param salary Salario a validar
 * @throws Error si no es un número o es negativo
 */
export function validateSalary(salary: number): void {
    if (isNaN(salary) || typeof salary !== 'number') {
        throw new Error('El salario debe ser un número');
    }
    if (salary < 0) {
        throw new Error('El salario no puede ser negativo');
    }
}

/**
 * Valida que una fecha sea válida
 * @param date Fecha a validar
 * @throws Error si la fecha no es válida
 */
export function validateDate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error('Fecha inválida');
    }
}