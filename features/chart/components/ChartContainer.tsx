import { cn } from "@/lib/utils"
import type { ChartData, ChartType } from "@/types/chart"
import {
    Chart as ChartJS,
    registerables
} from "chart.js"
import React, { useEffect, useMemo, useRef } from "react"
import { ChartFactory } from "../utils/chartFactory"

// Register Chart.js globally once to side effects and performance issues
ChartJS.register(...registerables)

interface ChartContainerProps {
    data: ChartData
    type: ChartType
    height?: number
    className?: string
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
    data,
    type,
    height = 400,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<ChartJS | null>(null)
    const factoryRef = useRef(new ChartFactory())

    // Placeholder if dataset is empty
    const chartData = useMemo(() => {
        if (!data.labels.length) {
            return {
                ...data,
                labels: ["No Data"],
                datasets: data.datasets.map(ds => ({ ...ds, data: [0] })),
            }
        }
        return data
    }, [data])

    useEffect(() => {
        if (!canvasRef.current) return

        const config = factoryRef.current.createChart(type, chartData)

        if (chartRef.current) {
            chartRef.current.data = config.data!
            chartRef.current.options = config.options!
            chartRef.current.update()
        } else {
            chartRef.current = new ChartJS(canvasRef.current, config)
        }

        return () => {
            chartRef.current?.destroy()
            chartRef.current = null
        }
    }, [chartData, type])

    return (
        <div className={cn("relative", className)} style={{ height }}>
            <canvas ref={canvasRef} />

            {/* No Data Overlay */}
            {data.labels.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">
                    No data available
                </div>
            )}
        </div>
    )
}