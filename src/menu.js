var gui = require('nw.gui');

/**
 * Menu
 */
(function(){
    try {
        var menu = new gui.Menu({type:"menubar"});
        var filemenu = new gui.MenuItem({
            label: "File"
        });

        var quititem = new gui.MenuItem({
            label: "Quit",
            click : function(){
                gui.Window.get().close();
            }
        });

        var configitem = new gui.MenuItem({
            label : "Configuration",
            click: function(){
                window.location.href = "config.html";
            }
        });

        var mainitem = new gui.MenuItem({
            label : "States",
            click: function(){
                window.location.href = "index.html";
            }
        });


        var sm = new gui.Menu();
        sm.append(mainitem);
        sm.append(configitem);
        sm.append(quititem);

        filemenu.submenu = sm;
        menu.append(filemenu);

        gui.Window.get().menu = menu;
    } catch (e) {
        console.log(e);
    }
})();
