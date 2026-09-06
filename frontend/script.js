const API_URL = "https://vin-production-21af.up.railway.app/api/students";

// ===============================
// ELEMENTS
// ===============================

const studentForm = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const submitBtn = document.getElementById("submitBtn");
const editIndex = document.getElementById("editIndex");

// ===============================
// FORM INPUTS
// ===============================

const regNo = document.getElementById("regNo");
const nameInput = document.getElementById("name");
const classInput = document.getElementById("class");
const genderInput = document.getElementById("gender");
const ageInput = document.getElementById("age");
const dobInput = document.getElementById("dob");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const guardianInput = document.getElementById("guardian");
const guardianPhoneInput = document.getElementById("guardianPhone");
const combinationInput = document.getElementById("combination");
const admissionDateInput = document.getElementById("admissionDate");
const notesInput = document.getElementById("notes");

let students = [];

// ===============================
// LOAD STUDENTS
// ===============================

async function loadStudents() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Server error: " + response.status
            );
        }

        students = await response.json();

        displayStudents();

    } catch (error) {

        console.error(
            "Failed to load students:",
            error
        );

        alert(
            "Cannot connect to the student database."
        );
    }
}

// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(list = students) {

    tableBody.innerHTML = "";

    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10"
                    style="text-align:center;">
                    No students registered.
                </td>
            </tr>
        `;

        updateStatistics([]);

        return;
    }

    list.forEach((student, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${student.regNo}</td>

            <td>${student.name}</td>

            <td>${student.className}</td>

            <td>${student.gender}</td>

            <td>${student.age}</td>

            <td>${student.address}</td>

            <td>${student.guardian}</td>

            <td>${student.phone || ""}</td>

            <td>

                <button
                    class="action-btn view-btn"
                    onclick="viewStudent(${student.id})">
                    👁 View
                </button>

                <button
                    class="action-btn edit-btn"
                    onclick="editStudent(${student.id})">
                    ✏ Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(${student.id})">
                    🗑 Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);
    });

    updateStatistics(list);
}

// ===============================
// REGISTER / UPDATE
// ===============================

studentForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const student = {

            regNo:
                regNo.value.trim(),

            name:
                nameInput.value.trim(),

            className:
                classInput.value,

            gender:
                genderInput.value,

            age:
                ageInput.value,

            dob:
                dobInput.value,

            address:
                addressInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            guardian:
                guardianInput.value.trim(),

            guardianPhone:
                guardianPhoneInput.value.trim(),

            combination:
                combinationInput.value.trim(),

            admissionDate:
                admissionDateInput.value,

            notes:
                notesInput.value.trim()
        };

        const editing =
            editIndex.value !== "";

        try {

            submitBtn.disabled = true;

            submitBtn.textContent =
                editing
                    ? "Updating..."
                    : "Registering...";

            const url = editing
                ? `${API_URL}/${editIndex.value}`
                : API_URL;

            const method = editing
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(student)
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.error ||
                    "Operation failed."
                );

                return;
            }

            alert(
                editing
                    ? "Student updated successfully!"
                    : "Student registered successfully!"
            );

            clearForm();

            await loadStudents();

            document
                .getElementById("students")
                .scrollIntoView({
                    behavior: "smooth"
                });

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        } finally {

            submitBtn.disabled = false;

            submitBtn.textContent =
                "➕ Register Student";
        }
    }
);

// ===============================
// VIEW
// ===============================

function viewStudent(id) {

    const student =
        students.find(
            item => item.id === id
        );

    if (!student) {

        alert("Student not found.");

        return;
    }

    alert(

        "STUDENT INFORMATION\n\n" +

        "Registration Number: " +
        student.regNo +

        "\nName: " +
        student.name +

        "\nClass: " +
        student.className +

        "\nGender: " +
        student.gender +

        "\nAge: " +
        student.age +

        "\nDate of Birth: " +
        (student.dob || "Not provided") +

        "\nAddress: " +
        student.address +

        "\nPhone: " +
        (student.phone || "Not provided") +

        "\nGuardian: " +
        student.guardian +

        "\nGuardian Phone: " +
        student.guardianPhone +

        "\nCombination: " +
        (student.combination || "Not provided") +

        "\nAdmission Date: " +
        (student.admissionDate || "Not provided") +

        "\nNotes: " +
        (student.notes || "None")
    );
}

// ===============================
// EDIT
// ===============================

function editStudent(id) {

    const student =
        students.find(
            item => item.id === id
        );

    if (!student) {

        alert("Student not found.");

        return;
    }

    regNo.value =
        student.regNo || "";

    nameInput.value =
        student.name || "";

    classInput.value =
        student.className || "";

    genderInput.value =
        student.gender || "";

    ageInput.value =
        student.age || "";

    dobInput.value =
        student.dob
            ? student.dob.substring(0, 10)
            : "";

    addressInput.value =
        student.address || "";

    phoneInput.value =
        student.phone || "";

    guardianInput.value =
        student.guardian || "";

    guardianPhoneInput.value =
        student.guardianPhone || "";

    combinationInput.value =
        student.combination || "";

    admissionDateInput.value =
        student.admissionDate
            ? student.admissionDate.substring(0, 10)
            : "";

    notesInput.value =
        student.notes || "";

    editIndex.value = id;

    submitBtn.textContent =
        "💾 Update Student";

    document
        .getElementById("registration")
        .scrollIntoView({
            behavior: "smooth"
        });
}

// ===============================
// DELETE
// ===============================

async function deleteStudent(id) {

    const student =
        students.find(
            item => item.id === id
        );

    if (!student) {

        alert("Student not found.");

        return;
    }

    const confirmDelete =
        confirm(
            `Are you sure you want to delete ${student.name}?`
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.error ||
                "Failed to delete student."
            );

            return;
        }

        alert(
            "Student deleted successfully."
        );

        await loadStudents();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}

// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    function() {

        const term =
            searchInput.value
                .toLowerCase()
                .trim();

        const filtered =
            students.filter(student =>

                student.name
                    .toLowerCase()
                    .includes(term)

                ||

                student.regNo
                    .toLowerCase()
                    .includes(term)

                ||

                student.className
                    .toLowerCase()
                    .includes(term)

                ||

                student.gender
                    .toLowerCase()
                    .includes(term)
            );

        displayStudents(filtered);
    }
);

// ===============================
// CLEAR FORM
// ===============================

clearBtn.addEventListener(
    "click",
    clearForm
);

function clearForm() {

    studentForm.reset();

    editIndex.value = "";

    submitBtn.disabled = false;

    submitBtn.textContent =
        "➕ Register Student";
}

// ===============================
// STATISTICS
// ===============================

function updateStatistics(list) {

    document.getElementById(
        "totalStudents"
    ).textContent = list.length;

    document.getElementById(
        "maleStudents"
    ).textContent =
        list.filter(
            student =>
                student.gender === "Male"
        ).length;

    document.getElementById(
        "femaleStudents"
    ).textContent =
        list.filter(
            student =>
                student.gender === "Female"
        ).length;
}

// ===============================
// START
// ===============================

loadStudents();
