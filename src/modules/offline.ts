if(navigator.serviceWorker) {
    /* const worker =  */location.port != '3300'
    ? navigator.serviceWorker.register(new URL('/sw.js', import.meta.url).href)
    : null
    
    navigator.serviceWorker.onmessage = e => {
        if(e.data == 'update') {
            location.reload()
        }
    }
    
    const update = async () => {
        if(!navigator.onLine) {
            console.warn('%cCannot update caches while offline!', 'color: orange');
            return
        }
        navigator.serviceWorker.controller?.postMessage('update')
    }
    (window as any).updateCaches = update
}