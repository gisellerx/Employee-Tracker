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

}

function viewRoles() {

}

function viewEmployees() {
    db.query
}


function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateEmployeeRole() {

}