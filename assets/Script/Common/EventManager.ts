/**
 * 事件
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class EventManager {

    /**
     * 注册事件
     * 
     * @param type 
     * @param callback 
     * @param target 
     */
    static on(type, callback, target?) {
        if (typeof type == 'object') {
            for (let k in type) {
                cc.systemEvent.on(k + '', type[k], target);
            }
        } else {
            cc.systemEvent.on(type + '', callback, target);
        }
    }

    /**
     * 取消注册事件
     * 
     * @param type 
     * @param callback 
     * @param target 
     */
    static off(type, callback, target?) {
        if (typeof type == 'object') {
            for (let k in type) {
                cc.systemEvent.off(k + '', type[k], target);
            }
        } else {
            cc.systemEvent.off(type + '', callback, target);
        }
    }

    /**
     * 发送事件
     * 
     * @param message
     * @param detail 
     */
    static emit(message, detail?) {
        cc.systemEvent.emit(message + '', detail);
    }

}