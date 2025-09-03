import type { FilterInput } from '@/types/chart'
import { EmployeeRepository } from '../repositories/employeeRepository'

export class FilterService {
    constructor(private employeeRepository: EmployeeRepository) { }

    validateFilters(filters: FilterInput) {
        const errors: string[] = []

        if (filters.dateFrom && filters.dateTo) {
            if (new Date(filters.dateFrom) > new Date(filters.dateTo)) {
                errors.push('Start date cannot be after end date')
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    async getFilterOptions() {
        return await this.employeeRepository.getFilterOptions()
    }
}