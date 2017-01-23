 var TaskModel = function () {
    this.tasks = [];
    this.selectedTasks = [];
    this.addTaskEvent = new Event('TaskModel: addTaskEvent');
    this.setTasksAsCompletedEvent = new Event('TaskModel: setTasksAsCompletedEvent');
    this.deleteTasksEvent = new Event('TaskModel: deleteTasksEvent');
    //new
    this.setTasksAsSelectedAllEvent = new Event('TaskModel: setTasksAsSelectedAllEvent');
    this.loadedTasksEvent = new Event('TaskModel: loadedTasksEvent');

    this.init();

 };

 TaskModel.prototype = {

    loadDelay: 0,

    init: function(){
        //...
    },

    addTask: function (task) {

        if(task === ''){
            this.addTaskEvent.notify({msg: 'Task cannot be empty'});
            return;
        }

        this.tasks.push({
            taskName: task,
            taskStatus: 'uncompleted'
        });
        
        this._saveTasks();
        
        this.addTaskEvent.notify();
    },

    getTasks: function () {
        return this.tasks;
    },

    setSelectedTask: function (taskIndex) {
        this.selectedTasks.push(taskIndex);
    },

    unselectTask: function (taskIndex) {
         var arrayIndex = this.selectedTasks.indexOf(taskIndex);
         if(arrayIndex !== -1){
             this.selectedTasks.splice(arrayIndex, 1);
         }
    },

    setTasksAsCompleted: function () {
        var selectedTasks = this.selectedTasks, status;
        for (var index in selectedTasks) {
            status = this.tasks[selectedTasks[index]].taskStatus;
            //toggle
            status = (status === 'uncompleted') ? 'completed' : 'uncompleted';
            this.tasks[selectedTasks[index]].taskStatus = status;
        }

        this.setTasksAsCompletedEvent.notify();

        this.selectedTasks = [];
        
        this._saveTasks();
    },


    deleteTasks: function () {
        var selectedTasks = this.selectedTasks.sort();

        for (var i = selectedTasks.length - 1; i >= 0; i--) {
            this.tasks.splice(this.selectedTasks[i], 1);
        }

        // clear the selected tasks
        this.selectedTasks = [];

        this.deleteTasksEvent.notify();

        this._saveTasks();
        
    },

    setOrUnsetAllSelectedTask: function(setAll){
        var self = this;
        this.selectedTasks = [];
       
        if(setAll){
            this.tasks.forEach(function(task, index){
               self.selectedTasks.push(index);
            });
        }

        this.setTasksAsSelectedAllEvent.notify({select: setAll});   
    },

    _saveTasks: function(){
        var encodedTasks = JSON.stringify(this.tasks);
        
        if(window.localStorage){
            localStorage.setItem('taskList', encodedTasks);
        }
    },
    
    loadTasks: function(){
        var encodedTasks, 
            decodedTasks, 
            self = this;
        
        if(window.localStorage){
            encodedTasks = localStorage.getItem('taskList');
            try{
                decodedTasks = JSON.parse(encodedTasks);
            }catch(e){
                decodedTasks = null;
            }
           
            if(decodedTasks){ 
                this.tasks = decodedTasks;
            }
            //console.log(encodedTasks, decodedTasks);
        }
      
        setTimeout(function(){
            
            self.loadedTasksEvent.notify();
            
        },this.loadDelay);
        
    }
     
 };