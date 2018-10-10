$(document).ready(initializeApp);

var student_array = [];

function initializeApp() {
      addClickHandlersToElements();
      makeAjaxCallRead();
      updateStudentList(student_array);
      $('i').hide();

}

function addClickHandlersToElements() {
      $('#add').click(handleAddClicked);
      $('#cancel').click(handleCancelClick);
      $('#getData').click(makeAjaxCallRead);

}

function handleAddClicked(event) {
      validateForm();

}

function handleCancelClick() {
      clearAddStudentFormInputs();
}

function addStudent() {
      var studentObj = {
            name: $('#studentName').val(),
            course_name: $('#course').val(),
            grade: $('#studentGrade').val(),

      };
      clearAddStudentFormInputs();
      makeAjaxCallCreate(studentObj);
      updateStudentList(student_array);

}

function clearAddStudentFormInputs() {
      $('#studentName').val('');
      $('#course').val('');
      $('#studentGrade').val('');
      $('#studentName').removeClass('valid invalid');
      $('#course').removeClass('valid invalid');
      $('#studentGrade').removeClass('valid invalid');

      $('.name-error').html('');
      $('.course-error').html('');
      $('.grade-error').html('');

}

function renderStudentOnDom(studentObj, student) {
      var createTableRow = $('<tr>');
      var createTableElement = $('<td>');
      var studentName = $('<td>').text(studentObj.name);
      var studentCourse = $('<td>').text(studentObj.course_name);
      var studentGrade = $('<td>').text(studentObj.grade);
      var deleteButton = $('<button>').addClass('btn btn-danger delete-row').text('Delete');
      var editButton = $('<button>').addClass('btn btn-warning edit-btn').text('Edit');
      var buttonContainer = createTableElement.append(editButton, deleteButton);
      createTableRow.append(studentName, studentCourse, studentGrade);
      createTableRow.append(buttonContainer);

      $(deleteButton).click(function () {
            deleteModal(studentObj, studentObj.id);
      });

      $(editButton).click(function () {
            makeAjaxCallUpdate(studentObj, studentObj.id);
      });

      $('tbody').append(createTableRow);
}

function updateStudentList(student_array) {
      $('tbody').empty();
      for (var i = 0; i < student_array.length; i++) {
            var student = student_array[i];
            renderStudentOnDom(student, i);
            renderGradeAverage(calculateGradeAverage(student_array));
      }

      if (student_array.length === 0) {
            renderGradeAverage(calculateGradeAverage(student_array));
      }
}

function calculateGradeAverage(student_array) {
      var total = 0;
      for (var i = 0; i < student_array.length; i++) {
            var parsedInt = parseInt(student_array[i].grade);
            total = total + parsedInt;
            var number = Math.round(total / student_array.length);
      }

      return number;
}

function renderGradeAverage(number) {
      if (student_array.length === 0) {
            $('.avgGrade').text('0');
      } else {
            calculateGradeAverage(student_array);
            $('.avgGrade').text(number);
      }
}

function makeAjaxCallRead() {
      var ajaxOptions = {
            dataType: 'json',
            url: "php/access.php",
            method: 'POST',
            success: readSuccess,
            error: errorMessage,
            data: {
                  action: 'read'
            }
      }
      $.ajax(ajaxOptions);
}

function readSuccess(response) {
      student_array = response.data;
      updateStudentList(student_array);
}

function makeAjaxCallCreate(studentObj) {
      var ajaxOptions = {
            dataType: 'json',
            url: "php/access.php",
            method: 'POST',
            success: createSuccess,
            error: errorMessage,
            data: {
                  name: studentObj.name,
                  course_name: studentObj.course_name,
                  grade: studentObj.grade,
                  action: 'create'
            }
      }
      $.ajax(ajaxOptions);
}

function createSuccess() {
      makeAjaxCallRead();
}

