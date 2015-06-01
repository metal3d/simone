# Simone - Simple Monitor Experience

Simone is a simple cross-platform tool that monitors some web endpoints and alerts when it's down. Simone is developped with [NWJS](http://nwjs.io/), a node/chromium bundle easing developpement in JS/HTML.

## About the name

"Simone" is my grand-mother firstname, and it's (in french) an old firstname that have a comic consonance. It's a acronyme for "SIMple MONitor Experience".

## How to use it

Get binary packate or install NWJS and get the "nw" file.

If you decided to use "simone.nw" file, you may:

- drag/drop nw file on the "nw" binary
- use "nw" binary from the command line giving the "simone.nw" file as argument

## Configuration

Prepare a json form configuration file:

```json
{
    "remotes" : [
        {
            "name" : "Name for the service",
            "host" : "hostname.tld",
            "ssl"  : false,
            "path" : "uri/path"
            "data" : {
                "json" : "form",
                "for" : "data"
            }
        }, {
            // other services...
        }
    ]
}
```


