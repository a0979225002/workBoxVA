
/**
 * 默認構建
 */
export default function build(cb: Function) {
    console.log("建構框架\t", "buildServiceWork");
    cb()
}

export {buildAsset as buildServiceWork} from "./build";
