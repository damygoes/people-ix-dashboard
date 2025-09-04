import { cn } from "@/lib/utils"
import type { ChartData, ChartType } from "@/types/chart"
import {
    Chart as ChartJS,
    registerables
} from "chart.js"
import React, { useEffect, useRef } from "react"
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

    useEffect(() => {
        if (!canvasRef.current) return

        const config = factoryRef.current.createChart(type, data)

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
    }, [data, type])

    return (
        <div className={cn("relative", className)} style={{ height }}>
            <canvas ref={canvasRef} />
        </div>
    )
}