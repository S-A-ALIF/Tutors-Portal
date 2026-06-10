export const tutorQueryKeys = {
    all: ['tutors'],
    lists: () => [...tutorQueryKeys.all, 'list'],
    list: (filters) => [...tutorQueryKeys.lists(), { filters }],
    details: () => [...tutorQueryKeys.all, 'detail'],
    detail: (id) => [...tutorQueryKeys.details(), id],
};