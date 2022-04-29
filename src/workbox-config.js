//頂部打包URL
const TOP_URL = "C:\\xampp\\htdocs\\games\\";

//遊戲資料夾名稱
const GAME_URL = "game407/"

var md5 = require('md5');

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
}

/**
 * 設定檔
 */
module.exports = {
    clientsClaim:true,													//(需同時開)只要 sw.js更新過,用戶的sw.js會強制更新
    skipWaiting: true,													//(需同時開)只要 sw.js更新過,用戶的sw.js會強制更新
    globDirectory: `${TOP_URL}`,

    manifestTransforms: [
        function (manifestEntries) {
        const manifest = manifestEntries.map((entry) => {
                if (!entry.url.startsWith('lib/')) {
                    entry.url = `../../../../${entry.url}`;
                }else if(entry.url.startsWith('lib/')){
                    entry.url = `../../../../${entry.url}`;
                }
                return entry;
            })
            const warnings = [];
            return {manifest,warnings};
        }
    ],
    globPatterns: [
        `${GAME_URL}**/*.{plist,json,png,jpg,mp3}`,
        `lib/engine/**/*.js`,
        `lib/for1X/**/*.{js,css,png,icon,gif}`,
        `lib/OutsideResources/**/*.{js,plist,json,jpg,png,mp3}`
    ],

    swDest: `../dist/sw.${WorkConfig.getMD5()}.js`,
    // //特殊設定
    runtimeCaching: [{
        handler: 'CacheFirst',                  // cache策略
    }],
};
