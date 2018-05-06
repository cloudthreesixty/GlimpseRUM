"use strict";
// Glimpse Real User Monitoring (RUM) Library
var rumLoadStart = (new Date).getTime(); // do not edit
var resultToSend = {}; // do not edit
resultToSend["appId"] = "main"; 	// override with meta tag "glimpse-appId"
// In order to request external (not from your domain) resources below, they must be served with the CORS header of "Access-Control-Allow-Origin: *"
// To gather timing telemetry data, they must also include the timing CORS header of "Timing-Allow-Origin: *"
var resourcesToTest = {			// override with meta tag "glimpse-externalTestUrl"
	"amzncouk":  "https://images-eu.ssl-images-amazon.com/images/G/01/AUIClients/AmazonGatewayHerotatorJS-ed6ce4798415244198b464cf366c538b1f2f2537._V2_.css",
	"githubC360pixel" : "https://raw.githubusercontent.com/cloudthreesixty/AWS_Hosted_Website/master/images/pixel.png",
	"githubCDN" : "https://assets-cdn.github.com/assets/frameworks-d83d349f179c680b2beb431ca4362f9f.css"
};
var beaconURL = "pixel.png"; 		// override with meta tag "glimpse-beaconUrl"
var reloadTime = 0; 				// override with meta tag "glimpse-reloadTime"
var captureCookies = 0; 			// override with meta tag "glimpse-captureCookies"


//****************************** DO NOT EDIT BLOW THIS LINE //******************************
resultToSend["errors"] = [];
var rumLoadEnd;
var externalTestUrl = "";
var geoIPlookupUrl = "https://ipinfo.io/json";

// Overrise default appId on a per page basis
var m = document.getElementsByTagName('meta');
for(var i in m){
	if(m[i].name == "glimpse-appId") {
		resultToSend["appId"] = m[i].content;
	}
	if(m[i].name == "glimpse-beaconUrl") {
		beaconURL = m[i].content;
	}
	if(m[i].name == "glimpse-reloadTime") {
		reloadTime = parseInt(m[i].content);
	}
	if(m[i].name == "glimpse-captureCookies") {
		if (m[i].content == "true") {
			captureCookies = 1;
		}
	}
	if(m[i].name == "glimpse-externalTestUrl") {
		externalTestUrl = m[i].content;
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
	resultToSend["reload"] = reloadTime;
	resultToSend["url"] = window.location.href;
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

	// Capture Cookies
	if (captureCookies == 1) {
		console.log("capture cookies");
		resultToSend["mods"].push ("cookies");
		resultToSend["cookies"] = {};
		if (document.cookie) {
			var pairs = document.cookie.split(";");
			for (var i=0; i<pairs.length; i++){
			var pair = pairs[i].split("=");
			resultToSend["cookies"][(pair[0]+'').trim()] = unescape(pair[1]);
			}
		}
	}

	// Do GeoIP Lookup
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = (function(x, url) {
	    return function() {
	    	if (x.readyState == 4) {
	    		if (x.status == 200) {
	    			console.log(x);
					try {
						resultToSend["geoIP"] = JSON.parse(x.responseText);
					}
					catch(err) {
		    			var errorObj = {};
		    			errorObj.errorSource = "GlimpseRUM";
		    			errorObj.errorDescription = "unable to parse geoIP url: "+url+", error: "+err.message;
		    			if (x.responseText) {
		    				errorObj.responseText = x.responseText;
		    			}
		    			else {
		    				errorObj.responseText = "<blank>";
		    			}
		    			resultToSend["errors"].push (errorObj);
		    			r();
					}
	    		}
	    		else {
	    			var errorObj = {};
	    			errorObj.errorSource = "GlimpseRUM";
	    			errorObj.errorDescription = "unable to download geoIP url: "+url+", http status code: "+x.status;
	    			resultToSend["errors"].push (errorObj);
	    		}
				// Make external calls
				resultToSend["res"] = [];
				if (externalTestUrl != "") {
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = (function(x, url) {
					    return function() {
					    	if (x.readyState == 4) {
					    		if (x.status == 200) {
					    			//console.log(x);
									try {
										resourcesToTest = JSON.parse(x.responseText);
										for (var resKey in resourcesToTest) {
											if (resourcesToTest.hasOwnProperty(resKey)) {
												b (resKey, resourcesToTest[resKey]);
											}
										}

									}
									catch(err) {
						    			var errorObj = {};
						    			errorObj.errorSource = "GlimpseRUM";
						    			errorObj.errorDescription = "unable to parse external test url: "+url+", error: "+err.message;
						    			if (x.responseText) {
						    				errorObj.responseText = x.responseText;
						    			}
						    			else {
						    				errorObj.responseText = "<blank>";
						    			}
						    			resultToSend["errors"].push (errorObj);
						    			r();
									}
					    		}
					    		else {
					    			var errorObj = {};
					    			errorObj.errorSource = "GlimpseRUM";
					    			errorObj.errorDescription = "unable to download external test url: "+url+", http status code: "+x.status;
					    			resultToSend["errors"].push (errorObj);
					    			r();
					    		}
					    	}
					    }
					   })(xhttp, externalTestUrl);
					   xhttp.open("GET", externalTestUrl, false);
					   xhttp.send(null);
				}
				else {
					for (var resKey in resourcesToTest) {
						if (resourcesToTest.hasOwnProperty(resKey)) {
							b (resKey, resourcesToTest[resKey]);
						}
					}
				}
	    	}
	    }		
	})(xhttp, geoIPlookupUrl);
	xhttp.open("GET", geoIPlookupUrl, false);
	xhttp.send(null);

	// Call again in specified time
	if (resultToSend["reload"] > 0) {
		setTimeout(function(){ a(); }, resultToSend["reload"]*1000);
	}
	else {
		console.log("Glimpse RUM finished");
	}
}


function b (resKey, url) {
	var resultObj = {};
	resultObj["resKey"] = resKey;
	resultObj["url"] = url;
	resultObj["startMs"] = (new Date).getTime();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = (function(x, k) {
	    return function() {
	    	if (x.readyState == 4) {
	    		var end = (new Date).getTime();
	    		k["status"] = x.status
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
							k["durMs"] = (p1Resources[0].duration).toFixed(2);
						}
						if (p1Resources[0].requestStart > 0) {
							k["ttfbMs"] = (p1Resources[0].responseStart - p1Resources[0].startTime).toFixed(2);
						}
						if (p1Resources[0].domainLookupEnd > 0) {
							k["dnsMs"] = (p1Resources[0].domainLookupEnd - p1Resources[0].domainLookupStart).toFixed(2);
						}
						if (p1Resources[0].transferSize > 0) {
							k["xferBytes"] = p1Resources[0].transferSize;
						}
					}
					else {
						k["durMs"] = end - resultToSend["res"][k]["startMs"];
					}
				}
				else {
					k["durMs"] = end - resultToSend["res"][k]["startMs"];
				}
				resultToSend["res"].push(k);
				resultToSend["resCnt"]++;
				// if all done then send data back to beacon
				if (resultToSend["resCnt"] >= Object.keys(resourcesToTest).length) {
					resultToSend["fin"] = true;
					r();
				}
	    	}
	    }
	})(xhttp, resultObj);
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

