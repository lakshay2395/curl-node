#!/usr/bin/env node

"use strict";
const fs = require("fs"),
      urlObject = require("./url-normalize.js");

/**
 * required parameters : 
 * 1. URL - either http or https
 */

var strRegex = "^((https|http)?://)"
+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
+ "|" // 允许IP和DOMAIN（域名）
+ "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
+ "[a-z]{2,6})" // first level domain- .com or .museum
+ "(:[0-9]{1,4})?" // 端口- :80
+ "((/?)|" // a slash isn't required if there is no file name
+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
var re=new RegExp(strRegex);
let url = process.argv[2];
if(!re.test(url))
    throw Error("Url is invalid !!!");

const requiredLibrary = url.toString().startsWith("https:") ? require("https") : require("http");

/**
 * optional parameters : 
 * 1. type of request (optional)
 *      --request put | post | get(default) | delete | head
 * 
 * 2. data with request (optional)
 *      --data "<data as string>"
 * 
 * 3. fetch data from a file(optional)
 *      --data-location "<file-location>"
 *      
 */

var optionalArgumentsCount = process.argv.length;
if((optionalArgumentsCount+1) % 2 != 0)
    throw Error("Invalid number of optional parameters !!!");

var requestType = null,dataToBeSent = null,responseType = null;

for(var i = 3 ; i < optionalArgumentsCount ; i=i+2){
    switch(process.argv[i]){
        case "--request" :  if(requestType == null){
                                switch(process.argv[i+1]){
                                    case "put" : requestType = "put";
                                                break;
                                    case "get" : requestType = "get";
                                                break;
                                    case "post" : requestType = "post";
                                                break;
                                    case "head" : requestType = "head";
                                                break;
                                    case "delete" : requestType = "delete";
                                                    break;
                                    default : throw Error("Unsupported Request Type !!!");
                                }
                           }
                           break;
        case "--data" : if(dataToBeSent == null){
                            dataToBeSent = process.argv[i+1];
                            break;
                        }
                        else
                            throw Error("Trying to send data from multiple sources !!!");
        case "--data-location" : if(dataToBeSent == null){
                                     dataToBeSent = fs.readFileSync(process.argv[i+1]);
                                     break;
                                 }
                                 else
                                     throw Error("Trying to send data from multiple sources !!!");
        default : throw Error("Unsupported optional parameter");
    }
}

//console.log("requestType = ",requestType);

requestType = requestType || "GET";
responseType = responseType || "full";

var options = urlObject(url);
options.method = requestType.toUpperCase();

process.stdout.write("Request Headers : \n"+JSON.stringify(options,null,4)+"\n");

const request = requiredLibrary.request(options,(res) => {
    let buffer = '';
    process.stdout.write("Response Headers : \n"+JSON.stringify(res.headers,null,4)+"\n");
    res.on('data',(data) => {
        buffer += data;
    })
    res.on('end',() => {
        process.stdout.write(buffer.toString());
    });
});

request.on('error',(err) => {
    process.stdout.write("Error Occurred : "+err);
});

request.write(dataToBeSent || '');
request.end();









