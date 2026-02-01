// Handle form submission
document.getElementById('admission-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(document.getElementById('admission-form'));
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Student registered successfully! ID: ' + result.id);
            document.getElementById('admission-form').reset();
            loadStudents();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Error submitting form: ' + error.message);
    }
});

// Load and display all students
async function loadStudents() {
    try {
        const response = await fetch('/api/students');
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Display students in table format
function displayStudents(students) {
    let html = '<h3>Registered Students</h3>';
    
    if (students.length === 0) {
        html += '<p>No students registered yet.</p>';
    } else {
        html += '<table border="1">';
        html += '<tr>';
        html += '<th>ID</th><th>Name</th><th>DOB</th><th>Gender</th><th>Email</th><th>Mobile</th><th>City</th><th>Actions</th>';
        html += '</tr>';

        students.forEach(student => {
            html += '<tr>';
            html += '<td>' + student.id + '</td>';
            html += '<td>' + student.student_name + '</td>';
            html += '<td>' + student.dob + '</td>';
            html += '<td>' + student.gender + '</td>';
            html += '<td>' + student.email + '</td>';
            html += '<td>' + student.mobile + '</td>';
            html += '<td>' + student.city + '</td>';
            html += '<td>';
            html += '<button onclick="viewStudent(' + student.id + ')">View</button>';
            html += '<button onclick="deleteStudent(' + student.id + ')">Delete</button>';
            html += '</td>';
            html += '</tr>';
        });

        html += '</table>';
    }

    const container = document.getElementById('students-list') || createStudentsContainer();
    container.innerHTML = html;
}

// Create container for students list
function createStudentsContainer() {
    const container = document.createElement('div');
    container.id = 'students-list';
    document.querySelector('.form-container').appendChild(container);
    return container;
}

// Delete student
async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch('/api/students/' + id, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Student deleted successfully');
                loadStudents();
            } else {
                alert('Error deleting student');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// View student details
async function viewStudent(id) {
    try {
        const response = await fetch('/api/students/' + id);
        const student = await response.json();
        
        let details = 'Student Details:\n\n';
        details += 'Name: ' + student.student_name + '\n';
        details += 'DOB: ' + student.dob + '\n';
        details += 'Gender: ' + student.gender + '\n';
        details += 'Email: ' + student.email + '\n';
        details += 'Mobile: ' + student.mobile + '\n';
        details += 'Address: ' + student.address + '\n';
        details += 'City: ' + student.city + '\n';
        details += 'State: ' + student.state + '\n';
        details += 'Pincode: ' + student.pincode + '\n';
        details += 'Father: ' + student.father_name + '\n';
        details += 'Mother: ' + student.mother_name + '\n';
        details += 'Parent Mobile: ' + student.parent_mobile + '\n';
        details += 'Occupation: ' + student.occupation + '\n';
        details += '10th School: ' + student.school_10 + '\n';
        details += '10th Percentage: ' + student.percent_10 + '\n';
        details += '12th School: ' + student.school_12 + '\n';
        details += '12th Percentage: ' + student.percent_12 + '\n';
        details += 'CET Percentile: ' + student.cet_percentile + '\n';
        details += 'Category: ' + student.category + '\n';
        details += 'Languages: ' + student.languages + '\n';
        
        alert(details);
    } catch (error) {
        alert('Error loading student details: ' + error.message);
    }
}

// Load students when page loads
window.addEventListener('load', loadStudents);
