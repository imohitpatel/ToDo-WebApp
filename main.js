$(document).ready(function () {
    var tasks = [];
    var completedTasks = [];

    function updateTaskList() {
        var taskList = $('#task-list').empty();

        tasks.forEach(function (task, index) {
            var listItem = $('<li></li>').addClass('task-item');
            var taskText = $('<span class="task-text">' + task + '</span>');
            var deleteButton = $('<button class="delete-button">X</button>');

            listItem.append(taskText).append(deleteButton);

            if (completedTasks.includes(index)) {
                listItem.addClass('completed');
            }

            listItem.click(function () {
                toggleTaskCompletion(listItem, index);
            });

            deleteButton.click(function (e) {
                e.stopPropagation();
                removeTask(index);
            });

            taskList.append(listItem);
        });
    }

    function toggleTaskCompletion(listItem, index) {
        if (listItem.hasClass('completed')) {
            listItem.removeClass('completed');
            completedTasks = completedTasks.filter(taskIndex => taskIndex !== index);
        } else {
            listItem.addClass('completed');
            completedTasks.push(index);
        }
        saveTasksToCookies();
    }

    function removeTask(index) {
        tasks.splice(index, 1);
        
      // Update the indexes in completedTasks after removal 
        completedTasks = completedTasks.map(taskIndex => taskIndex > index ? taskIndex - 1 : taskIndex);
        
        saveTasksToCookies();
        updateTaskList();
    }

    function saveTasksToCookies() {
        var tasksData = JSON.stringify({ tasks: tasks, completedTasks: completedTasks });
        document.cookie = 'tasksData=' + tasksData;
    }

    function loadTasksFromCookies() {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith('tasksData=')) {
                var tasksData = cookie.substring('tasksData='.length);
                var parsedData = JSON.parse(tasksData);
                tasks = parsedData.tasks || [];
                completedTasks = parsedData.completedTasks || [];
                updateTaskList();
                break;
            }
        }
    }

    loadTasksFromCookies();

    $('#task-form').submit(function (e) {
        e.preventDefault();
        var taskName = $('#new-task').val();
        if (taskName) {
            tasks.push(taskName);
            saveTasksToCookies();
            updateTaskList();
            $('#new-task').val('');
        }
    });

    $('#save-tasks').click(function () {
        var tasksText = tasks.join('\n');
        var blob = new Blob([tasksText], { type: "text/plain" });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Todo-tasks.txt';
        a.click();
        URL.revokeObjectURL(a.href);
        showSuccessAlert();
    });

    function showSuccessAlert() {
    // Add the logic here to display a success alert (optional) 
    }
});
