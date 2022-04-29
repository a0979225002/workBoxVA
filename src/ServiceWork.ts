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
         * 註冊ServiceWork
         * @returns {Promise<void>}
         */
        static async register(url:string): Promise<void> {
            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register(url);
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
