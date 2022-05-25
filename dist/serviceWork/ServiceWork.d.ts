/**
 * @Author 蕭立品
 * @Description 註冊 service work
 * @Date 2022-04-28 下午 02:35
 * @Version 1.0
 */
declare namespace SW {
    class ServiceWork {
        /**
         * 獲取 sw.js 預設的相對路徑
         * @returns {string}
         * @private
         */
        private static getDefaultURL;
        /**
         * 註冊ServiceWork
         * @param {string} url - 可強制給予位置
         * @param scope
         * @returns {Promise<void>}
         */
        static register(url?: string, scope?: string): Promise<void>;
    }
}
