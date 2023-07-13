let token = localStorage.getItem('token');
if (token == null) {
  alert('Login First');
  window.location.href = './index.html';
}

const logoutbtn = document.getElementById('signoutbtn');
logoutbtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = './index.html';
});



// Constants for API endpoints
const BASE_URL = 'https://employee-mangement-system.onrender.com';
const EMPLOYEE_API = `${BASE_URL}/api/employees`;

// Variables for pagination and filtering
let currentPage = 1;
const limit = 5;
let currentFilter = '';
let currentSearch = '';
let currentSort = 'ascending';

// Function to fetch employees for a specific page from the server
async function getEmployeesByPage(page) {
    try {
      const response = await fetch(
        `${EMPLOYEE_API}?page=${page}&limit=${limit}&department=${currentFilter}&search=${currentSearch}&sortBy=salary&sortOrder=${currentSort}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting employees:', error);
      throw error;
    }
  }
  

// Function to update pagination buttons based on previous and next links
function updatePaginationButtons(previous, next) {
  const previousButton = document.getElementById('previousButton');
  const nextButton = document.getElementById('nextButton');

  previousButton.disabled = !previous;
  nextButton.disabled = !next;

  if (previous) {
    previousButton.addEventListener('click', () => handlePaginationClick(previous.page));
  } else {
    previousButton.removeEventListener('click', handlePaginationClick);
  }

  if (next) {
    nextButton.addEventListener('click', () => handlePaginationClick(next.page));
  } else {
    nextButton.removeEventListener('click', handlePaginationClick);
  }
}

// Function to handle pagination button click
function handlePaginationClick(page) {
  currentPage = page;
  loadEmployees();
}

// Function to fetch and populate employees for the current page
async function loadEmployees() {
  try {
    const { results, previous, next } = await getEmployeesByPage(currentPage);
    populateEmployeeTable(results);
    updatePaginationButtons(previous, next);
    attachDeleteEventListeners();
    attachEditEventListeners();
  } catch (error) {
    console.error('Error loading employees:', error);
  }
}

// Function to fetch all employees from the server
async function getAllEmployees() {
  try {
    const response = await fetch(EMPLOYEE_API);
    const data = await response.json();
    return data.employees;
  } catch (error) {
    console.error('Error getting employees:', error);
    throw error;
  }
}

// Function to add a new employee
async function addEmployee(employeeData) {
  try {
    const response = await fetch(EMPLOYEE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });
    const data = await response.json();
    return data.employee;
  } catch (error) {
    console.error('Error adding employee:', error);
    alert(error);
    throw error;
  }
}

// Function to delete an employee
async function deleteEmployee(employeeId) {
  try {
    const response = await fetch(`${EMPLOYEE_API}/${employeeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    alert(data.message);
    return data.message;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// Function to populate the employee table with data
function populateEmployeeTable(employees) {
  const tableBody = document.getElementById('employeeTableBody');
  tableBody.innerHTML = '';

  if (employees && employees.length > 0) {
    employees.forEach((employee) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${employee.firstName}</td>
        <td>${employee.lastName}</td>
        <td>${employee.email}</td>
        <td>${employee.department}</td>
        <td>${employee.salary}</td>
        <td><button class="editButton" data-id="${employee._id}">Edit</button></td>
        <td><button class="deleteButton" data-id="${employee._id}">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="7">No employees found</td>';
    tableBody.appendChild(row);
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const department = document.getElementById('department').value;
  const salary = document.getElementById('salary').value;

  const employeeData = {
    firstName,
    lastName,
    email,
    department,
    salary,
  };

  try {
    const newEmployee = await addEmployee(employeeData);
    const employees = await getAllEmployees();
    populateEmployeeTable(employees);
    resetForm();
    loadEmployees(); // Load employees again after adding a new employee
  } catch (error) {
    console.error('Error handling form submission:', error);
  }
}

// Function to reset the form after submission
function resetForm() {
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('department').value = 'Tech';
  document.getElementById('salary').value = '';
}

// Function to attach event listeners for delete buttons
function attachDeleteEventListeners() {
  const deleteButtons = document.getElementsByClassName('deleteButton');
  Array.from(deleteButtons).forEach((button) => {
    button.addEventListener('click', handleDelete);
  });
}

// Function to attach event listeners for edit buttons
function attachEditEventListeners() {
  const editButtons = document.getElementsByClassName('editButton');
  Array.from(editButtons).forEach((button) => {
    button.addEventListener('click', handleEdit);
  });
}

// Function to handle edit button click
function handleEdit(event) {
  const employeeId = event.target.dataset.id;
  window.location.href = `./employee.html?id=${employeeId}`;
}

// Function to handle delete button click
async function handleDelete(event) {
  const employeeId = event.target.dataset.id;

  try {
    await deleteEmployee(employeeId);
    const employees = await getAllEmployees();
    populateEmployeeTable(employees);
    loadEmployees();
  } catch (error) {
    console.error('Error handling delete:', error);
  }
}

// Function to handle filter and search button click
function handleFilterSearch() {
  const departmentFilter = document.getElementById('departmentFilter');
  const searchInput = document.getElementById('searchInput');

  currentFilter = departmentFilter.value;
  currentSearch = searchInput.value;
  currentPage = 1;
  loadEmployees();
}

// Function to handle sort button click
function handleSort() {
  const sortBy = document.getElementById('sortBy');

  currentSort = sortBy.value;
  currentPage = 1;
  loadEmployees();
}

// Event listener for form submission
document.getElementById('addEmployeeForm').addEventListener('submit', handleFormSubmit);

// Event listener for filter and search button click
document.getElementById('filterSearchButton').addEventListener('click', handleFilterSearch);

// Event listener for sort button click
// document.getElementById('sortButton').addEventListener('click', handleSort);

// Initial setup
loadEmployees();

// sort by salary asc 
const sortBySalaryAscButton = document.querySelector(".sortbysalaryasc");
const sortBySalaryDescButton = document.querySelector(".sortbysalarydesc");

// sortBySalaryAscButton.addEventListener("click", async () => {
//   try {
//     const response = await fetch(`${EMPLOYEE_API}?sortBy=salary&sortOrder=asc`);
//     const data = await response.json();
//     console.log(data);
//     displayEmployeeData(data.data);
//   } catch (error) {
//     console.error("Error sorting employees:", error);
//   }
// });

// // sort by salary desc
// sortBySalaryDescButton.addEventListener("click", async () => {
//   try {
//     const response = await fetch(`${EMPLOYEE_API}?sortBy=salary&sortOrder=desc`);
//     const data = await response.json();
//     console.log(data);
//     displayEmployeeData(data.data);
//   } catch (error) {
//     console.error("Error sorting employees:", error);
//   }
// });
