import { excuteQuery } from "./db";

export class UserDB {
    email;
    credits;
    lastConnection;

    constructor() {
        this.email = null
        this.credits = null
        this.lastConnection = null

        return this
    };

    async init({ email, credits = null, lastConnection = null }) {
        this.email = email
        if (credits == null && lastConnection == null) {
            this.credits = 50
            this.lastConnection = new Date().toISOString()

            const result = await excuteQuery({
                query: 'INSERT INTO users (email,credits,lastConnection) VALUES(?, ?, ?)',
                values: [this.email, this.credits, this.lastConnection],
            });

            // console.log("new User", result["error"]["code"])
            if (result && result["error"] && result["error"]["code"] != null) {
                return new Error("Erreur lors de l'insertion d'un nouvel utilisateur : " + result["error"]["message"]);
            }
        } else {
            this.credits = credits
            this.lastConnection = lastConnection
        }

        return this
    }

    async addCredit(credits) {
        const result = await excuteQuery({
            query: 'UPDATE users SET credits=?  WHERE email=?',
            values: [parseInt(this.credits) + parseInt(credits), this.email],
        });
        console.log("addCredit", result)
        if (result && result["error"] && result["error"]["code"] != null) {
            console.error(result["error"]["message"])
            return new Error("Erreur lors de l'insertion d'un nouvel utilisateur : " + result["error"]["message"]);
        }
        this.credits = this.credits + credits
    }

    async removeCredit(credits) {
        const result = await excuteQuery({
            query: 'UPDATE users SET credits=?  WHERE email=?',
            values: [this.credits - credits, this.email],
        });
        if (result && result["error"] && result["error"]["code"] != null) {
            console.error(result["error"]["message"])
            return new Error("Erreur lors de l'insertion d'un nouvel utilisateur : " + result["error"]["message"]);
        }
        this.credits = this.credits - credits
    }


    async setLastConnection() {
        const now=new Date().toISOString()
        const result = await excuteQuery({
            query: 'UPDATE users SET lastConnection=?  WHERE email=?',
            values: [now, this.email],
        });
        if (result && result["error"] && result["error"]["code"] != null) {
            console.error(result["error"]["message"])
            return new Error("Erreur lors de l'insertion d'un nouvel utilisateur : " + result["error"]["message"]);
        }
        this.lastConnection=now

    }
}

class Chart {
    id
    user_id
    type
    name
    created
    path_html
    path_pdf
    path_png
    path_svg

}