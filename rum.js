"use strict";
// Glimpse Real User Monitoring (RUM) Library
var rumLoadStart = (new Date).getTime(); // do not edit
var resultToSend = {}; // do not edit
resultToSend["appId"] = "main";
// In order to request external (not from your domain) resources below, they must be served with the CORS header of "Access-Control-Allow-Origin: *"
// To gather timing telemetry data, they must also include the timing CORS header of "Timing-Allow-Origin: *"
var resourcesToTest = {
	"amzncouk":  "https://images-eu.ssl-images-amazon.com/images/G/01/AUIClients/AmazonGatewayHerotatorJS-ed6ce4798415244198b464cf366c538b1f2f2537._V2_.css",
	"githubC360pixel" : "https://raw.githubusercontent.com/cloudthreesixty/AWS_Hosted_Website/master/images/pixel.png",
	"githubCDN" : "https://assets-cdn.github.com/assets/frameworks-d83d349f179c680b2beb431ca4362f9f.css"
};
var beaconURL = "pixel.png";


//****************************** DO NOT EDIT BLOW THIS LINE //******************************
resultToSend["errors"] = [];
var rumLoadEnd;

// Overrise default appId on a per page basis
var m = document.getElementsByTagName('meta');
for(var i in m){
	if(m[i].name == "glimpse-appId") {
		resultToSend["appId"] = m[i].content;
	}
	if(m[i].name == "glimpse-beaconUrl") {
		beaconURL = m[i].content;
	}
}

// Capture Invalid Files and Javascipt Errors on the linked page
window.addEventListener('error', function(e) {
	var newObj = {};
	if (e.message) {
		newObj["message"] = e.message;
	}
	if (e.lineno) {
		newObj["lineno"] = e.lineno;	
	}
	if (e.colno) {
		newObj["colno"] = e.colno;	
	}
	if (e.filename) {
		newObj["filename"] = e.filename;	
	}
	if (e.srcElement) {
		if (e.srcElement.src) {
			newObj["srcElementSrc"] = e.srcElement.src;
		}
		if (e.srcElement.outerHTML) {
			newObj["srcElementOuterHTML"] = e.srcElement.outerHTML;
		}
		if (e.srcElement.baseURI) {
			newObj["filename"] = e.srcElement.baseURI;
		}
	}
	if (e.originalTarget) {
		if (e.originalTarget.src) {
			newObj["srcElementSrc"] = e.originalTarget.src;
		}
		if (e.originalTarget.outerHTML) {
			newObj["srcElementOuterHTML"] = e.originalTarget.outerHTML;
		}
		if (e.originalTarget.baseURI) {
			newObj["filename"] = e.originalTarget.baseURI;
		}
	}
	resultToSend["errors"][resultToSend["errors"].length] = newObj;
    console.log(e);
}, true);


