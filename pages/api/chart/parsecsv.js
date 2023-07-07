import { IncomingForm } from 'formidable'
// you might want to use regular 'fs' and not a promise one
import { promises as fs } from 'fs'

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    }
};

export default async (req, res) => {
    // parse form with a Promise wrapper
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })
    
    // console.log(data.files)

    // read file from the temporary path
    const contents = await fs.readFile(data?.files?.myfile[0].filepath, {
        encoding: 'utf8',
    })
    // contents is a string with the content of uploaded file, so you can read it or store

    res.status(200).end(csvJSON(contents))
}

function csvJSON(csv){
    var firstLineData=5;

    var lines=csv.split("\n");

    if(lines.length<firstLineData){
        throw new Error("wrong format")
    }
    const title=lines[0].split(",")
    const type=lines[1].split(",")
    const y_axe=lines[2].split(",")
    const x_axe=lines[3].split(",")
    const data=lines[4].split(",")

    if(!(title[0]=="title" && type[0]=="type" && y_axe[0]=="y_axe" && x_axe[0]=="x_axe" && data[0]=="data")  ){
        throw new Error("wrong format")
    }
  
    if(!["line","bar","pie"].includes(type[1])){
        throw new Error("wrong type")
    }
  
    
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/    
    var result = {title:title[1],type:type[1],x_axe:x_axe.slice(1,x_axe.length),y_axe:y_axe[1],data:[]};


    for(var i=firstLineData;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");

        obj.name=currentline[0]
        obj.data=currentline.slice(1, currentline.length).map((data)=>{return parseFloat(data)});
  
        /* for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        } */
  
        result.data.push(obj);
  
    }
  
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }