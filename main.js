let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
// let helpObj=require("./commands/help");
// let organizeObj=require("./commands/organize");

let command = inputArr[0];
let types={
    media:["mp4","mkv","mp3"],
    archives:['zip','7z','rar','tar','iso'],
    documents:['docx','doc','pdf','xlsx','xls','txt'],
    app:['exe','pkg','msi'],
    photo:['jpg','jpeg']
}
switch(command){
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Input right command");
        break;    
}


function organizeFn(dirPath){
    let destPath;
    if(dirPath==undefined){
        console.log("kindly enter the path");
        return;
    }else{
        let doesExist= fs.existsSync(dirPath);
        if(doesExist){
             destPath = path.join(dirPath,"OrganizedFiles"); 
             if(fs.existsSync(destPath)==false){
                 fs.mkdirSync(destPath);
            }
        }else{
            console.log("kindly enter the correct path");
            return;
        }
      }
    organizeHelper(dirPath,destPath);
    
    }
    function organizeHelper(src,dest){
        //identify categories of all the files present in the input directory
       let childNames = fs.readdirSync(src);
       //console.log(childNames);
       for(let i=0;i<childNames.length;i++){
           let childAddress = path.join(src,childNames[i]);
           let isFile = fs.lstatSync(childAddress).isFile();
           if(isFile){
               let category = getCategory(childNames[i]);
               console.log(childNames[i],"belongs to -->",category);
                sendFiles(childAddress,dest,category);
           }
       } 
    }
    function sendFiles(srcFilePath,dest,category){
          let categoryPath = path.join(dest,category);
          if(fs.existsSync(categoryPath)==false){
              fs.mkdirSync(categoryPath);
          }
          let fileName = path.basename(srcFilePath);
          let destFilePath = path.join(categoryPath,fileName);
           fs.copyFileSync(srcFilePath,destFilePath);
           fs.unlinkSync(srcFilePath);  
           console.log(fileName,"copiied to",category);
    }
    function getCategory(name){
        let ext = path.extname(name);
        ext = ext.slice(1);
        for(let type in types){
             let cTypeArray=types[type];
             for(let i=0;i<cTypeArray.length;i++){
                 if(ext==cTypeArray[i]){
                     return type
                 }
             }
        }
        //console.log(ext);
        return "others";
    }

function helpFn(){
    console.log(`
    List of all the commands:
        node main.js tree "dirPath"
        node main.js organize "dirPath"
        node main.js help
    `);
}