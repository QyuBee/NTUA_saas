import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import axiosConfig from '@/axiosConfig'
import { Chart } from '@/lib/db_model';
import { excuteQuery, getUser } from '@/lib/db';
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
        const user = await getUser(session.user.email)

        const credit_to_remove = 20
        if (user.credits >= credit_to_remove) {
            user.removeCredit(credit_to_remove)
            try {

                //Load data from request
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


                // Faire quelque chose avec les données
                // console.log("Chart Options:", chartOption);
                // console.log("User Email:", userEmail);

                // console.log(chartOption)


                const uploadedFile = await fs.readFile(files.myfile[0].filepath, {
                    encoding: 'utf8',
                })
                // console.log("Uploaded File:", uploadedFile);
                let id_chart = await excuteQuery({
                    query: 'SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = "charts"',
                });
                id_chart = id_chart[0]["AUTO_INCREMENT"]

                const path = `${process.cwd()}/db/${session.user.email}/${id_chart}/`

                const path_html = writeFile(uploadedFile, path, id_chart + ".html")


                const path_pdf = await exportChart(chartOption, path, id_chart, "pdf")
                const path_png = await exportChart(chartOption, path, id_chart, "png")
                const path_svg = await exportChart(chartOption, path, id_chart, "svg")

                const chart = new Chart()
                chart.create({ email: session.user.email, type: chartOption.chart.type, name: chartOption.title.text, path_html: path_html, path_pdf: path_pdf, path_png: path_png, path_svg: path_svg })

                res.status(200).end()
            } catch (error) {
                res.status(500).end("Error: couldn't export chart !")
            }
        } else {
            res.status(500).end("Error: not enough credits")
        }
    } else {
        // Handle any other HTTP method
        res.redirect(307, '/')
    }
}

async function exportChart(options, path, chart_name, type) {
    return await axiosConfig.post(process.env.HIGHCHART_SERVER_HOST, { "infile": options, "type": type }, {
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
    })
        .then(response => {
            fs.writeFile(path + chart_name + "." + type, response.data);
            console.log('Le fichier a été enregistré :', path + chart_name + "." + type);
            return path + chart_name + "." + type
        })
        .catch(error => {
            console.log('Erreur lors de la requête Axios :', error);
            throw error
        });

}

function writeFile(file, path, filename) {
    console.log("path", path + filename)
    fs.mkdir(path, { recursive: true });
    fs.writeFile(path + filename, file);
    return path + filename
}