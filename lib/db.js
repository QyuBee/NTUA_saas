import mysql from 'serverless-mysql';
import { Chart, UserDB } from "./db_model"


const db = mysql(
    {
        config: {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }
    });

export async function excuteQuery({ query, values }) {
    try {
        const results = await db.query(query, values);
        await db.end();
        return results;
    }
    catch (error) { return { error }; }
}


export async function createUser(email) {
    //TODO if already exist
    const user = new UserDB()

    const resultInit = await user.init({ email: email, credit: null, lastConnection: null })
    if (resultInit instanceof Error) {
        return resultInit;
    } else {
        const result = await excuteQuery({
            query: 'INSERT INTO users (email, credits, lastConnection) VALUES(?, ?, ?)',
            values: [user.email, user.credit, user.lastConnection],
        });
        console.log("result", result);
    }

    return user;
}

export async function getUser(email) {
    if (email == null) return null
    try {
        const result = await excuteQuery({
            query: 'SELECT email,credits,lastConnection FROM users WHERE email=?',
            values: [email],
        });
        // console.log("result", result);
        if (result.length == 1) {
            const user = new UserDB()
            user.init({ email: result[0]["email"], credits: result[0]["credits"], lastConnection: result[0]["lastConnection"] })
            return user
        } else {
            return null
        }
    } catch (error) {
        console.log(error);
    }

}



export async function getChartsFromUser(email) {

    try {
        // const charts=[]
        const result = await excuteQuery({
            query: 'SELECT id, created,name, type FROM charts WHERE user_id=?',
            values: [email],
        });
        // for (const elem in result) {
        //     console.log("elem",elem)
        //     const chart= new Chart()
        //     charts.push(chart.init({ id:elem["id"]}))
        // }
        // // console.log("result", charts);
        return result
    } catch (error) {
        console.log(error);
    }

    return this
}

export async function getChartsFromId(id) {

    try {
        const result = await excuteQuery({
            query: 'SELECT * FROM charts WHERE id=?',
            values: [id],
        });
        const chart= new Chart()
        chart.load({ id:id,email:result[0]["user_id"], type : result[0]["type"], name : result[0]["name"], path_html : result[0]["path_html"], path_pdf : result[0]["path_pdf"], path_png : result[0]["path_png"], path_svg : result[0]["path_svg"] })
        
        // console.log("resultresult dbjs 99", result);
        return chart
    } catch (error) {
        console.log(error);
    }

    return this
}
