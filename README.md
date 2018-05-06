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

This setting will point the script to a json file with the external tests defined:

```
<meta name="glimpse-externalTestUrl" content="external.json"/>
```

## Webserver Config and CORS
In order to support testing external URLs, the webservers/CDNs of those URLs must set some CORS headers to allow the beacon to function
 correctly, these headers are:
 - Access-Control-Allow-Origin: * - this is a bare minimum and allows the remote webserver to respond to the request otherwise you just get a request denied error
 - Timing-Allow-Origin: * - this is needed to allow for detail Performance Timing data to be retrieved (this is optional)

## Processing received data
The kind of data which comes back is below - this is a nginx log file:
```
192.168.0.98 - - [05/May/2018:17:37:05 +0000] "GET /localdrive/Media/rumtest/pixel.png?ew0KICAiYXBwSWQiOiAibWFpblBhZ2UiLA0KICAiZXJyb3JzIjogWw0KICAgIA0KICBdLA0KICAiZG5zTXMiOiAzNCwNCiAgImxvYWRNcyI6IDQ2MywNCiAgIm1vZHMiOiBbDQogICAgInBlcmYiLA0KICAgICJpcCIsDQogICAgImNvb2tpZXMiDQogIF0sDQogICJyZWxvYWQiOiAwLA0KICAidXJsIjogImh0dHA6XC9cL2NvcmVvcy5lbGxlbWFuLmNvLnVrXC9sb2NhbGRyaXZlXC9NZWRpYVwvcnVtdGVzdFwvcnVtdGVzdC5odG1sIiwNCiAgImJyTmFtZSI6ICJDaHJvbWUiLA0KICAiYnJWZXIiOiAiNjYuMC4zMzU5LjEzOSIsDQogICJickNvb2tpZXMiOiB0cnVlLA0KICAiT1MiOiAiV2luZG93cyIsDQogICJjb29raWVzIjogew0KICAgICJ0ZXN0Q29va2llIjogImVtY2EiDQogIH0sDQogICJnZW9JUCI6IHsNCiAgICAiaXAiOiAiODYuMjIueC54IiwNCiAgICAiaG9zdG5hbWUiOiAieHgudmlyZ2lubS5uZXQiLA0KICAgICJjaXR5IjogIkJ1cm5oYW0iLA0KICAgICJyZWdpb24iOiAiQnVja2luZ2hhbXNoaXJlIiwNCiAgICAiY291bnRyeSI6ICJHQiIsDQogICAgImxvYyI6ICI1MS41MTY3LC0wLjY1MDAiLA0KICAgICJwb3N0YWwiOiAiU0wxIiwNCiAgICAib3JnIjogIkFTNTA4OSBWaXJnaW4gTWVkaWEgTGltaXRlZCINCiAgfSwNCiAgInJlcyI6IFsNCiAgICB7DQogICAgICAicmVzS2V5IjogImFtem5jb3VrIiwNCiAgICAgICJ1cmwiOiAiaHR0cHM6XC9cL2ltYWdlcy1ldS5zc2wtaW1hZ2VzLWFtYXpvbi5jb21cL2ltYWdlc1wvR1wvMDFcL0FVSUNsaWVudHNcL0FtYXpvbkdhdGV3YXlIZXJvdGF0b3JKUy1lZDZjZTQ3OTg0MTUyNDQxOThiNDY0Y2YzNjZjNTM4YjFmMmYyNTM3Ll9WMl8uY3NzIiwNCiAgICAgICJzdGFydE1zIjogMTUyNTY0MDEwNTEyMywNCiAgICAgICJzdGF0dXMiOiAyMDAsDQogICAgICAiZHVyTXMiOiAiNDEuNzAiLA0KICAgICAgInR0ZmJNcyI6ICI0MS40MCIsDQogICAgICAiZG5zTXMiOiAiMC4wMCIsDQogICAgICAieGZlckJ5dGVzIjogNDAwDQogICAgfSwNCiAgICB7DQogICAgICAicmVzS2V5IjogImdpdGh1YkMzNjBwaXhlbCIsDQogICAgICAidXJsIjogImh0dHBzOlwvXC9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tXC9jbG91ZHRocmVlc2l4dHlcL0FXU19Ib3N0ZWRfV2Vic2l0ZVwvbWFzdGVyXC9pbWFnZXNcL3BpeGVsLnBuZyIsDQogICAgICAic3RhcnRNcyI6IDE1MjU2NDAxMDUxMjMsDQogICAgICAic3RhdHVzIjogMjAwLA0KICAgICAgImR1ck1zIjogIjEzMy42MCINCiAgICB9DQogIF0sDQogICJjbElQIjogIjE5Mi4xNjguMC45OCINCn0= HTTP/1.1" 200 120 "http://coreos.elleman.co.uk/localdrive/Media/rumtest/rumtest.html" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36"
```

