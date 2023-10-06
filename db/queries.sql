USE employees_db;

SELECT * FROM department;

SELECT role.id , title, salary, name as department 
from role LEFT JOIN department on department.id = role.department_id