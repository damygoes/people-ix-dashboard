# Interactive Dashboard

An analytics dashboard built with **Next.js, TypeScript, tRPC, Prisma, Zustand, and Chart.js**, as a solution to the PeopleIX case study challenge.

## 🏗️ Architecture Overview

- **Presentation Layer**  
  React components, chart containers, and filter UIs. State managed via Zustand for granular subscriptions.  

- **Application Layer**  
  tRPC API with type-safe contracts. Transformers convert backend datasets into Chart.js-ready structures.  

- **Data Access Layer**  
  Repository pattern using Prisma ORM with PostgreSQL backend.  

## 📊 Data Flow

1. User selects filters (global or per-chart).  
2. Zustand syncs filters with URL state for shareability.  
3. Charts fetch raw datasets via tRPC.  
4. Transformers convert raw data into `ChartData` (Chart.js).  
5. ChartFactory applies strategy pattern for rendering chart types.  

## ✅ Design Decisions

- **Zustand over Context/Redux**: minimal re-renders, simpler API.  
- **Transformers**: backend returns datasets, frontend shapes them for flexibility.  
- **Repository Pattern**: clean separation of queries and business logic.  

## 🚀 Future Considerations

- Add more chart types (scatter, radar, doughnut).  
- Extend filters (e.g., salary ranges, performance scores).  
- Introduce caching layers or server-side rendering for large datasets.  