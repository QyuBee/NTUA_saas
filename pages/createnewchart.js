import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { getUser } from '@/lib/db';
import { UserDB } from '@/lib/db_model';
import axios from 'axios';


export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const userDB = await getUser(session.user.email)

    return {
        props: {
            userDB: JSON.stringify(userDB),
        },
    }
}

export default function CreateChartPage({ userDB }) {
    let { data, status, update } = useSession();
    const router = useRouter();
    const [file, setFile] = useState(null);
    let Page;

    if (status === 'loading') return <h1> loading... please wait</h1>;

    userDB = JSON.parse(userDB)

    if (userDB != null) {
        const user = new UserDB()
        user.init(userDB)
        // console.log(user)

    }
    const style = ` /* Popup container */
    .popup {
        position: relative;
    display: inline-block;
    cursor: pointer;
    }

    /* The actual popup (appears on top) */
    .popup .popuptext {
        visibility: hidden;
    width: 160px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -80px;
    }

    /* Popup arrow */
    .popup .popuptext::after {
        content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
    }

    /* Toggle this class when clicking on the popup container (hide and show the popup) */
    .popup .show {
        visibility: visible;
    -webkit-animation: fadeIn 1s;
    animation: fadeIn 1s
    }

    /* Add animation (fade in the popup) */
    @-webkit-keyframes fadeIn {
        from {opacity: 0;}
    to {opacity: 1;}
    }

    @keyframes fadeIn {
        from {opacity: 0;}
    to {opacity:1 ;}
    } `;


    // One liner function:
    const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML = css;

    // Usage: 
    addCSS(style)

    const UPLOAD_ENDPOINT = "/api/chart/parsecsv";
    const DOWNLOAD_ENDPOINT = "/api/chart/downloadtemplate";
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(file)
        //if await is removed, console log will be called before the uploadFile() is executed completely.
        //since the await is added, this will pause here then console log will be called
        const formData = new FormData();
        formData.append("myfile", file, file.name);
        axios.post(UPLOAD_ENDPOINT, formData, {
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then(data => {
            console.log(data.data);
        });
    };

    const handleOnChange = e => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    };

    const DownloadFile = (type) => {
        axios.post(DOWNLOAD_ENDPOINT, {type:type})
        .then(response => {
          // Manipulez la réponse du serveur
          // Dans ce cas, nous allons télécharger le fichier
          const filename = response.headers['content-disposition'].split('filename=')[1];
          const csvFile = response.data;
      
          // Créez un lien de téléchargement pour le fichier
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(new Blob([csvFile]));
          downloadLink.setAttribute('download', filename);
      
          // Ajoutez le lien de téléchargement à la page
          document.body.appendChild(downloadLink);
      
          // Cliquez sur le lien pour lancer le téléchargement
          downloadLink.click();
        })
        .catch(error => {
          // Gérez les erreurs de la requête
          console.error(error);
        });
    }

    return (
        <div>
            <Header></Header>
            <div class="popup" onclick="myFunction()">Click me!
                <span class="popuptext" id="myPopup">ERROR</span>
            </div>

            <button onClick={() => { router.push('/mycharts'); }}>cancel</button>
            <button onClick={() => {
                //traitement
                const error = false;
                if (error) {
                    router.push('/newchartdone');
                } else {
                    var popup = document.getElementById("myPopup");
                    popup.classList.toggle("show");

                    // router.push('/errorcreatingchart');
                }
            }}>new chart</button>



            {/* // We pass the event to the handleSubmit() function on submit. */}
            <form onSubmit={handleSubmit}>
                <h3>Select your files</h3>
                <input
                    type="file"

                    // To select multiple files
                    //multiple="multiple"
                    onChange={(e) => handleOnChange(e)}
                />

                <button>
                    Send Files
                </button>

                
            <button type="button" onClick={()=>{DownloadFile("bar")}}>Download bar</button>
            <button type="button" onClick={()=>{DownloadFile("bar")}}>Download bar</button>
            <button type="button" onClick={()=>{DownloadFile("bar")}}>Download bar</button>

            </form>
        </div>
    );


}
