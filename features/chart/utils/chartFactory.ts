import type { ChartData, ChartType } from "@/types/chart"
import { ChartConfiguration } from "chart.js"

const baseOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" },
        title: { display: false },
    },
}

abstract class ChartStrategy {
    abstract createConfig(data: ChartData): ChartConfiguration
}

class BarChartStrategy extends ChartStrategy {
    createConfig(data: ChartData): ChartConfiguration {
        return {
            type: "bar",
            data,
            options: {
                ...baseOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                    },
                },
            },
        }
    }
}

class LineChartStrategy extends ChartStrategy {
    createConfig(data: ChartData): ChartConfiguration {
        return {
            type: "line",
            data,
            options: {
                ...baseOptions,
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                elements: {
                    line: {
                        tension: 0.3,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                    },
                },
            },
        }
    }
}

class PieChartStrategy extends ChartStrategy {
    createConfig(data: ChartData): ChartConfiguration {
        return {
            type: "pie",
            data,
            options: {
                ...baseOptions,
                plugins: {
                    ...baseOptions?.plugins,
                    legend: { position: "right" },
                },
            },
        }
    }
}

export class ChartFactory {
    private readonly strategies: Record<ChartType, ChartStrategy> = {
        bar: new BarChartStrategy(),
        line: new LineChartStrategy(),
        pie: new PieChartStrategy(),
    }

    createChart(type: ChartType, data: ChartData): ChartConfiguration {
        const strategy = this.strategies[type]
        if (!strategy) {
            throw new Error(`Unsupported chart type: ${type}`)
        }
        return strategy.createConfig(data)
    }
}