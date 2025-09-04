import type { ChartData, ChartType } from "@/types/chart"
import {
    ChartConfiguration,
    Chart as ChartJS,
    ChartType as ChartJSType,
    ChartOptions,
} from "chart.js"


const baseOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" },
        title: { display: false },
    },
}

export interface ChartConfig {
    type: ChartJSType
    data: ChartData
    options: ChartConfiguration["options"]
}

abstract class ChartStrategy {
    abstract createConfig(data: ChartData): ChartConfig
}

class BarChartStrategy extends ChartStrategy {
    createConfig(data: ChartData): ChartConfig {
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
    createConfig(data: ChartData): ChartConfig {
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
    createConfig(data: ChartData): ChartConfig {
        return {
            type: "pie",
            data,
            options: {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
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

    createChart(type: ChartType, data: ChartData): ChartConfig {
        const strategy = this.strategies[type]
        if (!strategy) {
            throw new Error(`Unsupported chart type: ${type}`)
        }
        return strategy.createConfig(data)
    }

    getSupportedTypes(): ChartType[] {
        return Object.keys(this.strategies) as ChartType[]
    }

    // Allow injecting new strategies (extensibility)
    registerStrategy(type: ChartType, strategy: ChartStrategy) {
        this.strategies[type] = strategy
    }
}

export function registerChartDefaults() {
    ChartJS.defaults.color = "#111"
    ChartJS.defaults.font.family = "Inter, sans-serif"
}