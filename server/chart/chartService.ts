import type {
    DatasetResponse,
    DepartmentGrowthDataset,
    EmployeeCountDataset,
} from "@/types/chart"
import type { FilterInput } from "@/types/filter"
import { EmployeeRepository } from "../employee/employeeRepository"

export class ChartService {
    constructor(private employeeRepository: EmployeeRepository) { }

    /**
     * Get employee counts grouped by department.
     * Returns raw domain data, not Chart.js formatted.
     */
    async getEmployeeCountByDepartment(
        filters: FilterInput
    ): Promise<DatasetResponse<EmployeeCountDataset>> {
        const employees = await this.employeeRepository.findByFilters(filters)

        const counts: Record<string, number> = {}
        employees.forEach((employee) => {
            counts[employee.department] = (counts[employee.department] || 0) + 1
        })

        const data: EmployeeCountDataset[] = Object.entries(counts).map(
            ([department, count]) => ({
                department,
                count,
            })
        )

        return {
            data,
            metadata: {
                totalRecords: employees.length,
                appliedFilters: filters,
                generatedAt: new Date().toISOString(),
            },
        }
    }

    /**
     * Get department growth trends over the last 12 months.
     * Returns raw domain data for frontend transformation.
     */
    async getDepartmentGrowthTrends(
        filters: FilterInput
    ): Promise<DatasetResponse<DepartmentGrowthDataset>> {
        const employees = await this.employeeRepository.findByFilters(filters)

        // Generate last 12 months
        const months: { key: string; start: Date; end: Date }[] = []
        const now = new Date()
        for (let i = 11; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1)
            const key = start.toISOString().slice(0, 7) // YYYY-MM
            months.push({ key, start, end })
        }

        const data: DepartmentGrowthDataset[] = []

        const departments = [...new Set(employees.map((e) => e.department))]
        for (const dept of departments) {
            for (const month of months) {
                const count = employees.filter(
                    (e) =>
                        e.department === dept &&
                        e.hireDate >= month.start &&
                        e.hireDate < month.end
                ).length

                data.push({
                    month: month.key,
                    department: dept,
                    employees: count,
                })
            }
        }

        return {
            data,
            metadata: {
                totalRecords: employees.length,
                appliedFilters: filters,
                generatedAt: new Date().toISOString(),
            },
        }
    }
}