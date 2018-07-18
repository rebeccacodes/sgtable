/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */

var student_array = [];

/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
student_array = [

];

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp() {
      addClickHandlersToElements();
      updateStudentList(student_array);

}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements() {
      $('#add').click(handleAddClicked);
      $('#cancel').click(handleCancelClick);
      $('#getData').click(makeAjaxCall);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */

/////*****unsure of what to pass in as parameter */
function handleAddClicked(event) {
      addStudent();
      updateStudentList(student_array);
}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick() {
      clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent() {
      var studentObj = {
            name: $('#studentName').val(),
            course: $('#course').val(),
            grade: $('#studentGrade').val()
      };
      clearAddStudentFormInputs();
      student_array.push(studentObj);
      updateStudentList(student_array);

}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
      $('#studentName').val('');
      $('#course').val('');
      $('#studentGrade').val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj, student) {
      var createTableRow = $('<tr>');
      var createTableElement = $('<td>');
      var studentName = $('<td>').text(studentObj.name);
      var studentCourse = $('<td>').text(studentObj.course);
      var studentGrade = $('<td>').text(studentObj.grade);
      var deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
      var buttonContainer = createTableElement.append(deleteButton);
      createTableRow.append(studentName, studentCourse, studentGrade);
      createTableRow.append(buttonContainer);

      $(buttonContainer).click(function () {
            deleteStudent(student);
      });


      $('tbody').append(createTableRow);
}



/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
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
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(student_array) {
      var total = 0;
      for (var i = 0; i < student_array.length; i++) {
            var parsedInt = parseInt(student_array[i].grade);
            total = total + parsedInt;
            var number = Math.round(total / student_array.length);
      }

      return number;
}

/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(number) {

      if (student_array.length === 0) {
            $('.avgGrade').text('0');
      } else {
            calculateGradeAverage(student_array);
            $('.avgGrade').text(number);
      }
}


function deleteStudent(i) {
      student_array.splice(i, 1);
      updateStudentList(student_array);
}


function makeAjaxCall() {
      var ajaxOptions = {
            dataType: 'json',
            url: "http://s-apis.learningfuze.com/sgt/get",
            method: 'post',
            success: getData,
            data: { api_key: "3cFqeNuDaq" }
      }

      $.ajax(ajaxOptions);
}

function getData(response) {
      console.log(response);

      for (i = 0; i < response.data.length; i++) {
            student_array.push(response.data[i]);
            updateStudentList(student_array);
      }
}

