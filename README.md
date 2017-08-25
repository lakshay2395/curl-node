# CURL-NODE

A simple simulation of curl software in nodeJS.

## Usage

Currently, it supports only http/https requests.

Standard Syntax - curl-node curl-node <URL> --request get|post|delete|put --data "<String of data>" --data-location "<Location for file having data>"

1. Simple GET Request

   curl-node https://www.google.co.in/ (Default request is GET)

2. POST Request

   curl-node https://www.sample.com/ --request post --data "{'id' : 100,'name' : 'Lakshay'}"

3. POST Request(with file location for data)

   curl-node https://www.sample.com/ --request post --data-location "./data.txt"

4. Fetch Only Response Headers

   curl-node https://www.sample.com/ --request head

5. Save output to a file

   curl-node https://www.sample.com/ > ./sample.txt

##Readings

* Nodejs HTTP Module Documentation - https://nodejs.org/api/http.html#http_http_request_options_callback
