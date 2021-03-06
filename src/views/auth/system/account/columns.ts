import {delAdminAccount, patchAdminAccount} from "@/api/system/account";
import {formatDate} from '@/utils/common'
import {TableColumn} from "@/types/tableColumn";
import {useFormModal} from "@/hooks/useFormModal";
import {formSchema} from "./form-schema";

export const columns: TableColumn[] = [ // 账号列表
    {
        title: '用户名',
        dataIndex: 'username',
    },
    {
        title: '所属角色',
        dataIndex: 'roles',
        slots: {
            customRender: 'roles'
        },
        slotsType: 'format',
        slotsFunc: (roles) => roles.map(it => it.title).join(', ')
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        slots: {
            customRender: 'createdAt'
        },
        slotsType: 'format',
        slotsFunc: (val) => formatDate(val)
    },
    {
        title: '最后更新时间',
        dataIndex: 'updatedAt',
        slots: {
            customRender: 'updatedAt'
        },
        slotsType: 'format',
        slotsFunc: (val) => formatDate(val)
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: 200,
        slots: {
            customRender: 'action'
        },
        actions: [
            {
                type: 'popconfirm', // 控制类型，默认为a,可选： select | button | text
                text: '删除',
                permission: { // 权限
                    action: 'delete',
                    effect: 'disabled'
                },
                props: {
                  type: 'danger'
                },
                func: async ({record}, callback) => {
                    await delAdminAccount(record.id)
                    callback()
                },
            },
            {
                type: 'button', // 控制类型，默认为a,可选： select | button | text
                text: '编辑',
                permission: { // 权限
                    action: 'update',
                    effect: 'disabled'
                },
                props: {
                    type: 'warning'
                },
                func: ({record}, refreshTableData) => useFormModal({
                    title: '编辑账号',
                    fields: {...record,roles:record?.roles.map(item => item.id)},
                    hiddenFields: ['password'],
                    formSchema: formSchema,
                    handleOk: async (modelRef, state) => {
                        const {username, password, roles} = modelRef

                        const params = {
                            username,
                            password,
                            roles: roles.toString()
                        }
                        await patchAdminAccount(record.id, params)
                        refreshTableData()
                    }
                })
            }
        ]
    },
]