function a () {
	rumLoadEnd = (new Date).getTime();
	console.log("Glimpse RUM started");
	resultToSend["dnsMs"] = 0;
	resultToSend["loadMs"] = 0;
	resultToSend["mods"] = [];
	resultToSend["fin"] = false;
	resultToSend["resCnt"] = 0;
	if (window.performance) {
		resultToSend["mods"].push ("perf");
		resultToSend["dnsMs"] = window.performance.timing.domainLookupEnd - window.performance.timing.domainLookupStart;
		resultToSend["loadMs"] = rumLoadEnd - window.performance.timing.responseStart;
	}
	else {
		resultToSend["loadMs"] = rumLoadEnd - rumLoadStart;
	}
	// Get Browser Details
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"

	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent

	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "MSIE";
	 fullVersion = nAgt.substring(verOffset+5);
	}

	else if ((nAgt.indexOf("Trident")!=-1) && ((verOffset=nAgt.indexOf("rv:"))!=-1)) {
	 browserName = "MSIE";
	 fullVersion = nAgt.substring(verOffset+3);
	}

	// In MSIE, the true version is after "MSIE" in userAgent

	else if ((verOffset=nAgt.indexOf("Edge"))!=-1) {
	 browserName = "Edge";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"

	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"

	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"

	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent

	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
	          (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}

	// trim the fullVersion string at semicolon/space if present

	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}
	resultToSend["brName"] = browserName;
	resultToSend["brVer"] = fullVersion;
	resultToSend["brCookies"] = navigator.cookieEnabled;

	// Detect OS
	var OSName = "Unknown OS";
	if (navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
	if (navigator.userAgent.indexOf("Mac") != -1) OSName = "Macintosh";
	if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
	if (navigator.userAgent.indexOf("Android") != -1) OSName = "Android";
	if (navigator.userAgent.indexOf("like Mac") != -1) OSName = "iOS";
	resultToSend["OS"] = OSName;

	// Get client IP
	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for Firefox and chrome
	if (typeof window.RTCPeerConnection === 'function') {
		var pc = new window.RTCPeerConnection({iceServers:[]}), noop = function(){};      
		if(typeof pc.createDataChannel === 'function') {
			resultToSend["mods"].push ("ip");
			pc.createDataChannel('');//create a bogus data channel
			pc.createOffer(pc.setLocalDescription.bind(pc), noop);// create offer and set local description
			pc.onicecandidate = function(ice)
			{
			 if (ice && ice.candidate && ice.candidate.candidate)
			 {
			  var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
			  //console.log('my IP: ', myIP);   
			  resultToSend["clIP"] = myIP;
			  pc.onicecandidate = noop;
			 }
			};
		}
	}

	// Make external calls
	resultToSend["res"] = {};
	for (var resKey in resourcesToTest) {
		if (resourcesToTest.hasOwnProperty(resKey)) {
			b (resKey, resourcesToTest[resKey]);
		}
	}
}


function b (resKey, url) {
	resultToSend["res"][resKey] = {};
	resultToSend["res"][resKey]["startMs"] = (new Date).getTime();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = (function(x, k) {
	    return function() {
	    	if (x.readyState == 4) {
	    		var end = (new Date).getTime();
	    		resultToSend["res"][k]["stat"] = x.status
				// check performance data - find entry based on requsted URL
				if (window.performance) {
					var resources = window.performance.getEntriesByType('resource');
					// filter all resources to just +1 button iframes with timing information
					var p1Resources = resources.filter(function(rtInfo) {
						return rtInfo.name.indexOf(x.responseURL) != -1 
					});
					if (p1Resources.length > 0) {
						console.log(p1Resources[0]);
						if (p1Resources[0].duration > 0) {
							resultToSend["res"][k]["durMs"] = (p1Resources[0].duration).toFixed(2);
						}
						if (p1Resources[0].requestStart > 0) {
							resultToSend["res"][k]["ttfbMs"] = (p1Resources[0].responseStart - p1Resources[0].startTime).toFixed(2);
						}
						if (p1Resources[0].domainLookupEnd > 0) {
							resultToSend["res"][k]["dnsMs"] = (p1Resources[0].domainLookupEnd - p1Resources[0].domainLookupStart).toFixed(2);
						}
						if (p1Resources[0].transferSize > 0) {
							resultToSend["res"][k]["xferBytes"] = p1Resources[0].transferSize;
						}
					}
					else {
						resultToSend["res"][k]["durMs"] = end - resultToSend["res"][k]["startMs"];
					}
				}
				else {
					resultToSend["res"][k]["durMs"] = end - resultToSend["res"][k]["startMs"];
				}
				resultToSend["resCnt"]++;
				// if all done then send data back to beacon
				if (resultToSend["resCnt"] >= Object.keys(resourcesToTest).length) {
					resultToSend["fin"] = true;
					r();
				}
	    	}
	    }
	})(xhttp, resKey);
	// add random element to URL to avoid cached responses
	xhttp.open("HEAD", url+"?randoMRandomrandoM="+(new Date).getTime(), true);
	xhttp.send(null);
}

function r () {
	// send data to server as post
	resultToSend.fin = undefined;
	resultToSend.resCnt = undefined;
	var appendSignalData = btoa(JSON.stringify(resultToSend));
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4) {
    	}
	};

	xhttp.open("GET", beaconURL+"?"+appendSignalData, true);
	xhttp.send(null);
	// Output data
	console.log("Beacon Data: "+JSON.stringify(resultToSend));
}

// Add to page onload event
if(window.addEventListener){
  window.addEventListener('load', a, true);
}else{
  window.attachEvent('onload', a);
}

