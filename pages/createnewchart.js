import Header from './static/header';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function CreateChartPage() {
    const { status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;

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

    return (
        <div>
            <Header></Header>
            <script>

            </script>
            <div class="popup" onclick="myFunction()">Click me!
                <span class="popuptext" id="myPopup">ERROR</span>
            </div>

            <button onClick={() => { router.push('/mycharts'); }}>cancel</button>
            <button onClick={() => {
                //traitement
                const uploadable = false;
                if (uploadable) {
                    router.push('/newchartdone');
                } else {
                    var popup = document.getElementById("myPopup");
                    popup.classList.toggle("show");

                    // router.push('/errorcreatingchart');
                }
            }}>new chart</button>
        </div>
    );


}
