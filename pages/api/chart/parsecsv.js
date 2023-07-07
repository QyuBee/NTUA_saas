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

    console.log(csvJSON(contents))

    // contents is a string with the content of uploaded file, so you can read it or store

    res.status(200).end()
}

function csvJSON(csv){

    var lines=csv.split("\n");

    if(lines[0].split(",").length>1 && lines[1].split(",").length>1){
        throw new Error("wrong format")
    }
  
    if(!["line","bar","pie"].includes(lines[1])){
        throw new Error("wrong type")
    }
  
    var result = {title:lines[0],type:lines[1],data:[]};
  
    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[2].split(",");
  
    for(var i=3;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.data.push(obj);
  
    }
  
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }