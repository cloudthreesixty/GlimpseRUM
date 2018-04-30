# GlimpseRUM
Real User Monitoring (RUM) Library

This is a RUM library specifically for my needs, it was developed with the intention of testing a global network and measuring performance to a number of sites both internal and also cloud services. The locations where the cloud services can be deployed are very important to end user performance, as you can't break the speed of light.

## Installation
Installation is pretty straight-forward, you download the 2 files and put them onto your webserver/CDN:
 - rum.js
 - pixel.png

It is important to note, that the 2 files need to be served with your content for the best performance and most accurate results, howev
er, Glimpse is designed to be loaded asynchronously so not to impact the performance of the pages being monitored

You then add the following entries at the top of the HEAD element in your HTML files:

```
<script src="./rum.js" async></script>
<meta name="glimpse-appId" content="mainPage"/>
```

This will set the appId to be "mainPage" which will be sent back to the beaconURL, the beaconURL is set in rum.js, but also can be over
ridden with another meta tag:

```
<meta name="glimpse-beaconUrl" content="pixel.png"/>
```

## Webserver Config and CORS
In order to support testing external URLs, the webservers/CDNs of those URLs must set some CORS headers to allow the beacon to function
 correctly, these headers are:
 - Access-Control-Allow-Origin: * - this is a bare minimum and allows the remote webserver to respond to the request otherwise you just get a request denied error
 - Timing-Allow-Origin: * - this is needed to allow for detail Performance Timing data to be retrieved (this is optional)

## Processing received data
The kind of data which comes back is below:
```
192.168.0.87 - - [30/Apr/2018:01:20:18 +0000] "GET /localdrive/Media/rumtest/pixel.png?eyJhcHBJZCI6Im1haW5QYWdlIiwiZXJyb3JzIjpbXSwiZG5zTXMiOjAsImxvYWRNcyI6NDY4LCJtb2RzIjpbInBlcmYiLCJpcCJdLCJick5hbWUiOiJDaHJvbWUiLCJiclZlciI6IjY2LjAuMzM1OS4xMzkiLCJickNvb2tpZXMiOnRydWUsIk9TIjoiV2luZG93cyIsInJlcyI6eyJhbXpuY291ayI6eyJzdGFydE1zIjoxNTI1MDUxMjIwMTQ3LCJzdGF0IjoyMDAsImR1ck1zIjoiMjMuMTAiLCJ0dGZiTXMiOiIyMi42MCIsImRuc01zIjoiMC4wMCIsInhmZXJCeXRlcyI6NDAxfSwiZ2l0aHViQzM2MHBpeGVsIjp7InN0YXJ0TXMiOjE1MjUwNTEyMjAxNDcsInN0YXQiOjIwMCwiZHVyTXMiOiIxMTMuMTAifSwiZ2l0aHViQ0ROIjp7InN0YXJ0TXMiOjE1MjUwNTEyMjAxNDcsInN0YXQiOjIwMCwiZHVyTXMiOiI0MDUuOTAiLCJ0dGZiTXMiOiI0MDUuMjAiLCJkbnNNcyI6IjAuMDAiLCJ4ZmVyQnl0ZXMiOjY0N319LCJjbElQIjoiMTkyLjE2OC4wLjg3In0= HTTP/1.1" 200 120 "http://coreos.local/localdrive/Media/rumtest/rumtest.html" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36"
```

The data after the question mark is base64 encoded JSON, the above JSON decodes to:
```
{
  "appId": "mainPage",
  "errors": [
    
  ],
  "dnsMs": 0,
  "loadMs": 468,
  "mods": [
    "perf",
    "ip"
  ],
  "brName": "Chrome",
  "brVer": "66.0.3359.139",
  "brCookies": true,
  "OS": "Windows",
  "res": {
    "amzncouk": {
      "startMs": 1525051220147,
      "stat": 200,
      "durMs": "23.10",
      "ttfbMs": "22.60",
      "dnsMs": "0.00",
      "xferBytes": 401
    },
    "githubC360pixel": {
      "startMs": 1525051220147,
      "stat": 200,
      "durMs": "113.10"
    },
    "githubCDN": {
      "startMs": 1525051220147,
      "stat": 200,
      "durMs": "405.90",
      "ttfbMs": "405.20",
      "dnsMs": "0.00",
      "xferBytes": 647
    }
  },
  "clIP": "192.168.0.87"
}
```

## What does the data mean
The following fields are broken down:
 - errors (array) - this is an array of JSON objects which correspond to Javascript and resource errors which Glimpse may detect, the intention is to help with debugging a page
 - dnsMs - using PerformanceTiming, how long did the DNS call take, if 0 seconds then it was probably cached
 - loadMs - how long did the page being monitored take to load
 - mods - what Glimpse modules have been detected as being browser compatible
 - - perf - this is PerformanceTiming module
 - - ip - this is WebRTC support for getting the private IP
 - brName - browser name
 - brVer - broweser version
 - brCookiers - are cookies enabled
 - OS - what OS has been detected, this is basic detection but more detailed can be added use the user-agent from the beason request weblog
 - res (array) - these are results of the external site lookups which have been defined, the key is defined with the URL being tested
 - - startMs - epoch milliseconds when request started
 - - stat - http status code
 - - durMs - total request time
 - - ttfbMs - time to first byte from the request being started (perf module needed)
 - - dnsMs - dns lookup time (perf module needed)
 - - xferBytes - number of bytes transferred (perf module needed)
 - clIP - client private IP added (ip module needed)