function makeAjaxCallUpdate(studentObj, id) {
      var ajaxOptions = {
            dataType: 'json',
            url: "php/access.php",
            method: 'POST',
            success: editDataSuccess,
            error: errorMessage,
            data: {
                  student_id: id,
                  action: 'edit_data'
            }
      }
      $.ajax(ajaxOptions);
}

function updateRecord(id) {
      var editObj = {
            name: $('#editName').val(),
            course_name: $('#editCourse').val(),
            grade: $('#editGrade').val()
      };

      var ajaxOptions = {
            dataType: 'json',
            url: "php/access.php",
            method: 'POST',
            success: editSuccess,
            error: errorMessage,
            data: {
                  id: id,
                  name: editObj.name,
                  course_name: editObj.course_name,
                  grade: editObj.grade,
                  action: 'update'
            }
      }
      $.ajax(ajaxOptions);
}

function editDataSuccess(response) {
      $('#editModal').modal('show');
      $('#editName').val(response.data[0].name);
      $('#editCourse').val(response.data[0].course_name);
      $('#editGrade').val(response.data[0].grade);
      var id = response.data[0].id;
      $('#update').off();
      $('#update').click(() => updateRecord(id));

}

function editSuccess(response) {
      makeAjaxCallRead();
}

function makeAjaxCallDelete(studentObj, id) {
      console.log('object: ', studentObj);
      var ajaxOptions = {
            dataType: 'json',
            url: "php/access.php",
            method: 'post',
            data: {
                  student_id: id,
                  action: 'delete'
            },
            success: deleteSuccess,
            error: errorMessage,
      }
      $.ajax(ajaxOptions);
}

function deleteModal(studentObj, id) {
      $('#deleteModal').modal('show');
      $('#deleteName').text(studentObj.name);
      $('#deleteCourse').text(studentObj.course_name);
      $('#deleteGrade').text(studentObj.grade);
      $('#delete').off();
      $('#delete').click(() => makeAjaxCallDelete(studentObj, id));
}

function deleteSuccess(studentObj, id) {
      var index = student_array.indexOf(studentObj);
      student_array.splice(index, 1);
      $('tbody').empty();
      makeAjaxCallRead();
}



function errorMessage() {
      console.log('error');
      $('#errorModal').modal('show');
}

function validateForm() {
      var regCheckLetters = /^[a-zA-Z\s]+$/g;
      var regCheckLetterNumber = /^[a-zA-Z0-9\s]+$/g;
      var regCheckGrade = /^([0-9]|[1-9][0-9]|100)$/g;

      var validateName = document.forms["addForm"]["studentName"].value;
      var validateCourse = document.forms["addForm"]["course"].value;
      var validateGrade = document.forms["addForm"]["studentGrade"].value;

      if (regCheckLetters.test(validateName)) {
            $('#studentName').addClass('valid');
            if (regCheckLetterNumber.test(validateCourse)) {
                  $('#course').addClass('valid');
                  if (regCheckGrade.test(validateGrade)) {
                        $('#studentGrade').addClass('valid');
                        addStudent();
                        makeAjaxCallRead();
                  } else if (validateGrade === "") {
                        $('#studentGrade').addClass('invalid');
                        $('.grade-error').append('Grade cannot be left blank');

                  } else {
                        $('#studentGrade').addClass('invalid');
                        $('.grade-error').append('Grade must be a numeric value between 0 - 100');

                  }
            } else if (validateCourse === "") {
                  $('#course').addClass('invalid');
                  $('.course-error').append('Course name required');
            } else {
                  $('#course').addClass('invalid');
                  $('.course-error').append('Course Name cannot include any special characters');
            }

      } else if (validateName === "") {
            $('#studentName').addClass('invalid');
            $('.name-error').append('Student Name is required');
      } else {
            $('#studentName').addClass('invalid');
            $('.name-error').append('Student Name cannot contain numbers or special characters');
      }


}