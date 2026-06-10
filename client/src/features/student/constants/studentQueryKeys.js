export const studentQueryKeys = {
    all: ['students'],
    lists: () => [...studentQueryKeys.all, 'list'],
    list: (filters) => [...studentQueryKeys.lists(), { filters }],
    details: () => [...studentQueryKeys.all, 'detail'],
    detail: (id) => [...studentQueryKeys.details(), id],
};