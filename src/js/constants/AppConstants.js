var AppConstants = {
    YEAR: "2017",
    SITENAME: "MindGraph",
    TOOLS: [
        { id: "select", name: "Select", icon: "touch_app", shortcut: ["v", "escape"] },         
        { id: "search", name: "Search", icon: "search", shortcut: ["f"] },
        { id: "node", name: "Add Node", icon: "add_circle", shortcut: ["n"] },  	
        { id: "edge", name: "Add Edge", icon: "trending_flat", shortcut: ["e"] },  	  	
        { id: "layout_config", name: "Layout Options", icon: "remove_red_eye", shortcut: ["l"] },  	  	  	
        { id: "refresh", name: "Refresh Layout", icon: "refresh", shortcut: ["s"], action: true }, 	
        { id: "show_json", name: "Show JSON", icon: "code", shortcut: ["j"], action: true }
    ]
};

module.exports = AppConstants;