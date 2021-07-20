const mysql = require('mysql');
const inquirer = require('inquirer');
const projPassword = require('./password'); 
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
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
// views roles 
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
// views employees 
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

// user is prompted to add a department 
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

// add roles 
function addRoles()
{
    connection.query("SELECT * FROM employee_managementdb.department;", (err, data) => {
        // map through the information that we get back 
        // selecting all the roles from the role table 
        // map through it, so that we can pull out each role 

        // or you can do console.table(data); 
        // values returned to roleChoices 
        let departmentIndex = {};
        const departmentChoices = data.map((department) => {
            departmentIndex[department.name] = department.id;
            return {
                name: department.name
            }
        })
    
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


// adds an employee
function addEmployee() {
    connection.query("Select * from role", (err, data) => {
        // map through the information that we get back 
        // selecting all the roles from the role table 
        // map through it, so that we can pull out each role 

        // or you can do console.table(data); 
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
        // connection.query('INSERT INTO employee SET ?', (err,data) => {
        // TODO: finc managers 
        // prompt the user 
        // 
        //     if(err) throw err; 
        //     // displays the table 
        //     console.table(data); 
        //     // display menu again 

    })
}


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


// displays the menu of employee management 
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
    // alert( "/".match(new RegExp("/")) );
    // console.log("_____       ___  ___   _____   _       _____  __    __  _____   _____            ___  ___       ___   __   _       ___   _____   _____   _____ "); 
    // console.log("| ____|     /   |/   | |  _  \ | |     /  _  \ \ \  / / | ____| | ____|          /   |/   |     /   | |  \ | |     /   | /  ___| | ____| |  _ \ "); 
    // console.log("| |__      / /|   /| | | |_| | | |     | | | |  \ \/ /  | |__   | |__           / /|   /| |    / /| | |   \| |    / /| | | |     | |__   | |_| | "); 
    // console.log("|  __|    / / |__/ | | |  ___/ | |     | | | |   \  /   |  __|  |  __|         / / |__/ | |   / / | | | |\   |   / / | | | |  _  |  __|  |  _  / "); 
    // console.log("| |___   / /       | | | |     | |___  | |_| |   / /    | |___  | |___        / /       | |  / /  | | | | \  |  / /  | | | |_| | | |___  | | \ \ "); 
    // console.log("|_____| /_/        |_| |_|     |_____| \_____/  /_/     |_____| |_____|      /_/        |_| /_/   |_| |_|  \_| /_/   |_| \_____/ |_____| |_|  \_\ ");                     
    
    //TO display everything is our db 
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        direction();
    })
}


