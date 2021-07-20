// access db 
const mysql = require('mysql');
// needed to prompt user 
const inquirer = require('inquirer');
// to access password 
const projPassword = require('./password'); 
// terminal colors 
const chalk = require('chalk'); 
const connection = mysql.createConnection({
    host: 'localhost',

    // port # 
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: projPassword,
    database: 'employee_managementDB',
});


// Connect to the DB
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    //   createProduct();
    beginning();
});
// views departments 
function viewDepartment() {
    console.log('View Department function');
    connection.query('SELECT * FROM department', (err, data) => {
        if (err) throw err;
        // displays the table 
        console.table(data);
        // display menu again 
        direction();
    })

}
// views roles:: views all the roles stores in db 
function viewRoles()
{
    console.log('View Roles')
    connection.query('SELECT * FROM employee_managementdb.role', (err, data) => {
        if (err) throw err;
        // displays the table 
        console.table(data);
        // display menu again 
        direction();
    })
}
// views employees:: views all the employees in db 
function viewEmployees()
{
    console.log('View Employees')
    connection.query('SELECT * FROM employee_managementdb.employee', (err, data) => {
        if (err) throw err;
        // displays the table 
        console.table(data);
        // display menu again 
        direction();
    })

}

// addDepartment:: adds a department to the db  
function addDepartment()
{
    inquirer.prompt([
        {
            name: "departmentName", 
            message:'Enter department name you wish to add: ',
            type: 'input'
        }
    ])
    .then (response => 
    {
        console.log(response); 
        connection.query("INSERT INTO department (name)VALUES (?); ",
                       response.departmentName, 
                        function (err, res) {
                            if (err) throw err;
                            console.log(res);
                            beginning();

                        }
                    )
    })

}

// addRoles:: adds a role to the db 
function addRoles()
{
    // selecting all the roles from the role table 
    connection.query("SELECT * FROM employee_managementdb.department;", (err, data) => {
        
        
        // map through it, so that we can pull out each role 
        // values returned to roleChoices 
        let departmentIndex = {};
        const departmentChoices = data.map((department) => {
            departmentIndex[department.name] = department.id;
            return {
                name: department.name
            }
        })
            // prompt the user 
            inquirer.prompt([
                {
                    name: "title",
                    message: "Enter the employee's title: ",
                    type: "input"
                },
                {
                    name: "salary",
                    message: "Enter the employee's salary: ",
                    type: "input"
                },
                {
                    // TODO
                    name: "departmentID",
                    message: "Enter the employee's department id: ",
                    type: "list",
                    choices: departmentChoices
                }
            ])
                .then((response) => {
                    console.log(response)
                    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?); ",
                        [response.title, response.salary, departmentIndex[response.departmentID]],
                        function (err, res) {
                            if (err) throw err;
                            console.log(res);
                            beginning();
                        }
                    )
                })
    })
}


// addEmployee:: adds an employee
function addEmployee() {
    connection.query("Select * from role", (err, data) => {
         // map through it, so that we can pull out each role 
        // values returned to roleChoices 
        const roleChoices = data.map((role) => {
            return {
                // name of the role 
                name: role.title,
                // we need role id to connect to the deparment table 
                value: role.id

            }
        })
        connection.query("select * from employee where manager_id is null;", function (err, data) {
            if (err) throw err;
            const validManagers = data.map((rec) => {
                return {
                    value: rec.id
                }
            })

            inquirer.prompt([
                {
                    name: "firstName",
                    message: "Enter the employee's first name: ",
                    type: "input"
                },
                {
                    name: "lastName",
                    message: "Enter the employee's last name: ",
                    type: "input"
                },
                {
                    // TODO
                    name: "roleID",
                    message: "Enter the employee's role id: ",
                    type: "list",
                    choices: roleChoices
                },
                {
                    name: "managerID",
                    message: "Enter the employee's manager id: ",
                    type: "list",
                    choices: validManagers

                }

            ])
                .then((response) => {
                    console.log(response)
                    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?); ",
                        [response.firstName, response.lastName, response.roleID, response.managerID],
                        function (err, res) {
                            if (err) throw err;
                            console.log(res);
                            beginning();

                        }
                    )
                })
        })
    })
}


