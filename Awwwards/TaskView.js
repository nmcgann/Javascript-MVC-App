var TaskView = function (model) {
    this.model = model;
    this.addTaskEvent = new Event('TaskView: addTaskEvent');
    this.selectTaskEvent = new Event('TaskView: selectTaskEvent');
    this.unselectTaskEvent = new Event('TaskView: unselectTaskEvent');
    this.completeTaskEvent = new Event('TaskView: completeTaskEvent');
    this.deleteTaskEvent = new Event('TaskView: deleteTaskEvent');
    //added
    this.selectOrUnselectAllTaskEvent = new Event('TaskView: selectOrUnselectAllTaskEvent');
    
    this.init();
};

TaskView.prototype = {

    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
        //show tasks loading
        this.$tasksContainer.html('Loading...');
        this._disableControls();
    },

    createChildren: function () {
        // cache the document object
        this.$container = $('.js-container');
        this.$addTaskButton = this.$container.find('.js-add-task-button');
        this.$taskTextBox = this.$container.find('.js-task-textbox');
        this.$tasksContainer = this.$container.find('.js-tasks-container');
        this.$tasksErrorContainer = this.$container.find('.js-error-container');
        this.$selectAllTasksCheck = this.$container.find('.js-select-all-tasks');
        
        //init checkbox state
        this.$selectAllTasksCheck.prop('checked', false);
        
        return this;
    },

    setupHandlers: function () {
        //These were not strictly necessary - can just skip the extra abstraction
        //and bind directly

        this.addTaskButtonHandler = this.addTaskButton.bind(this);
        this.selectOrUnselectTaskHandler = this.selectOrUnselectTask.bind(this);
        this.completeTaskButtonHandler = this.completeTaskButton.bind(this);
        this.deleteTaskButtonHandler = this.deleteTaskButton.bind(this);
        this.selectOrUnselectAllTaskHandler = this.selectOrUnselectAllTask.bind(this)
        /**
        Handlers from Event Dispatcher
        */
        //this.addTaskHandler = this.addTask.bind(this);
        //this.clearTaskTextBoxHandler = this.clearTaskTextBox.bind(this);
        //this.setTasksAsCompletedHandler = this.setTasksAsCompleted.bind(this);
        //this.deleteTasksHandler = this.deleteTasks.bind(this);

        return this;
    },

    enable: function () {
        /*
         * Control bindings
         */
        this.$addTaskButton.on('click', this.addTaskButtonHandler);
        this.$container.on('click', '.js-task', this.selectOrUnselectTaskHandler);
        this.$container.on('click', '.js-complete-task-button', this.completeTaskButtonHandler);
        this.$container.on('click', '.js-delete-task-button', this.deleteTaskButtonHandler);
        
        //added
        this.$container.on('change', '.js-select-all-tasks', this.selectOrUnselectAllTaskHandler);

        /**
         * Event Dispatcher
         */
        this.model.addTaskEvent.attach(this.addTask.bind(this));
        this.model.addTaskEvent.attach(this.clearTaskTextBox.bind(this));
        //NM added
        this.model.addTaskEvent.attach(this.focusTaskTextBox.bind(this));
        this.model.setTasksAsCompletedEvent.attach(this.setTasksAsCompleted.bind(this));
        this.model.deleteTasksEvent.attach(this.deleteTasks.bind(this));
        //new
        this.model.setTasksAsSelectedAllEvent.attach(this.setSelectedAll.bind(this));
        this.model.loadedTasksEvent.attach(this.displayTasks.bind(this));
        
        return this;
    },

    addTaskButton: function () {
        this.$tasksErrorContainer.html('');
        this.$selectAllTasksCheck.prop('checked', false);
        
        this.addTaskEvent.notify({
            task: this.$taskTextBox.val()
        });
        
    },

    completeTaskButton: function () {
        this.$tasksErrorContainer.html('');
        this.$selectAllTasksCheck.prop('checked', false);
        
        this.completeTaskEvent.notify();
        
    },

    deleteTaskButton: function () {
        this.$tasksErrorContainer.html('');
        this.$selectAllTasksCheck.prop('checked', false);
        
        this.deleteTaskEvent.notify();
        
    },

    selectOrUnselectTask: function (event) {
        this.$tasksErrorContainer.html('');
        this.$selectAllTasksCheck.prop('checked', false);

        var $target = $(event.target),
            taskIndex = parseInt($target.attr("data-index"), 10);

        if ($target.attr('data-task-selected') === 'false') {
            $target.attr('data-task-selected', true);
            this.selectTaskEvent.notify({
                taskIndex: taskIndex
            });
        } else {
            $target.attr('data-task-selected', false);
            this.unselectTaskEvent.notify({
                taskIndex: taskIndex
            });
        }

    },

    selectOrUnselectAllTask: function (event) {

        this.selectOrUnselectAllTaskEvent.notify({
            select: event.target.checked
        });

    },
    
    _show: function (checkAll) {
        this._buildList(checkAll);
    },

    _buildList: function (checkAll) {
        var tasks = this.model.getTasks(),
            html = "",
            htmlArr = [],
            $tasksContainer = this.$tasksContainer,
            isCheckAll = (checkAll === undefined) ? false : checkAll;

        $tasksContainer.html('');

        var index = 0;
        for (var task in tasks) {

            if (tasks[task].taskStatus === 'completed') {
                html = "<div style='color:green; font-weight:bold; text-decoration:line-through'>";
            } else {
                html = "<div>";
            }
            
            html += '<label><input type="checkbox" class="js-task" data-index="' + index + '" ';
            html += 'data-task-selected="' + (isCheckAll ? 'true':'false') + '" ';
            html += (isCheckAll ? 'checked="checked"' : '') +  ">";
            html += tasks[task].taskName + "</label></div>";
            
            htmlArr.push(html);

            index++;
        }
        
        $tasksContainer.append(htmlArr.join(''));

    },

    _disableControls: function(){
        this.$addTaskButton.prop('disabled', true);
        this.$taskTextBox.prop('disabled', true);
        this.$selectAllTasksCheck.prop('disabled', true);
        this.$container.find('.js-complete-task-button').prop('disabled', true);
        this.$container.find('.js-delete-task-button').prop('disabled', true);
        this.$container.find('.js-select-all-tasks').prop('disabled', true);
        
    },
    
    _enableControls: function(){
        this.$addTaskButton.prop('disabled', false);
        this.$taskTextBox.prop('disabled', false);
        this.$selectAllTasksCheck.prop('disabled', false);
        this.$container.find('.js-complete-task-button').prop('disabled', false);
        this.$container.find('.js-delete-task-button').prop('disabled', false);
        this.$container.find('.js-select-all-tasks').prop('disabled', false);
        
    },

    /* -------------------- Handlers From Event Dispatcher ----------------- */

    clearTaskTextBox: function () {
        this.$taskTextBox.val('');
    },

    addTask: function (msg) {
        if(msg){
            //error
            //console.log(msg);
            this.$tasksErrorContainer.html(msg.msg);
        }

        this._show();
    },

    setTasksAsCompleted: function () {
        this._show();

    },

    deleteTasks: function () {
        this._show();

    },
    
    //NM added
    focusTaskTextBox: function () {
        this.$taskTextBox.focus();
    },

    //New
    setSelectedAll: function (args) {

        this._show(args.select);

    },

    displayTasks: function () {
        
        this._enableControls();

        this._show();

    }

    /* -------------------- End Handlers From Event Dispatcher ----------------- */


};