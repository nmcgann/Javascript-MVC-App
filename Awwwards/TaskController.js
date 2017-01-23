var TaskController = function (model, view) {
    this.model = model;
    this.view = view;

    this.init();
};

TaskController.prototype = {

    init: function () {
        this.createChildren()
            .setupHandlers()
            .enable();
    
        //initial load
        this.model.loadTasks();
    },

    createChildren: function () {
        // no need to create children inside the controller
        // this is a job for the view
        // you could all as well leave this function out
        return this;
    },

    setupHandlers: function () {
        //These were not strictly necessary - can just skip the extra abstraction
        //and bind directly

        //this.addTaskHandler = this.addTask.bind(this);
        //this.selectTaskHandler = this.selectTask.bind(this);
        //this.unselectTaskHandler = this.unselectTask.bind(this);
        //this.completeTaskHandler = this.completeTask.bind(this);
        //this.deleteTaskHandler = this.deleteTask.bind(this);
        return this;
    },

    enable: function () {

        this.view.addTaskEvent.attach(this.addTask.bind(this));
        this.view.completeTaskEvent.attach(this.completeTask.bind(this));
        this.view.deleteTaskEvent.attach(this.deleteTask.bind(this));
        this.view.selectTaskEvent.attach(this.selectTask.bind(this));
        this.view.unselectTaskEvent.attach(this.unselectTask.bind(this));
        
        //new
        this.view.selectOrUnselectAllTaskEvent.attach(this.selectOrUnselectAllTask.bind(this));

        return this;
    },

    addTask: function (args) {
        this.model.addTask(args.task);
    },

    selectTask: function (args) {
        this.model.setSelectedTask(args.taskIndex);
    },

    unselectTask: function (args) {
        this.model.unselectTask(args.taskIndex);
    },

    completeTask: function () {
        this.model.setTasksAsCompleted();
    },

    deleteTask: function () {
        this.model.deleteTasks();
    },

    //new
    selectOrUnselectAllTask: function (args) {
        this.model.setOrUnsetAllSelectedTask(args.select);
    }

};