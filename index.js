const inquirer = require('inquirer')
const mysql = require('mysql2')
const {printTable} = require('console-table-printer')
require('dotenv').config()

const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
})

db.connect(() => {
    mainMenu()
})

function mainMenu() {
    inquirer
      .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        })
        .then(answer => {

            if (answer.action === 'View all departments') {
                viewDepartments()
            } else if (answer.action === 'View all roles') {
                viewRoles()
            } else if (answer.action === 'View all employees') {
                viewEmployees()
            } else if (answer.action === 'Add a department') {
                addDepartment()
            } else if (answer.action === 'Add a role') {
                addRole()
            } else if (answer.action === 'Add an employee') {
                addEmployee()
            } else if (answer.action === 'Update an employee role') {
                updateEmployeeRole()
            }
        })
}


function viewDepartments() {
    db.query(`SELECT * FROM department;`, (err, data) => {
        printTable(data)
        mainMenu()
    })
}

function viewRoles() {
    db.query(`SELECT role.id, title, salary, name as department FROM role LEFT JOIN department on department.id = role.department_id;`, (err, data) => {
        printTable(data)
        mainMenu()
    })
}

function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, title, name as department , salary, CONCAT(bosses.first_name, ' ',bosses.last_name) as manager FROM employee
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on department.id = role.department_id
    LEFT JOIN employee as bosses on employee.manager_id = bosses.id;`, (err, data) => {
        printTable(data)
        mainMenu()
    })
}


function addDepartment() {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ]).then(answer => {
        db.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, (err, data) => {
            if (err) throw err
            console.log('Department added!')
            viewDepartments()
        })
    })
}

function addRole() {
    db.query(`SELECT id as value, name FROM department`, (err, departmentData) => {
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the new role?'
            },
            {
                name:'salary',
                type: 'input',
                message: 'What is the salary of the new role?'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Which department does the new role belong to?',
                choices: departmentData
            }
        ]).then(answer => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${answer.department}')`, (err, data) => {
                if (err) throw err
                console.log('Role added!')
                viewRoles()
            })
        })
    })
}

function addEmployee() {
    db.query(`SELECT id as value, title as name FROM role`, (err, roleData) => {
        db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee`, (err, managerData) => {
            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'What is the first name of the new employee?'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'What is the last name of the new employee?'
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'What is the role of the new employee?',
                    choices: roleData
                },
                {
                    name:'manager_id',
                    type: 'list',
                    message: 'Who is the manager of the new employee?',
                    choices: managerData
                }
            ]).then(answer => {
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', '${answer.role_id}', '${answer.manager_id}');`, (err, data) => {
                    console.log('Employee added!')
                    viewEmployees()
                })
            })
        })
    })
}

function updateEmployeeRole() {
    db.query(`SELECT id as value, title as name FROM role`, (err, roleData) => {
        db.query(`SELECT id as value, CONCAT(first_name,'', last_name) as name FROM employee`, (err, employeeData) => {
            inquirer.prompt([
                {
                    name: 'employee_id',
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    choices: employeeData
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'What is the new role of the employee?',
                    choices: roleData
                }
            ]).then(answer => {
                db.query(`UPDATE employee SET role_id = '${answer.role_id}' WHERE id = '${answer.employee_id}';`, (err, data) => {
                    console.log('Employee role updated!')
                    viewEmployees()
                })
            })
        })
    })
}