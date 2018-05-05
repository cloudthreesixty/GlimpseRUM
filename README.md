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

This next setting will get the page to re-run the test the specified number of seconds if greater than zero, so the following will run every 15 minutes:

```
<meta name="glimpse-reloadTime" content="900"/>
```

This next setting will get capture the pages cookies:

```
<meta name="glimpse-captureCookies" content="true"/>
```

## Webserver Config and CORS
In order to support testing external URLs, the webservers/CDNs of those URLs must set some CORS headers to allow the beacon to function
 correctly, these headers are:
 - Access-Control-Allow-Origin: * - this is a bare minimum and allows the remote webserver to respond to the request otherwise you just get a request denied error
 - Timing-Allow-Origin: * - this is needed to allow for detail Performance Timing data to be retrieved (this is optional)

## Processing received data
The kind of data which comes back is below - this is a nginx log file:
```
192.168.0.98 - - [05/May/2018:17:37:05 +0000] "GET /localdrive/Media/rumtest/pixel.png?eyJhcHBJZCI6Im1haW5QYWdlIiwiZXJyb3JzIjpbXSwiZG5zTXMiOjAsImxvYWRNcyI6NDk0LCJtb2RzIjpbInBlcmYiLCJpcCIsImNvb2tpZXMiXSwicmVsb2FkIjowLCJ1cmwiOiJodHRwOi8vY29yZW9zLmVsbGVtYW4uY28udWsvbG9jYWxkcml2ZS9NZWRpYS9ydW10ZXN0L3J1bXRlc3QuaHRtbCIsImJyTmFtZSI6IkNocm9tZSIsImJyVmVyIjoiNjYuMC4zMzU5LjEzOSIsImJyQ29va2llcyI6dHJ1ZSwiT1MiOiJXaW5kb3dzIiwiY29va2llcyI6eyJ0ZXN0Q29va2llIjoiZW1jYSJ9LCJyZXMiOnsiYW16bmNvdWsiOnsic3RhcnRNcyI6MTUyNTU0MTgyNDk1Nywic3RhdCI6MjAwLCJkdXJNcyI6IjIxLjAwIiwidHRmYk1zIjoiMjAuNzAiLCJkbnNNcyI6IjAuMDAiLCJ4ZmVyQnl0ZXMiOjQwMH0sImdpdGh1YkMzNjBwaXhlbCI6eyJzdGFydE1zIjoxNTI1NTQxODI0OTU3LCJzdGF0IjoyMDAsImR1ck1zIjoiMTM4LjkwIn0sImdpdGh1YkNETiI6eyJzdGFydE1zIjoxNTI1NTQxODI0OTU3LCJzdGF0IjoyMDAsImR1ck1zIjoiNDY3LjMwIiwidHRmYk1zIjoiNDY3LjAwIiwiZG5zTXMiOiIwLjAwIiwieGZlckJ5dGVzIjo2NDh9fSwiY2xJUCI6IjE5Mi4xNjguMC45OCJ9 HTTP/1.1" 200 120 "http://coreos.elleman.co.uk/localdrive/Media/rumtest/rumtest.html" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36"
```

The data after the question mark is base64 encoded JSON, the above log decodes to the following JSON:
```
{
  "appId": "mainPage",
  "errors": [
    
  ],
  "dnsMs": 0,
  "loadMs": 494,
  "mods": [
    "perf",
    "ip",
    "cookies"
  ],
  "reload": 0,
  "url": "http:\/\/coreos.elleman.co.uk\/localdrive\/Media\/rumtest\/rumtest.html",
  "brName": "Chrome",
  "brVer": "66.0.3359.139",
  "brCookies": true,
  "OS": "Windows",
  "cookies": {
    "testCookie": "emca"
  },
  "res": {
    "amzncouk": {
      "startMs": 1525541824957,
      "stat": 200,
      "durMs": "21.00",
      "ttfbMs": "20.70",
      "dnsMs": "0.00",
      "xferBytes": 400
    },
    "githubC360pixel": {
      "startMs": 1525541824957,
      "stat": 200,
      "durMs": "138.90"
    },
    "githubCDN": {
      "startMs": 1525541824957,
      "stat": 200,
      "durMs": "467.30",
      "ttfbMs": "467.00",
      "dnsMs": "0.00",
      "xferBytes": 648
    }
  },
  "clIP": "192.168.0.98"
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
 - - cookies - cookies are being captured if available
 - reload - time (in secs) to re-run the tests
 - url - the URL of the calling page
 - brName - browser name
 - brVer - broweser version
 - brCookiers - are cookies enabled
 - OS - what OS has been detected, this is basic detection but more detailed can be added use the user-agent from the beason request weblog
 - cookies (array) - page cookies which have been captured
 - res (array) - these are results of the external site lookups which have been defined, the key is defined with the URL being tested
 - - startMs - epoch milliseconds when request started
 - - stat - http status code
 - - durMs - total request time
 - - ttfbMs - time to first byte from the request being started (perf module needed)
 - - dnsMs - dns lookup time (perf module needed)
 - - xferBytes - number of bytes transferred (perf module needed)
 - clIP - client private IP added (ip module needed)

## AWS Backend to Process
In order to collect and query the data a serverless architecture has been defined. This makes use of AWS services and means that servers don't have to be patched etc. An architecture diagram is below:

![AWS Serverless Architecture Diagram](AWS-receiver/AWS-Architecture-Diagram.png?raw=true "Architecture Diagram")

The deployment is documented in a cloudformation JSON template, in order to execure the template several parameters need to be specified:

 - SrcJSURL (String) - the javascript file to be installed in the origin S3 bucket, default is https://github.com/cloudthreesixty/GlimpseRUM/raw/master/rum.js
 - SrcBeaconURL (String) - the image file to be installed in the origin S3 bucket, default is https://github.com/cloudthreesixty/GlimpseRUM/raw/master/pixel.png
 - CFdistroFQDN (String) - the cloudfront distribution's full qualified domain name to answer to, example is www.example.com
 - CertificateArn (String) - the Amazon Resource Name (ARN) of an existing SSL certificate stored in certificate manager for the host defined in CFdistroFQDN
