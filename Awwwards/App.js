//Disable jquery ready/closure to allow variable inspection for debugging.
// $(function () {

    //turn on event debugging 
    Event.prototype.debug = true;

    var model = new TaskModel();
    
    //delay to demonstrate data load
    model.loadDelay = 1500; //ms
    
    var view = new TaskView(model);
    
    var controller = new TaskController(model, view);
 
     
 //});