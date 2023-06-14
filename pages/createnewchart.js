import  Header  from './static/header';
import  ErrorPage  from './errorcreatingchart';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function CreateChartPage() {
    const { status } = useSession();
    const router = useRouter();

    if (status === 'loading') return <h1> loading... please wait</h1>;

    return (
        <div>
            <Header></Header>
            <ErrorPage></ErrorPage>
            <button onClick={() => { router.push('/mycharts'); }}>cancel</button>
            <button onClick={() => {
                //traitement
                const uploadable=false;
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
