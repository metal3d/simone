var fs = require("fs"),
    http = require("http"),
    https = require("https"),
    querystring = require('querystring'),
    path = require('path'),
    gui = require('nw.gui');

var REMOTES = [];
var tray = new gui.Tray({ title: 'Simone', icon: 'green.png' });
tray.on('click', function(){
    gui.Window.get().show();
});

gui.Window.get().on('close', function(){
    var r = confirm("Press Ok to really quit, Cancel to minimize (use systray icon to show the main window)");
    if (r) {
        this.close(true);
    } else {
        this.hide();
    }
});

function hide(){
    gui.Window.get().close();
}


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

    this.alert = function(){
        if (this._notified) return;

        this._notified = true;
        playSound();

        new Notification("Server error !", {
            id : this.id,
            body: "Remote " + this.name + "seems to be down !",
            sticky : true
        });
    };

    this.test = function(){
        var self = this;

        var h = (self.ssl) ? https : http;
        var post_options = {
            hostname: self.host,
            port: (self.ssl) ? 443 : 80,
            path: self.path,
            method: 'POST',
            headers: self.headers || {}
        };

        post_options.headers['Accept'] = "application/json";
        post_options.headers['Content-Type'] = "application/json";


        var onError = function(){
            tray.icon = "failed.png";
            self.alert(); 
            self.state = "down";
            self.refreshView();
        };

        var onSuccess = function(){
            self._notified = false; // reset notification
            tray.icon = "green.png";
            self.state = "up";
            self.refreshView();
        };

        var req = h.request(post_options, function(res){
            if (res.statusCode < 300) {
                onSuccess();
            } else {
                onError();
            }
        }).on('error', onError); 

        req.write(JSON.stringify(self.data));
        req.end();
    };

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



function playSound(){
    for (var i=0, len = REMOTES.length; i<len; i++){
        // do not play several alerts if more than one server is down
        if (REMOTES[i]._notified) return;
    }
    document.getElementById("alertsound").play();
}

function init(){
    fs.readFile(process.execPath.substr(0,process.execPath.lastIndexOf(path.sep)) + path.sep + 'conf.json', 'utf8', function (err, data) {
            if (err){
                throw err; 
            }
            var json = JSON.parse(data);
            for (var j=0, len = json.remotes.length; j<len; j++) {
                json.remotes[j].id = "remote-"+(j+1);
                var r = new Remote();
                r.name     = json.remotes[j].name;
                r.id       = json.remotes[j].id;
                r.interval = json.remotes[j].interval || 10000;
                r.host     = json.remotes[j].host;
                r.path     = json.remotes[j].path;
                r.ssl      = json.remotes[j].ssl;
                r.headers  = json.remotes[j].headers || null;
                r.data     = json.remotes[j].data || null;

                REMOTES.push(r);
                r.refreshView();
                setInterval(r.test.bind(r), r.interval);
                r.test();
            }
    });
}

