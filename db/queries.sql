USE employees_db;

SELECT * FROM department;

SELECT role.id , title, salary, name as department 
from role 
LEFT JOIN department on department.id = role.department_id

-- Space next to department is REQUIRED for query execution
SELECT employee.id, employee.first_name, employee.last_name, title, name as department ,salary, CONCAT(bosses.first_name, ' ',bosses.last_name) as manager from employee
LEFT JOIN role on employee.role_id = role.id
LEFT JOIN department on department.id = role.department_id
LEFT JOIN employee as bosses on employee.manager_id = bosses.id;