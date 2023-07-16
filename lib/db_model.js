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
        // console.log("addCredit", parseInt(this.credits) + parseInt(credits))
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
        const now = new Date().toISOString()
        const result = await excuteQuery({
            query: 'UPDATE users SET lastConnection=?  WHERE email=?',
            values: [now, this.email],
        });
        if (result && result["error"] && result["error"]["code"] != null) {
            console.error(result["error"]["message"])
            return new Error("Erreur lors de l'insertion d'un nouvel utilisateur : " + result["error"]["message"]);
        }
        this.lastConnection = now

    }
}

export class Chart {
    user_id
    type
    name
    created
    path_html
    path_pdf
    path_png
    path_svg

    constructor() {
        this.user_id = null
        this.type = null
        this.name = null
        this.created = null
        this.path_html = null
        this.path_pdf = null
        this.path_png = null
        this.path_svg = null
    }

    async delete() {
        const result = await excuteQuery({
            query: 'DELETE FROM `charts` WHERE name=? AND user_id=?',
            values: [this.name, this.user_id],
        });
        if (result && result["error"] && result["error"]["code"] != null) {
            console.error(result["error"]["message"])
            return new Error("Erreur lors de la suppression du chart : " + result["error"]["message"]);
        }
        delete this

    }

    async load({ email, id = null, created = null, type = null, name = null, path_html = null, path_pdf = null, path_png = null, path_svg = null }) {
        if (id != null) {
            this.id = id
            this.user_id = email
            this.type = type
            this.name = name
            this.created = created
            this.path_html = path_html
            this.path_pdf = path_pdf
            this.path_png = path_png
            this.path_svg = path_svg
        }
        return this
    }
    async create(email, type, name, path_html, path_pdf, path_png, path_svg) {
        const result = await excuteQuery({
            query: 'INSERT INTO charts (user_id,type,name,created,path_html,path_pdf,path_png,path_svg) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
            values: [email, type, name, new Date().toISOString(), path_html, path_pdf, path_png, path_svg],
        });

        // console.log("new Chart", result)
        if (result && result["error"] && result["error"]["code"] != null) {
            return new Error("Erreur lors de l'insertion d'un nouvel utilisateur : " + result["error"]["message"]);
        }


        return this
    }

}