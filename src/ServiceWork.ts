/**
 * @Author 蕭立品
 * @Description 註冊 service work
 * @Date 2022-04-28 下午 02:35
 * @Version 1.0
 */

namespace SW {
    // @ts-ignore
    export class ServiceWork {

        /**
         * 獲取 sw.js 預設的相對路徑
         * @returns {string}
         * @private
         */
        private static getDefaultURL() {
            return `../../sw.js`
        }

        /**
         * 註冊ServiceWork
         * @param {string} url - 可強制給予位置
         * @param scope
         * @returns {Promise<void>}
         */
        static async register(url?: string, scope?: string): Promise<void> {

            if (!url) {
                url = this.getDefaultURL();
                scope = "./";
            }

            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register(url, {scope: scope});
                    console.log("service worker can work : working....");
                } catch (e) {
                    console.log('service worker can not work | error: 000', e);
                }
            } else {
                console.log('service worker can not work | error : 001');
            }
        }
    }
}

/**
 * 全域方法
 * @type {SW}
 */
globalThis["SW"] = SW;
SW.ServiceWork.register().then();