// updateEmployeeRole :: 
    // display all the employees
    // choose which employee uer wish to choose 
    // display all the roles 
    // update statement 
function updateEmployeeRole()
{
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        const roleEmployees = data.map((employee) => {
            return({
                name:employee.first_name,
                value:employee.id,
                roleID: employee.role_id, 
                short: "Please check out the updated table after completing the prompt"
            })
        })

        connection.query('SELECT * FROM role', (err, data) => {
        const roles = data.map((role) => 
        {
            return({
                // returns whatever is listed  
                value: role.id,
                name: role.title
            })

        })
        inquirer.prompt([
            {
                type:"list",
                message:"Choose employee: ",
                choices: roleEmployees,
                name:'empId'
            },
            {
                type: "list",
                message: "Select role to update to:", 
                choices: roles, 
                name: 'userRole'
            }
        ]).then(response=>{
            console.log(response.userRole); 
            console.log(response.empId); 
            connection.query('update employee set ? where ?;', 
            [
                {
                    role_id: response.userRole
                }, 
                {
                    id: response.empId
                }
            ], 
            (err) => 
            {
                if(err) throw err; 
                console.log(response.userRole.id); 
                console.log(response.empId.value); 
            }

            )
            beginning(); 

        })
        // added 
       })
    })

   
}


// direction:: displays the menu of employee management 
function direction() {
    inquirer.prompt({
        name: "direction",
        type: "list",
        message: "Welcome to Employee Management. What would you like to do?",
        choices: ["View Department", "View Roles", "View Employees", "Add Department", "Add Roles", "Add Employees", "Update Employee's Role", "Exit"]

    }).then((response) => {
        switch (response.direction) {
            case 'View Department':
                viewDepartment();
                break;
            case 'View Roles':
                viewRoles(); 
                break;
            case 'View Employees':
                viewEmployees(); 
                break;
            case 'Add Department':
                //   add values going into schema
                // INSERT INTO products SET ? 
                addDepartment(); 
                break;
            case "Add Roles":
                addRoles(); 
                break;
            case "Add Employees":
                addEmployee();
                break;
            case "Update Employee's Role":
                updateEmployeeRole(); 
                break;
            // Exit
            default:
                console.log('Exiting...');
                // Disconnects 
                connection.end();
                process.exit(0);
        }
    })
}

function beginning() {
                   
    console.log(chalk.green`{inverse
██████████                           ████                                          
░░███░░░░░█                          ░░███                                          
 ░███  █ ░  █████████████   ████████  ░███   ██████  █████ ████  ██████   ██████    
 ░██████   ░░███░░███░░███ ░░███░░███ ░███  ███░░███░░███ ░███  ███░░███ ███░░███   
 ░███░░█    ░███ ░███ ░███  ░███ ░███ ░███ ░███ ░███ ░███ ░███ ░███████ ░███████    
 ░███ ░   █ ░███ ░███ ░███  ░███ ░███ ░███ ░███ ░███ ░███ ░███ ░███░░░  ░███░░░     
 ██████████ █████░███ █████ ░███████  █████░░██████  ░░███████ ░░██████ ░░██████    
░░░░░░░░░░ ░░░░░ ░░░ ░░░░░  ░███░░░  ░░░░░  ░░░░░░    ░░░░░███  ░░░░░░   ░░░░░░     
                            ░███                      ███ ░███                      
                            █████                    ░░██████                       
                           ░░░░░                      ░░░░░░                        
 ███████████                              █████                                     
░█░░░███░░░█                             ░░███                                      
░   ░███  ░  ████████   ██████    ██████  ░███ █████  ██████  ████████              
    ░███    ░░███░░███ ░░░░░███  ███░░███ ░███░░███  ███░░███░░███░░███             
    ░███     ░███ ░░░   ███████ ░███ ░░░  ░██████░  ░███████  ░███ ░░░              
    ░███     ░███      ███░░███ ░███  ███ ░███░░███ ░███░░░   ░███                  
    █████    █████    ░░████████░░██████  ████ █████░░██████  █████                 
   ░░░░░    ░░░░░      ░░░░░░░░  ░░░░░░  ░░░░ ░░░░░  ░░░░░░  ░░░░░                  
                                                                                    
                                                                                    
}`


    ); 
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        direction();
    })
}


