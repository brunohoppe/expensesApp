(function() {
    
        var opts = {};
    
        var setUrl = function(dbUsername, dbPassword, dbHost, dbPort, appName) {
    
            var host = dbHost || "ds129434.mlab.com",
                port = dbPort || "29434",
                appDb = appName || "agpbase";
    
            var usernameAndPassword = "";
    
            if (dbUsername && dbPassword) {
                usernameAndPassword = dbUsername + ":" + dbPassword + "@";
            }
    
            opts = {
                "url": "mongodb://" + usernameAndPassword + host + ":" + port + "/" + appDb,
                "settings": {
                    "db": {
                        "native_parser": true,
    
                    },
                    "server": {
                        "poolsize": 5
                    }
                }
    
            };
    
        };
    
        var config = function(dbUsername, dbPassword, dbHost, dbPort, appName) {
            setUrl(dbUsername, dbPassword, dbHost, dbPort, appName);
            return opts;
        };
    
        module.exports = {
            config: config
        };
    
    
    
    })();