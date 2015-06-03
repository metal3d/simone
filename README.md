# Simone - Simple Monitor Experience

Simone is a simple cross-platform tool that monitors some web endpoints and alerts when it's down. Simone is developped with [NWJS](http://nwjs.io/), a node/chromium bundle easing developpement in JS/HTML.

## About the name

"Simone" is my grand-mother firstname, and it's (in french) an old firstname that have a comic consonance. It's a acronyme for "SIMple MONitor Experience".
The last "E" signification was found by [Jonathan Dray](http://www.spicymoka.org/)


## How to use it

Get binary packate or install NWJS and get the "nw" file.

If you decided to use "simone.nw" file, you may:

- drag/drop nw file on the "nw" binary
- use "nw" binary from the command line giving the "simone.nw" file as argument

## Configuration

Go to the config view then write json configuration:


```json
{
    "remotes" : [
        {
            "name" : "Name for the service",
            "interval" : 15000, 
            "host" : "hostname.tld",
            "ssl"  : false,
            "path" : "uri/path"
            "data" : {
                "json" : "form",
                "for" : "data"
            }
        }, {
            "name" : "other services..."
        }
    ]
}
```

Each remote can have those properties:

- name: name of the service (title on the main view)
- host: hostname to hit
- port: port to connect (default 80 is ssl is false, either 443)
- path: path to the resource
- headers: object that handles headers to set
- data: json data to send
- ssl: activate SSL connection (default false)
- inteval: in milisecond, the interval between 2 tests (default 30000 for 30s)
- method: GET, POST, PUT, and so on... (default: GET)

To ease configuration, you can omit host, port, ssl, and path by using "url" property.

For example, setting "url" to "https://test.com:8585/path" will set 

- ssl:true
- port:8585
- path: /path
- host: test.com






