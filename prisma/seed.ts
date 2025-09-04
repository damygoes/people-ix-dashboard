import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    await prisma.employee.deleteMany()
    await prisma.department.deleteMany()
    await prisma.location.deleteMany()

    // Seed departments
    const departments = [
        { name: 'Engineering', description: 'Software development and technical operations' },
        { name: 'Sales', description: 'Revenue generation and client acquisition' },
        { name: 'Marketing', description: 'Brand management and lead generation' },
        { name: 'HR', description: 'Human resources and talent management' },
        { name: 'Finance', description: 'Financial planning and analysis' },
        { name: 'Operations', description: 'Business operations and process management' },
        { name: 'Product', description: 'Product strategy and management' },
    ]

    await prisma.department.createMany({
        data: departments,
    })

    // Seed locations
    const locations = [
        { name: 'New York', country: 'USA', timezone: 'America/New_York' },
        { name: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles' },
        { name: 'London', country: 'UK', timezone: 'Europe/London' },
        { name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
        { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
        { name: 'Remote', country: 'Global', timezone: 'UTC' },
    ]

    await prisma.location.createMany({
        data: locations,
    })

    // Seed employees
    const departmentNames = departments.map(d => d.name)
    const locationNames = locations.map(l => l.name)
    const employees = []

    for (let i = 1; i <= 1200; i++) {
        const hireDate = new Date(2025 + Math.random() * 4, Math.floor(Math.random() * 12), Math.floor(Math.random() * 31))

        employees.push({
            name: `Employee ${i}`,
            email: `employee${i}@peopleix.com`,
            department: departmentNames[Math.floor(Math.random() * departmentNames.length)],
            location: locationNames[Math.floor(Math.random() * locationNames.length)],
            hireDate,
            salary: 50000 + Math.random() * 150000,
            performance: Math.random() * 4 + 1, // 1-5 rating
        })
    }

    await prisma.employee.createMany({
        data: employees,
    })

    console.log(`✅ Seeded ${employees.length} employees`)
    console.log(`✅ Seeded ${departments.length} departments`)
    console.log(`✅ Seeded ${locations.length} locations`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seed error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