The data after the question mark is base64 encoded JSON, the above log decodes to the following JSON:
```
{
  "appId": "mainPage",
  "errors": [
    
  ],
  "dnsMs": 34,
  "loadMs": 463,
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
  "geoIP": {
    "ip": "86.22.x.x",
    "hostname": "xx.virginm.net",
    "city": "Burnham",
    "region": "Buckinghamshire",
    "country": "GB",
    "loc": "51.5167,-0.6500",
    "postal": "SL1",
    "org": "AS5089 Virgin Media Limited"
  },
  "res": [
    {
      "resKey": "amzncouk",
      "url": "https:\/\/images-eu.ssl-images-amazon.com\/images\/G\/01\/AUIClients\/AmazonGatewayHerotatorJS-ed6ce4798415244198b464cf366c538b1f2f2537._V2_.css",
      "startMs": 1525640105123,
      "status": 200,
      "durMs": "41.70",
      "ttfbMs": "41.40",
      "dnsMs": "0.00",
      "xferBytes": 400
    },
    {
      "resKey": "githubC360pixel",
      "url": "https:\/\/raw.githubusercontent.com\/cloudthreesixty\/AWS_Hosted_Website\/master\/images\/pixel.png",
      "startMs": 1525640105123,
      "status": 200,
      "durMs": "133.60"
    }
  ],
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
 - geoIP (array) - geoIP lookup performed from client, using https://ipinfo.io/, its not that accurate to city but got the country OK
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

The template outputs the following information:
 - CloudFrontDomainNameToCNAME - the CloudFront Distribution DNS NAME, you should update the CFdistroFQDN to CNAME to this
 - S3dataBucketName - the S3 bucket where the processed logs will be, you can use Amazon Athena or Hive to query these logs

## Using Amazon Athena

In order to query the log set you need to tell Athena what the data format is, in order to generate a skeleton DDL I used a tool from here https://github.com/xtaci/json2hive, and then manually tweaked to the DDL below:
```
CREATE EXTERNAL TABLE logs (
  `date` STRING,
  time STRING,
  x_edge_location STRING,
  sc_bytes STRING,
  c_ip STRING,
  cs_method STRING,
  cs_host STRING,
  cs_uri_stem STRING,
  sc_status STRING,
  cs_referer STRING,
  cs_user_agent STRING,
  cs_uri_query 
    STRUCT<
    errors:
      ARRAY<
        MAP<STRING, STRING>>,
    url:STRING,
    res:
      ARRAY<
        STRUCT<
        status:INT,
        durMs:STRING,
        ttfbMs:STRING,
        dnsMs:STRING,
        xferBytes:INT,
        resKey:STRING,
        url:STRING,
        startMs:BIGINT>>,
    mods:
      ARRAY<STRING>,
    geoIP:
      STRUCT<
      ip:STRING,
      hostname:STRING,
      city:STRING,
      region:STRING,
      country:STRING,
      loc:STRING,
      postal:STRING,
      org:STRING
      >,
    dnsMs:INT,
    loadMs:INT,
    brVer:STRING,
    OS:STRING,
    clIP:STRING,
    appId:STRING,
    reload:INT,
    brName:STRING,
    brCookies:BOOLEAN>,
  cs_cookie STRING,
  x_edge_result_type STRING,
  x_edge_request_id STRING,
  x_host_header STRING,
  cs_protocol STRING,
  cs_bytes STRING,
  time_taken STRING,
  x_forwarded_for STRING,
  ssl_protocol STRING,
  ssl_cipher STRING,
  x_edge_response_result_type STRING,
  cs_protocol_version STRING,
  fle_status STRING,
  fle_encrypted_fields STRING
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
LOCATION 's3://{S3dataBucketName}/cloudfront-logs/';
```