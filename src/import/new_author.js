import newAuthorVue from "../vue/import/new_author.vue";

export function newAuthorDialog(ysmJson, packDirectory) {
    let newAuthorDialog = new Dialog({
        title: "menu.ysm_utils.load_info_menu.metadata.authors.new",
        cancel_on_click_outside: false,
        width: 600,
        singleButton: true,
        component: {
            data() {
                return {
                    authorDialog: newAuthorDialog,
                    authors: ysmJson["metadata"]["authors"],
                    packDirectory: packDirectory
                };
            },
            components: {
                newAuthorVue: newAuthorVue,
            },
            template: `
                <div>
                    <newAuthorVue :new-author-dialog="authorDialog"
                                  :authors="authors"
                                  :author-index=-1
                                  :pack-directory='packDirectory'/>
                </div>`
        }
    });
    newAuthorDialog.show();
}

export function editAuthorDialog(ysmJson, packDirectory, editAuthor, index) {
    let newAuthorDialog = new Dialog({
        title: "menu.ysm_utils.load_info_menu.metadata.authors.edit",
        cancel_on_click_outside: false,
        width: 600,
        singleButton: true,
        component: {
            data() {
                return {
                    authorDialog: newAuthorDialog,
                    authors: ysmJson["metadata"]["authors"],
                    editAuthor: editAuthor,
                    packDirectory: packDirectory,
                    index: index
                };
            },
            components: {
                newAuthorVue: newAuthorVue,
            },
            template: `
                <div>
                    <newAuthorVue :new-author-dialog="authorDialog"
                                  :authors="authors" :new-author="editAuthor"
                                  :author-index=index
                                  :pack-directory='packDirectory'/>
                </div>`
        }
    });
    newAuthorDialog.show();
}