importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.5.2/workbox-sw.js");

// 底下這一行在 TypeScript 裡面需要仰賴我等一下會提到的定義檔
const { strategies, routing, googleAnalytics, broadcastUpdate, precaching } = workbox;

//注入黨
const precacheManifest = [];

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(precacheManifest);

// 啟動 Workbox GA；GA 當然也很重要，下次再提
// 基本上只要加上這一行，就可以讓 GA 即使在離線狀態下也持續收集使用者行為，
// 並且在下次連線的時候送出這些行為數據
googleAnalytics.initialize();

// 預設的資源都使用靜態更新策略
let defaultHandler = new strategies.StaleWhileRevalidate({
    cacheName: 'assets',
    // 這邊是我自己要用到的客製化需求
    plugins: [new broadcastUpdate.BroadcastUpdatePlugin({
        generatePayload: options => ({ path: new URL(options.request.url).pathname })
    })]
});
routing.setDefaultHandler(defaultHandler);

// 啟動 workbox-precaching
const precacheController = new precaching.PrecacheController({ cacheName: "assets" });
precacheController.addToCacheList(self.__WB_MANIFEST);
// self.__WB_MANIFEST 會被換成 manifest；其定義在 workbox-precaching 模組中

// 更靈活的作法關鍵就是自己宣告底下這個東西，然後就可以用一樣的選項參數了
const precacheRoute = new precaching.PrecacheRoute(precacheController, {
    ignoreURLParametersMatching: [/.*/],
    directoryIndex: 'index.htm', // 我是老人，副檔名習慣三個字
    cleanURLs: false
});
routing.registerRoute(precacheRoute);

// 在這邊註冊一些我自己的 route，例如，
// 我要除了 precache 之外的 Markdown 檔案都採用網路優先策略
routing.registerRoute(
    ({ url }) => url.pathname.endsWith(".md"),
    new strategies.NetworkFirst({
        // 請瀏覽器不要使用快取；基本上必須加上這個選項才會是真正的 NetworkFirst，
        // 否則視 HTTP cache-control 而定，瀏覽器還是有可能會直接傳回它自己的快取
        fetchOptions: { cache: 'reload' },
        cacheName: 'assets'
    })
);

// 其它的一些我自訂的 route...

self.addEventListener('install', event => {
    skipWaiting();
    precacheController.install(event);
});

self.addEventListener('activate', event => {
    precacheController.activate(event);
});
