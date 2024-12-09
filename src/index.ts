import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    IModel,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    openMobileFileById,
    lockScreen,
    ICard,
    ICardData
} from "siyuan";
import "@/index.scss";
import { deleteBlock, sql, removeDoc } from "./api";
import SettingExample from "@/setting-example.svelte";

import { SettingUtils } from "./libs/setting-utils";
import { svelteDialog } from "./libs/dialog";

const STORAGE_NAME = "config";

export default class PluginSample extends Plugin {

    private settingUtils: SettingUtils;

    async onload() {
        this.eventBus.on("open-menu-blockref", this.deleteMemo.bind(this)); // 注意：事件回调函数中的 this 指向发生了改变。需要bind
        this.eventBus.on("open-menu-link", this.deleteMemo.bind(this)); // 注意：事件回调函数中的 this 指向发生了改变。需要bind
    }

    onLayoutReady() {

    }

    async onunload() {
        console.log("onunload");
    }

    uninstall() {
        console.log("uninstall");
    }


    private deleteMemo = async ({ detail }: any) => {
        if (detail.element) {
            const dataId = detail.element.getAttribute("data-id");
            const dataHref = detail.element.getAttribute("data-href");
            if (dataId || (dataHref && dataHref.startsWith("siyuan://"))) {
                detail.menu.addItem({
                    icon: "iconTrashcan",
                    label: "删除块引同时删除块",
                    click: async () => {
                        // Handle legacy format
                        let id;
                        if (dataId) {
                            id = dataId;
                        } else {
                            id = dataHref.match(/blocks\/([^\/]+)/)?.[1];
                        }

                        // Delete blockref
                        detail.element.remove();
                        // Check type using sql
                        const res = await sql(`SELECT * FROM blocks WHERE id = '${id}'`);
                        if (res[0].type !== 'd') {
                            await deleteBlock(id);
                        } else {
                            await removeDoc(res[0].box, res[0].path);
                        }


                    }
                });
            }
        }
    }

}


