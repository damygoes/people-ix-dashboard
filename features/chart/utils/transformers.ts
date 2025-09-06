import type { ChartData, DepartmentGrowthDataset, EmployeeCountDataset } from "@/types/chart"

export function transformEmployeeCount(data: EmployeeCountDataset[]): ChartData {
    return {
        labels: data.map(d => d.department),
        datasets: [
            {
                label: "Employee Count",
                data: data.map(d => d.count),
                backgroundColor: "#3b82f6",
            },
        ],
    }
}

export function transformDepartmentGrowth(data: DepartmentGrowthDataset[]): ChartData {
    const months = [...new Set(data.map(d => d.month))].sort()
    const departments = [...new Set(data.map(d => d.department))]

    const datasets = departments.map((dept, i) => {
        const values = months.map(month => {
            const match = data.find(d => d.month === month && d.department === dept)
            return match ? match.employees : 0
        })
        return {
            label: dept,
            data: values,
            borderColor: ["#3b82f6", "#ef4444", "#10b981"][i % 3],
            backgroundColor: ["#3b82f6", "#ef4444", "#10b981"][i % 3] + "20",
            tension: 0.3,
            fill: false,
        }
    })

    return { labels: months, datasets }
}