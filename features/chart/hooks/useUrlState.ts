import { useFilterStore } from "@/features/filters/store"
import { useEffect } from "react"

export const useUrlState = () => {
    const loadFiltersFromUrl = useFilterStore((s) => s.loadFiltersFromUrl)
    const saveFiltersToUrl = useFilterStore((s) => s.saveFiltersToUrl)

    useEffect(() => {
        loadFiltersFromUrl()
    }, [loadFiltersFromUrl])

    const generateShareableUrl = () => {
        const url = new URL(window.location.href)
        return url.toString()
    }

    return {
        generateShareableUrl,
        saveFiltersToUrl,
    }
}