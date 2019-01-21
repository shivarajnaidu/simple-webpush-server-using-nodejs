// Hard-coded, replace with your public key
const publicVapidKey = 'BHLlhNzY9o6z80Wr2Emybcs4amBFR4LCFewMOPwx0Jc1Fl2eA64ZMHGU82hVFMmwk0hEzyE552pCZsPKJnrgypQ';
let subscribePush;

if ('serviceWorker' in navigator) {
    console.log('Registering service worker');

    run().catch(error => console.error(error));
}

async function run() {
    console.log('Registering service worker');
    const registration = await navigator.serviceWorker.
        register('/worker.js', { scope: '/' });
    console.log('Registered service worker');

    // Unsubscribe Old One 
    const oldSubscribtion = await registration.pushManager.getSubscription();

    if (oldSubscribtion) {
        await oldSubscribtion.unsubscribe();
    }

    console.log('Registering push');
    const subscription = await registration.pushManager.
        subscribe({
            userVisibleOnly: true,
            // The `urlBase64ToUint8Array()` function is the same as in
            // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
    console.log('Registered push');

    subscribePush = getSubscriber(subscription);

    // console.log('Sending push');
    // await fetch('/api/subscribe', {
    //     method: 'POST',
    //     body: JSON.stringify(subscription),
    //     headers: {
    //         'content-type': 'application/json'
    //     }
    // });
    // console.log('Sent push');
}


// Subscribe For Push

function getSubscriber(subscription) {

    return async () => {
        console.log('Sending push Subscription');
        await fetch('/api/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });
        console.log('Sent push');
    };

}



// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}