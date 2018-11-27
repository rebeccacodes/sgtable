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
      var studentName = $('#studentName').val();
      var studentCourse = $('#course').val();
      var studentGrade = $('#studentGrade').val();
      var name = $.trim(studentName);
      console.log(name, ':name');
      var studentObj = {
            name: name,
            course_name: studentCourse,
            grade: studentGrade

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
      var editIcon = $('<i class="fa fa-pencil center">');
      var deleteIcon = $('<i class="fa fa-trash center">');
      var deleteButton = $('<button>').addClass('btn btn-danger delete-row');
      var editButton = $('<button>').addClass('btn btn-warning edit-btn');

      editButton.append(editIcon);
      deleteButton.append(deleteIcon);
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
      $('#update').click(() => validateUpdate(id));

}

function editSuccess(response) {
      makeAjaxCallRead();
      removeFormatting();
      $('#editModal').modal('hide');
}

function removeFormatting() {
      $('#editName').removeClass('invalid');
      $('#editCourse').removeClass('invalid');
      $('#editGrade').removeClass('invalid');
      $('#editName').removeClass('valid');
      $('#editCourse').removeClass('valid');
      $('#editGrade').removeClass('valid');
      $('.edit-name-error').empty();
      $('.edit-course-error').empty();
      $('.edit-grade-error').empty();

}

function makeAjaxCallDelete(studentObj, id) {
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
      validateName = validateName.trim();
      var validateCourse = document.forms["addForm"]["course"].value;
      validateCourse = validateCourse.trim();
      var validateGrade = document.forms["addForm"]["studentGrade"].value;

      if (regCheckLetters.test(validateName)) {
            $('#studentName').removeClass('invalid');
            $('.name-error').empty();
            $('#studentName').addClass('valid');
            if (regCheckLetterNumber.test(validateCourse)) {
                  $('#course').removeClass('invalid');
                  $('.course-error').empty();
                  $('#course').addClass('valid');
                  if (regCheckGrade.test(validateGrade)) {
                        $('#studentGrade').removeClass('invalid');
                        $('.grade-error').empty();
                        $('#studentGrade').addClass('valid');
                        addStudent();
                        makeAjaxCallRead();
                  } else if (validateGrade === "") {
                        $('.grade-error').empty();
                        $('#studentGrade').addClass('invalid');
                        $('.grade-error').append('Grade cannot be left blank');
                        return;

                  } else {
                        $('.grade-error').empty();
                        $('#studentGrade').addClass('invalid');
                        $('.grade-error').append('Grade must be an integer between 0 - 100');
                        return;

                  }
            } else if (validateCourse === "" || validateCourse.trim() === "") {
                  $('.course-error').empty();
                  $('#course').addClass('invalid');
                  $('.course-error').append('Course name required');
                  return;
            } else {
                  $('.course-error').empty();
                  $('#course').addClass('invalid');
                  $('.course-error').append('Course Name cannot include any special characters');
                  return;
            }

      } else if (validateName.trim() == null || validateName === " " || validateName.trim() === "") {
            $('.name-error').empty();
            $('#studentName').addClass('invalid');
            $('.name-error').append('Student Name is required');
            return;
      } else {
            $('.name-error').empty();
            $('#studentName').addClass('invalid');
            $('.name-error').append('Student Name cannot contain numbers or special characters');
            return;
      }


}

function validateUpdate(id) {
      var regCheckLetters = /^[a-zA-Z\s]+$/g;
      var regCheckLetterNumber = /^[a-zA-Z0-9\s]+$/g;
      var regCheckGrade = /^([0-9]|[1-9][0-9]|100)$/g;

      var validateName = document.forms["editForm"]["studentName"].value;
      validateName = validateName.trim();
      var validateCourse = document.forms["editForm"]["course"].value;
      validateCourse = validateCourse.trim();
      var validateGrade = document.forms["editForm"]["studentGrade"].value;

      if (regCheckLetters.test(validateName)) {
            $('#editName').removeClass('invalid');
            $('.edit-name-error').empty();
            $('#editName').addClass('valid');
            if (regCheckLetterNumber.test(validateCourse)) {
                  $('#editCourse').removeClass('invalid');
                  $('.edit-course-error').empty();
                  $('#editCourse').addClass('valid');
                  if (regCheckGrade.test(validateGrade)) {
                        $('#editGrade').removeClass('invalid');
                        $('#editCourse').removeClass('invalid');
                        $('#editName').removeClass('invalid');
                        $('.edit-grade-error').empty();
                        $('#editGrade').addClass('valid');

                        updateRecord(id);
                  } else if (validateGrade === "") {
                        $('.edit-grade-error').empty();
                        $('#editGrade').addClass('invalid');
                        $('.edit-grade-error').append('Grade cannot be left blank');
                        return;

                  } else {
                        $('.edit-grade-error').empty();
                        $('#editGrade').addClass('invalid');
                        $('.edit-grade-error').append('Grade must be an integer between 0 - 100');
                        return;

                  }
            } else if (validateCourse === "" || validateCourse.trim() === "") {
                  $('.edit-course-error').empty();
                  $('#editCourse').addClass('invalid');
                  $('.edit-course-error').append('Course name required');
                  return;
            } else {
                  $('.edit-course-error').empty();
                  $('#editCourse').addClass('invalid');
                  $('.edit-course-error').append('Course Name cannot include any special characters');
                  return;
            }

      } else if (validateName.trim() == null || validateName === " " || validateName.trim() === "") {
            $('.edit-name-error').empty();
            $('#editName').addClass('invalid');
            $('.edit-name-error').append('Student Name is required');
            return;
      } else {
            $('.edit-name-error').empty();
            $('#editName').addClass('invalid');
            $('.edit-name-error').append('Student Name cannot contain numbers or special characters');
            return;
      }


}

