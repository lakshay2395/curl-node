module.exports = function(urlString){
    let urlWithoutProtocol = urlString,protocol = null || "http:";
    if(urlString.startsWith("http://") || urlString.startsWith("https://")){
        let urlSet = urlString.split("://");
        protocol = urlSet[0]+":";
        urlWithoutProtocol = urlSet[1];
    }
    let temp = urlWithoutProtocol.split(":");
    if(temp.length > 1)
        temp = temp[1].split("/");
    let portNumber = parseInt(temp[0]) || 80;
    portNumber = protocol == "http:" ? 80 : 443;
    let path = temp[1] ?  '/'+temp[1] : '/'+urlWithoutProtocol.split("/")[1];
    return { protocol : protocol, hostname : urlWithoutProtocol.split("/")[0] , port : portNumber , path : path};
}