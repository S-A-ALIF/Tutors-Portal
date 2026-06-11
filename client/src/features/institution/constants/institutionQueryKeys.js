export const institutionQueryKeys = {
    all: ['institutions'],
    lists: () => [...institutionQueryKeys.all, 'list'],
    list: (filters) => [...institutionQueryKeys.lists(), { filters }],
    details: () => [...institutionQueryKeys.all, 'detail'],
    detail: (id) => [...institutionQueryKeys.details(), id],
};