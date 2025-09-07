# Interactive Dashboard

An interactive analytics dashboard built with **Next.js, TypeScript, tRPC, Prisma, Zustand, and Chart.js**, as a solution to the PeopleIX case study challenge.

---

## 🏗️ Architecture Overview

### Presentation Layer (Frontend)
- **Views**: React components (ChartCard, ChartContainer, Filters)  
- **View Models**:  
  - Hooks (`useChartData`, `useUrlState`) orchestrate data fetching and state  
  - Transformers convert raw datasets → Chart.js-ready `ChartData`  
  - ChartFactory applies the Strategy Pattern for different chart types  
- **State Management**: Zustand stores for global filters, chart state, and local overrides  

### Application Layer (Backend)
- **tRPC Routers** (`chart`, `filter`) provide type-safe endpoints  
- **Services** (`ChartService`, `FilterService`) implement business logic  
- **Zod Schemas** validate input/output  

### Data Access Layer (Backend)
- **Repositories** (`EmployeeRepository`) encapsulate Prisma queries  
- **Prisma ORM** as the database abstraction  
- **PostgreSQL** as the persistent store  

---

## 📊 Data Flow

1. User updates filters in the UI (global or local).  
2. Zustand updates global/local filter state and syncs it to the URL (**debounced**).  
3. Chart hooks (`useChartData`) merge filters and trigger **tRPC queries**.  
4. Routers → Services → Repositories → Prisma → PostgreSQL.  
5. Backend returns `DatasetResponse<T>` (raw rows + metadata).  
6. Transformers convert datasets into **Chart.js-ready `ChartData`**.  
7. ChartFactory generates the correct **Chart.js config** (bar, line, pie).  
8. ChartContainer renders via **chart.js**.  

---

## ✅ Key Design Choices

- **State Management (Zustand)**  
  - Fine-grained subscriptions → minimal re-renders  
  - Global + local filter hierarchy  

- **Dataset Transformers**  
  - Backend stays focused on raw data  
  - Frontend controls visualization details  

- **Repository Pattern**  
  - Keeps Prisma isolated  
  - Easier to test and extend  

- **ChartFactory (Strategy Pattern)**  
  - Extensible: add new chart types by implementing a new strategy  
  - Clean separation of chart config from chart rendering  

- **Query Persistence**  
  - **Debounce**: prevents excessive URL/history updates on rapid filter changes  
  - **URL sync**: enables shareable and restorable dashboard state  

---

## 🚀 Future Considerations

- Add more chart types (scatter, radar, doughnut).  
- Extend filters (e.g., salary ranges, performance scores).  
- Explore caching or SSR for very large datasets.  