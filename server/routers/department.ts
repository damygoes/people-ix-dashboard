import { PrismaClient } from "@prisma/client";
import { procedure, router } from "../trpc";

const prisma = new PrismaClient();

export const departmentRouter = router({
    getDepartments: procedure.query(() => {
        return prisma.department.findMany();
    })
})