# Speedy Labs Assignment

Live Demo: [https://speedy-labs-assignment.netlify.app/](https://speedy-labs-assignment.netlify.app/)

## Run the project

### Dev Mode

1. Install dependencies:

```bash
npm install
```

2. Run the project:

```bash
npm run dev
```

## Production

1. Build the project:

```bash
npm run build
```

2. Run the production server:

```bash
npm run start
```

## Completed Tasks

- [x] Added Key Metrices (Total Users, Active Users, Total Streams, Total Revenue, Top Artist)
- [x] Added Charts for Data Visualization (User Growth, Revenues, Top Streams)
- [x] Added Data Table for Recent Streams (with server-side pagination)
- [x] Added page level date filter which affects all data and charts

## Unfinished Tasks

- [ ] No routing implementation
- [ ] Search, Filter and Sorting (server-side) implementation in Data Table
- [ ] Tests are not implemented

## Technologies Used

Javascript Framework - Vite with React and Typescript
UI Framework - shadcn/ui
CSS Library - TailwindCSS
State Management Library - Zustand
Data Fetching Library - React Query with axios
Data Mocking Library - Mock Service Worker (MSW)

## Thought Process

1.  Why use MSW?
    When searching for a mock api library I had a few requirements in mind:

    - should take json as input
    - should be able to mock rest api
    - should have the ability to somehow transform the json data

    JSON Server-
    Pros:

    - takes json as input
    - can mock rest apis

    Cons:

    - cannot transform the json data
    - cannot mock complex api
    - need to run the mock server separately (might cause issues when deployed to vercel/netlify)

    MirageJS-
    Pros:

    - can transform the json data
    - can mock complex api
    - can mock rest api

    Cons:

    - not easy to setup
    - has a learning curve

    MSW-
    Pros:

    - takes json as input
    - can mock rest api
    - can transform the json data
    - doesn't need to run a separate server

    Cons:

    - breaks hot reloading in dev mode when using vite (works nicely in nextjs and has a active [issue](https://github.com/mswjs/msw/issues/2401) on fixing it in vite)

    Based on the above observations, MSW was the best fit for the project.

2.  Why so many unfinished tasks?
    I had a lot of fun working on this assignment. However, I had to cut some corners due to time constraints. I focused on implementing the core functionalities and making the UI look good. I originally planned to implement the search, filter and sorting in the data table and I really wanted to do everything server-side. However, it would have taken me a lot more time to read the docs and implement it as the process is not quite straightforward. I also had to figure out how the shadcnui library can integrate with the react query for all these server-side functionalities.
