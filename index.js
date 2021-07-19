const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'Muncharoo80!',
    database: 'employee_managementDB',
});


// Connect to the DB
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    //   createProduct();
    beginning();
});

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

// primpt the user 
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
                break;
            case 'View Employee':
                break;
            case 'Add Department':
                //   add values going into schema
                // INSERT INTO products SET ? 

                break;
            case "Add Roles":
                break;
            case "Add Employees":
                addEmployee();
                break;
            case "Update Employee's Role":
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
    //TO display everything is our db 
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        direction();
    })
}
