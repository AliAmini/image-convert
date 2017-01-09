// Copyright 2016 Arshpreet Wadehra
//
//
const image = require('images');
const request = require('request').defaults({ encoding: null });
const FileAPI = require('file-api')
  , File = FileAPI.File
  , FileList = FileAPI.FileList
  , FileReader = FileAPI.FileReader
  ;
function GetFilename(url) {
   if (url)
   {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1)
      {
         return m[1];
      }
   }
   return "";
}
function GetFileExtension(url){
  if(url){
    let index = url.lastIndexOf(".")+1;
    return url.substr(index);
  }
}
function dataURLtoFile(dataurl, filename,output_format) {
    var file = new File({
      name: filename+"."+output_format,   // required
      type: "image/"+output_format,     // optional
      buffer: new Buffer(dataurl,'base64')
    });
    return file;
}
module.exports = {
  fromURL : (options, callback)=>{
    let {url, quality,output_format,size} = options;
    if(url == undefined)
      callback("No URL FOUND",null,null);
    if(quality == undefined)
      quality = 100
    if(output_format == undefined)
      output_format = "jpg"
    let filename = GetFilename(url);
    let extension = GetFileExtension(url);
    if(extension == "jpg" || extension == "gif" || extension == "png"){
      try{
        request.get(url, function (err, res, body) {
            var img = image(body);
            var buffer;
            if(size ==undefined || size == "original")//original size
              buffer = image(body).encode(output_format,{quality:quality});
            else
              buffer = image(body).size(size).encode(output_format,{quality:quality});
              callback(null,buffer,dataURLtoFile(buffer,filename,output_format));
        });
      }
      catch(e){
        callback(e,null,null);
      }
    }
    else{
      callback(new Error("Unknown File Format"),null,null)
    }
  }
}
