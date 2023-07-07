export function csvJSON(csv) {
    var firstLineData = 5;

    var lines = csv.split("\n");

    if (lines.length < firstLineData) {
        throw new Error("wrong csv format")
    }
    const title = lines[0].split(",")
    const type = lines[1].split(",")
    const y_axe = lines[2].split(",")
    const x_axe = lines[3].split(",")
    const data = lines[4].split(",")

    if (!(title[0] == "title" && type[0] == "type" && y_axe[0] == "y_axe" && x_axe[0] == "x_axe" && data[0] == "data")) {
        throw new Error("wrong csv format")
    }

    if (!["line", "bar", "pie"].includes(type[1])) {
        throw new Error("wrong chart type")
    }


    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/    
    var result = { title: title[1], type: type[1], x_axe: x_axe.slice(1, x_axe.length), y_axe: y_axe[1], data: [] };


    for (var i = firstLineData; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        obj.name = currentline[0]
        obj.data = currentline.slice(1, currentline.length).map((data) => { return parseFloat(data) });

        /* for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        } */

        result.data.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}