import { procedure, router } from "../trpc";

export const userRouter = router({
    getUsers: procedure.query(() => {
        return [
            { id: 1, name: "John Doe" },
            { id: 2, name: "Jane Smith" },
            { id: 3, name: "Alice Johnson" }
        ];
    })
})