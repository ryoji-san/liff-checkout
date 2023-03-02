import {useState, useEffect} from 'react'
import liff from '@line/liff'
import './App.css'
import {Grid} from 'react-loader-spinner'


const LIFF_ID = import.meta.env.VITE_LIFF_ID
const GOOGLE_FORMS_URL = import.meta.env.VITE_GOOGLE_FORMS_URL
const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL

const createCheckoutSession = async (payload) => {
    const lineId = payload.line_id
    const idToken = payload.id_token
    const clientReferenceId = payload.ref_id

    const url = `${STRIPE_API_URL}/stripe/create-checkout`
    const options = {
        id_token: idToken,
        client_reference_id: clientReferenceId,
        line_id: lineId
    }
    if (import.meta.env.DEV) window.alert(`チェックアウトメソッドです。${JSON.stringify(options)}`)
    if (import.meta.env.DEV) window.alert(`fetch: ${url}`)
    const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(options)
    })
    const body = await response.json()
    if(import.meta.env.DEV) window.alert(`stripe response: ${JSON.stringify(body)}`)
    return body.session
}

const CheckoutSuccess = (props) => (
    <section>
        <div className="imgBox">
            <img src={`/illust-top-invoice.png`} height="auto" width="80%" className="image-section"/>
        </div>
        <div className="wrapper">
            <a href={`${GOOGLE_FORMS_URL}${props.clientReferenceId}`}
               className="fancy-button bg-gradient1"><span>
                <i className="fa fa-wheelchair-alt"></i>アンケートに回答する</span></a>
        </div>
    </section>
)

const clickLogout = async () => {
    if (import.meta.env.DEV) window.alert(`ログアウトします！`)
    await liff.logout()
}
const isDevelop = () => {
    if (import.meta.env.PROD) return false
    return (
        <div>
            <h1>YOU ARE RUNNING ON DEV.</h1>
            <button onClick={clickLogout}>Logout</button>
        </div>
    )
};


function App() {
    // const [username, setUsername] = useState("Ryoji-kun")
    const [userId, setUserId] = useState(undefined)
    const [idToken, setIdToken] = useState(undefined)
    const [isSent, setIsSent] = useState(undefined)

    const query = new URLSearchParams(window.location.search);
    let status = undefined
    // 決済完了後のリダイレクトの場合はクエリパラメータを取得します。
    if (query.get("stat")) status = query.get('stat')
    let clientReferenceId = undefined
    if (query.get("rid")) clientReferenceId = query.get('rid')

    useEffect(() => {
        (async () => {
            // 決済からの戻りの場合はここで終了する
            if(status === 'true' && clientReferenceId) return
            // 決済完了前のセッションの場合はここから処理を介し
            let ignore = false;
            if (import.meta.env.DEV) window.alert(`１つ目のuseEffect() 動き始めました。`)
            liff
                .init({liffId: LIFF_ID})
                .then(async () => {
                    if (!liff.isLoggedIn()) {
                        if (import.meta.env.DEV) window.alert(`liff.login()起動します。`)
                        if (!ignore) {
                            ignore = true
                            liff.login()
                        }else{
                            return
                        }
                    }
                    if (import.meta.env.DEV) window.alert(`liff.login()完了したのでプロファイルとか取ります。`)
                    if (!ignore) {
                        ignore = true;
                        if (import.meta.env.DEV) window.alert(`setUserId 呼び出します。 ${userId}`)
                        const profile = await liff.getProfile()
                        const idToken = liff.getIDToken()
                        setUserId(profile.userId)
                        setIdToken(idToken)
                    }else{
                        return
                    }
                    if (import.meta.env.DEV) window.alert(`useEffect()①終了します。`)
                })
        })();
    }, [])
    useEffect(() => {
        (async () => {
            if (!userId) return
            if(status === 'true' && clientReferenceId) return
            if (import.meta.env.DEV) window.alert(`２つめのuseEffect() 動き始めました。`)

            if (!status) {
                // チェックアウト画面に遷移させます
                const reference_id = new Date().getTime().toString(16)
                const payload = {
                    id_token: idToken,
                    line_id: userId,
                    ref_id: reference_id
                }
                if (import.meta.env.DEV) window.alert(`チェックアウト画面に遷移します。`)
                const res = await createCheckoutSession(payload)
                if (res) {
                    if (import.meta.env.DEV) window.alert(`チェックアウト画面正常です。画面遷移します: ${res}`)
                    window.location.href = res
                } else {
                    if (import.meta.env.DEV) window.alert(`チェックアウト画面失敗です。ログアウトします。: ${res}`)
                    liff.logout()
                    liff.login()
                }
            }
        })();
    }, [userId])

    if (status === 'true' && clientReferenceId) {
        if(!isSent){
            setIsSent(true)
            if (import.meta.env.DEV) window.alert(`決済完了しましたメッセージ飛ばします: ${clientReferenceId}`)
            liff.sendMessages([{
                type: "text",
                text: `決済が完了しました。決済ID: ${clientReferenceId}`
            }])
        }else{
            if (import.meta.env.DEV) window.alert(`isSent === true なのでメッセージは贈りません。: ${isSent}`)
        }
        return (
            <div className="App">
                <p>決済完了</p>
                <p>決済ID: {clientReferenceId}</p>
                {<CheckoutSuccess clientReferenceId={clientReferenceId}/>}
            </div>
        );
    } else {
        return (
            <div className="App">
                {isDevelop()}
                <div className="my-spinner">
                    <Grid
                        height="80"
                        width="80"
                        color="gray"
                        ariaLabel="loading"
                    />
                </div>
            </div>
        );
    }
}

export default App
