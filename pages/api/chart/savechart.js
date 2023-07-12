import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import axios from 'axios';
import { getSession } from 'next-auth/react';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (req.method === 'POST') {
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm();

            form.parse(req, (err, fields, files) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields, files });
            });
        });

        // Accéder aux champs et aux fichiers
        const { fields, files } = data;
        // Traiter les champs
        const chartOption = JSON.parse(fields.chartOption);
        const userEmail = fields.user;


        // Faire quelque chose avec les données
        // console.log("Chart Options:", chartOption);
        // console.log("User Email:", userEmail);

        // console.log(chartOption)


        const uploadedFile = await fs.readFile(files.myfile[0].filepath, {
            encoding: 'utf8',
        })
        // console.log("Uploaded File:", uploadedFile);

        const path = `${process.cwd()}/public/db/${userEmail}/`

        writeFile(uploadedFile, path, chartOption.title.text + ".html")


        exportChart(chartOption, path, "pdf")
        exportChart(chartOption, path, "png")
        exportChart(chartOption, path, "svg")


        res.status(200).end()
    } else {
        // Handle any other HTTP method
        res.redirect(307, '/')
    }
}

function exportChart(options, path, type) {
    axios.post('http://127.0.0.1:8089', {"infile":options,"type":type}, {
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
    })
        .then(response => {
            fs.writeFile(path+options.title.text+"."+type, response.data);
            console.log('Le fichier a été enregistré :', path+options.title.text+"."+type);
        })
        .catch(error => {
            console.error('Erreur lors de la requête Axios :', error);
        });

    /* 
    // Process a POST request
    const exporter = require('highcharts-export-server');

    //Export settings
    var exportSettings = {
        type: 'png',
        options: options
    };

    //Set up a pool of PhantomJS workers
    exporter.initPool();

    //Perform an export
    exporter.export(exportSettings, function (err, res) {
        //The export result is now in res.
        //If the output is not PDF or SVG, it will be base64 encoded (res.data).
        //If the output is a PDF or SVG, it will contain a filename (res.filename).
        // result = res
        console.log("edzednjdn",res)

        fs.writeFile(path+exportSettings.options.title.text+"."+exportSettings.type, res.data, 'base64', function (err) {
            if (err) {
                console.error('Erreur lors de l\'enregistrement du fichier :', err);
            } else {
                console.log('Le fichier a été enregistré :', filename);
            }
            console.log("finish")
            exporter.killPool();
            process.exit(1);
        });

    });
    return 
    */
}

function writeFile(file, path, filename) {
    console.log("path", path + filename)
    fs.mkdir(path, { recursive: true });
    fs.writeFile(path + filename, file);

}