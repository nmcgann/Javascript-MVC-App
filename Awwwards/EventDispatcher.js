var Event = function (debugInfo) {
    this._listeners = [];
    this._debugInfo = debugInfo || '';

};

Event.prototype = {
    debug: false,
    
    attach: function (listener) {
        this._listeners.push(listener);
    },

    notify: function (args) {
        if(this.debug) console.log('notify: ', this._debugInfo, ' args: ', args);
        for (var i = 0, len = this._listeners.length; i < len; i += 1) {
            this._listeners[i](args);
        }
    }

};