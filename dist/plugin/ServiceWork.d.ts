/**
 * @Author 蕭立品
 * @Description 註冊 service work
 * @Date 2022-04-28 下午 02:35
 * @Version 1.0
 */
declare namespace SW {
    class ServiceWork {
        /**
         * 註冊ServiceWork
         * @returns {Promise<void>}
         */
        static register(url: string): Promise<void>;
    }
}
