// src/server/employee/employeeRepository.ts
import type { FilterInput } from '@/types/filter'
import type { Prisma, PrismaClient } from '@prisma/client'

export class EmployeeRepository {
    constructor(private prisma: PrismaClient) { }

    private buildWhere(filters: FilterInput): Prisma.EmployeeWhereInput {
        const where: Prisma.EmployeeWhereInput = {}

        if (filters.dateFrom || filters.dateTo) {
            where.hireDate = {}
            if (filters.dateFrom) where.hireDate.gte = new Date(filters.dateFrom)
            if (filters.dateTo) where.hireDate.lte = new Date(filters.dateTo)
        }

        if (filters.department?.length) {
            where.department = { in: filters.department }
        }

        if (filters.location?.length) {
            // ignore a sentinel like "all" if you use it in the UI
            const locs = filters.location.filter((l) => l !== 'all')
            if (locs.length) where.location = { in: locs }
        }

        return where
    }

    async findByFilters(filters: FilterInput) {
        const where = this.buildWhere(filters)

        return this.prisma.employee.findMany({
            where,
            select: {
                id: true,
                department: true,
                location: true,
                hireDate: true,
                salary: true,
                performance: true,
            },
        })
    }

    async getFilterOptions() {
        const [departments, locations, dateRange] = await Promise.all([
            this.prisma.employee.groupBy({ by: ['department'], orderBy: { department: 'asc' } }),
            this.prisma.employee.groupBy({ by: ['location'], orderBy: { location: 'asc' } }),
            this.prisma.employee.aggregate({ _min: { hireDate: true }, _max: { hireDate: true } }),
        ])

        return {
            departments: departments.map((d) => ({ value: d.department, label: d.department })),
            locations: locations.map((l) => ({ value: l.location, label: l.location })),
            dateRange: {
                min: dateRange._min.hireDate?.toISOString().split('T')[0] ?? '',
                max: dateRange._max.hireDate?.toISOString().split('T')[0] ?? '',
            },
        }
    }

    async getDepartmentCounts(filters: FilterInput) {
        const where = this.buildWhere(filters)

        return this.prisma.employee.groupBy({
            by: ['department'],
            where,
            _count: { id: true },
            orderBy: { department: 'asc' },
        })
    }
}