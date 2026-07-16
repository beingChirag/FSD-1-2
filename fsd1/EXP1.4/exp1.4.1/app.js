const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let employees = [];

// Menu
function menu() {
  console.log("\nEmployee Management System");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Update Employee");
  console.log("4. Delete Employee");
  console.log("5. Exit");

  rl.question("Select an option: ", handleMenu);
}

// Handle menu choice
function handleMenu(choice) {
  switch (choice) {
    case "1":
      addEmployee();
      break;
    case "2":
      listEmployees();
      break;
    case "3":
      updateEmployee();
      break;
    case "4":
      deleteEmployee();
      break;
    case "5":
      console.log("Exiting...");
      rl.close();
      break;
    default:
      console.log("Invalid option!");
      menu();
  }
}

// Add Employee
function addEmployee() {
  rl.question("Employee Name: ", name => {
    rl.question("Position: ", position => {
      rl.question("Salary: ", salary => {
        const emp = {
          id: Date.now(),
          name,
          position,
          salary: Number(salary)
        };

        employees.push(emp);
        console.log("Employee added successfully!");
        menu();
      });
    });
  });
}

// List Employees
function listEmployees() {
  console.log("\nEmployee List:");

  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    employees.forEach(emp => {
      console.log(
        `ID: ${emp.id}, Name: ${emp.name}, Position: ${emp.position}, Salary: $${emp.salary}`
      );
    });
    console.log(`Total employees: ${employees.length}`);
  }

  menu();
}

// Update Employee
function updateEmployee() {
  rl.question("Enter Employee ID to update: ", id => {
    const emp = employees.find(e => e.id == id);

    if (!emp) {
      console.log("Employee not found!");
      return menu();
    }

    rl.question("New Name: ", name => {
      rl.question("New Position: ", position => {
        rl.question("New Salary: ", salary => {
          emp.name = name;
          emp.position = position;
          emp.salary = Number(salary);

          console.log("Employee updated!");
          menu();
        });
      });
    });
  });
}

// Delete Employee
function deleteEmployee() {
  rl.question("Enter Employee ID to delete: ", id => {
    const index = employees.findIndex(e => e.id == id);

    if (index === -1) {
      console.log("Employee not found!");
    } else {
      employees.splice(index, 1);
      console.log("Employee deleted!");
    }

    menu();
  });
}

// Start app
menu();