import type { ChartData, ChartResponse } from "@/types/chart"
import type { FilterInput } from "@/types/filter"
import { EmployeeRepository } from "../employee/employeeRepository"

export class ChartService {
    constructor(private employeeRepository: EmployeeRepository) { }

    async getEmployeeCountByDepartment(filters: FilterInput): Promise<ChartResponse> {
        const employees = await this.employeeRepository.findByFilters(filters)
        const counts: Record<string, number> = {}

        employees.forEach(employee => { counts[employee.department] = (counts[employee.department] || 0) + 1 })

        const labels = Object.keys(counts)
        const data = Object.values(counts)

        return {
            data: { labels, datasets: [{ label: 'Employee Count', data }] },
            metadata: {
                totalRecords: employees.length,
                appliedFilters: filters,
                generatedAt: new Date().toISOString(),
                chartType: 'bar'
            }
        }
    }

    async getDepartmentGrowthTrends(filters: FilterInput): Promise<ChartResponse> {
        const employees = await this.employeeRepository.findByFilters(filters)

        interface MonthInfo {
            label: string
            date: Date
        }

        // Generate monthly data for the last 12 months
        const months: MonthInfo[] = []
        const now = new Date()
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            months.push({
                label: date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' }),
                date: date
            })
        }

        const departments = [...new Set(employees.map(employee => employee.department))]
        const datasets = departments.map((dept, index) => {
            const deptEmployees = employees.filter(employee => employee.department === dept)
            const monthlyCounts = months.map(month => {
                const nextMonth = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 1)
                return deptEmployees.filter(employee =>
                    employee.hireDate >= month.date && employee.hireDate < nextMonth
                ).length
            })

            const colors = [
                '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
                '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
            ]

            return {
                label: dept,
                data: monthlyCounts,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + '20',
                tension: 0.3,
                fill: false
            }
        })

        const chartData: ChartData = {
            labels: months.map(month => month.label),
            datasets: datasets
        }

        return {
            data: chartData,
            metadata: {
                totalRecords: employees.length,
                appliedFilters: filters,
                generatedAt: new Date().toISOString(),
                chartType: 'line'
            }
        }
    }
}