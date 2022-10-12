//頂部打包URL
const TOP_URL = "C:\\xampp\\htdocs\\games\\";

//遊戲資料夾名稱
// const GAME_URL = "game407/"

var md5 = require('md5');

/**
 * 設定檔
 */
module.exports = {
    // importScripts: ['./lib/workbox-sw.js'],                          //自訂義加載js
    clientsClaim: true,													//(需同時開)只要 sw.js更新過,用戶的sw.js會強制更新
    skipWaiting: true,													//(需同時開)只要 sw.js更新過,用戶的sw.js會強制更新
    // mode: 'development',                                             //debug 模式
    // globDirectory: `${TOP_URL}`,                                     //頂部資料夾位置
    // manifestTransforms: [                                            //自定義修改靜態資源url位置
    //     function (manifestEntries) {
    //         const manifest = manifestEntries.map((entry) => {
    //             if (!entry.url.startsWith('lib/')) {
    //                 entry.url = `${entry.url}`;
    //             }else if(entry.url.startsWith('lib/')){
    //                 entry.url = `${entry.url}`;
    //             }
    //             return entry;
    //         })
    //         const warnings = [];
    //         return {manifest,warnings};
    //     }
    // ],
    globPatterns: [                                             //透過root資料夾底下匹配的靜態資源
        // `**/*.{plist,json,png,jpg,mp3}`,
        // `lib/engine/**/*.js`,
        // `lib/for1X/**/*.{js,css,png,jpg,ico,gif}`,
    ],

    swDest: `../dist/sw.js`,                                    //打包後資源名稱
    // swSrc: `./sw-config2.js`,

    runtimeCaching: [{                                          //動態外部資源設定
        urlPattern: new RegExp(/^https:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*.(?:js|css|plist|json|png|jpg|mp3|ico|php))/),
        handler: 'CacheFirst',                  // cache策略
        options: {
            cacheName: "asset",
            expiration: {
                maxAgeSeconds: 24 * 60 * 60 * 30, // 30 day
            },
            fetchOptions: {
                mode: 'cors',
                credentials: 'omit',
            },
            matchOptions: {
                ignoreSearch: true,
            },
        }
    }],
};

class WorkConfig {
    /**
     * 亂數加密
     * @returns {*}
     */
    static getMD5() {
        const time = new Date().getTime();
        let encryption = md5(`${time}`);
        if (encryption.length > 4) {
            encryption = encryption.slice(encryption.length - 4);
        }
        return encryption;
    }

    /**
     * 獲取當前CDN位置
     * @returns {string|string}
     */
    static getGameRootURl() {
        return window.libraryPath && window.libraryPath !== "" ? window.libraryPath + '/' : '';
    }
}
