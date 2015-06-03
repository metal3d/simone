var fs = require("fs"),
    http = require("http"),
    https = require("https"),
    querystring = require('querystring'),
    path = require('path'),
    gui = require('nw.gui');

/**
 * Keep remotes list globally
 */
var REMOTES = [];


/**
 * Add a tray icon
 */
var tray = new gui.Tray({ title: 'Simone', icon: 'green.png' });
tray.on('click', function(){
    gui.Window.get().show();
});


/**
 * Hide the window
 */
function hide(){
    gui.Window.get().close();
}

gui.Window.get().on('close', function(){
    var r = confirm("Press Ok to really quit, Cancel to minimize (use systray icon to show the main window)");
    if (r) {
        this.close(true);
    } else {
        this.hide();
    }
});

/**
 * Remote class
 */
function Remote(){
    this.name = "";
    this.id = "";
    this.host = "";
    this.ssl = "";
    this.path = "/";
    this.headers = null;
    this.data = null;
    this.state = "up";
    this._notified = false;

    /**
     * Pop an alert
     */
    this.alert = function(){
        if (this._notified) return;

        playSound();
        this._notified = true;

        new Notification("Server error !", {
            id : this.id,
            body: "Remote " + this.name + " seems to be down !",
            sticky : true
        });
    };

    /**
     * Test the remote, do action following states
     */
    this.test = function(){

        var h = (this.ssl) ? https : http;
        
        var port = this.port;
        if (!port) {
            port = (this.ssl) ? 443 : 80;
        }

        var post_options = {
            hostname: this.host,
            port: port,
            path: this.path,
            method: this.method,
            headers: this.headers || {}
        };

        var onError = function(){
            this.alert(); 
            this.state = "down";
            this.refreshView();
        };

        var onSuccess = function(){
            this._notified = false; // reset notification
            this.state = "up";
            this.refreshView();
        };

        var self = this;
        var req = h.request(post_options, function(res){
            if (res.statusCode < 400) {
                onSuccess.bind(self)();
            } else {
                onError.bind(self)();
            }
        }).on('error', onError.bind(self)); 

        req.write(JSON.stringify(self.data));
        req.end();
    };

    /**
     * Refresh the view - create remote element if it doesn't exists yet
     */
    this.refreshView = function(){
        var s = document.getElementById("states");
        var r = document.getElementById(this.id);
        if (!r) {
            r = document.createElement("div");
            r.id = this.id;
            var icon = document.createElement("img");
            icon.id = "icon-"+this.id;
            icon.src = "green.png";
            r.appendChild(icon);

            var span = document.createElement("span");
            span.innerHTML = this.name;
            r.appendChild(span);
            s.appendChild(r);
        }

        if (this.state == "down") {
            document.getElementById("icon-"+this.id).src = "failed.png";
        } else {
            document.getElementById("icon-"+this.id).src = "green.png";
        }
    };

}


/**
 * Play buzz sound on error
 * It should be played only once.
 */
function playSound(){
    for (var i=0, len = REMOTES.length; i<len; i++){
        // do not play several alerts if more than one server is down
        if (REMOTES[i]._notified) return;
    }
    document.getElementById("alertsound").play();
}

/**
 * Initialize remotes
 * TODO: Find a way to dynamically set configuration file in other place. Maybe argument ? or a configuration window...
 */
function init(){
    var data = localStorage.remotes;
    if (!data) {
        alert("You've got no configuration, go to the config view to add remotes.");
        return;
    }
    var json;
    try {
        json = JSON.parse(data.replace("\n",""));
    } catch(e){
        console.log(e); 
        return;
    }
    for (var j=0, len = json.remotes.length; j<len; j++) {
        json.remotes[j].id = "remote-"+(j+1);
        var r = new Remote();
        r.name     = json.remotes[j].name;
        r.id       = json.remotes[j].id;
        r.headers  = json.remotes[j].headers || null;
        r.data     = json.remotes[j].data || null;
        r.port     = json.remotes[j].port || null;
        r.method   = json.remotes[j].method || "GET";
        r.interval = json.remotes[j].interval || 30000;
        // to ease configuration, we let user set an url
        // and we override ssl, host and path from this
        if (json.remotes[j].hasOwnProperty('url')) {
            var url = new URL(json.remotes[j].url);
            r.host = url.hostname;
            r.port = 80;
            if (url.port) {
                r.port = url.port;
            }
            r.ssl = false;
            if (url.protocol == "https") {
                r.ssl = true;
            }
            r.path = url.pathname+url.search;
        } else {
            r.host     = json.remotes[j].host;
            r.path     = json.remotes[j].path;
            r.ssl      = json.remotes[j].ssl;
        }
        REMOTES.push(r);
        r.refreshView();
        setInterval(r.test.bind(r), r.interval);
        r.test();
    }
    setInterval(function(){
        var failed = false;
        for (var k=0, l=REMOTES.length; k<l; k++){
            var r = REMOTES[k];
            if (r.state == "down") {
                failed = true;
            }
        }
        if (failed) {
            tray.icon = "failed.png";
        } else {
            tray.icon = "green.png";
        }
    },200);
}

