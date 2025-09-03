import { prisma } from '@/prisma/db'
import type { FilterInput } from '@/types/chart'

export class EmployeeRepository {
    async findByFilters(filters: FilterInput) {
        const whereClause: any = {}

        if (filters.dateFrom || filters.dateTo) whereClause.hireDate = {}
        if (filters.dateFrom) whereClause.hireDate.gte = new Date(filters.dateFrom)
        if (filters.dateTo) whereClause.hireDate.lte = new Date(filters.dateTo)
        if (filters.department?.length) whereClause.department = { in: filters.department }
        if (filters.location?.length) whereClause.location = { in: filters.location }

        return await prisma.employee.findMany({
            where: whereClause,
            select: { id: true, department: true, location: true, hireDate: true, salary: true, performance: true }
        })
    }

    async getFilterOptions() {
        const [departments, locations, dateRange] = await Promise.all([
            prisma.employee.groupBy({ by: ['department'], orderBy: { department: 'asc' } }),
            prisma.employee.groupBy({ by: ['location'], orderBy: { location: 'asc' } }),
            prisma.employee.aggregate({ _min: { hireDate: true }, _max: { hireDate: true } })
        ])

        return {
            departments: [{ value: 'all', label: 'All Departments' }, ...departments.map(d => ({ value: d.department, label: d.department }))],
            locations: [{ value: 'all', label: 'All Locations' }, ...locations.map(l => ({ value: l.location, label: l.location }))],
            dateRange: {
                min: dateRange._min.hireDate?.toISOString().split('T')[0] ?? '',
                max: dateRange._max.hireDate?.toISOString().split('T')[0] ?? ''
            }
        }
    }

    async getDepartmentCounts(filters: FilterInput) {
        const whereClause: any = {}

        if (filters.dateFrom || filters.dateTo) {
            whereClause.hireDate = {}
            if (filters.dateFrom) whereClause.hireDate.gte = new Date(filters.dateFrom)
            if (filters.dateTo) whereClause.hireDate.lte = new Date(filters.dateTo)
        }

        if (filters.location && Array.isArray(filters.location) && !filters.location.includes('all')) {
            whereClause.location = { in: filters.location }
        }

        return await prisma.employee.groupBy({
            by: ['department'],
            where: whereClause,
            _count: { id: true },
            orderBy: { department: 'asc' }
        })
    }
}