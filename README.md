# SchoolWise - School Administration Dashboard

SchoolWise is a comprehensive, modern web application designed to streamline school administration. It provides administrators with the tools they need to manage students, classes, financials, attendance, and exams efficiently. The dashboard offers a centralized overview of key metrics, while AI-powered features provide intelligent insights and reporting.

This project is built with a modern tech stack and serves as a powerful starter kit for developing sophisticated school management systems.

## Features

- **Dashboard**: An at-a-glance overview of key school metrics, including revenue trends, expense breakdowns, attendance summaries, and exam performance.
- **Student Management**: A complete CRUD (Create, Read, Update, Delete) interface for managing student records, including personal details and parent/guardian information.
- **Class Management**: Allows for the creation and organization of classes for different academic years. Includes search and filtering capabilities.
- **Academic Year Management**: A dedicated section for adding and managing academic years.
- **Attendance Tracking**:
    - **Mark Attendance**: An intuitive interface for marking daily attendance for each student in a class.
    - **Attendance Reports**: Generate and view detailed attendance reports with visual charts and filterable data.
- **Exam Management**:
    - **Grade Entry**: A streamlined process for entering student marks by class and subject.
    - **Exam Reports**: Generate comprehensive exam reports by student or by class, with options to download and print.
- **Financials**:
    - **Fee Structure**: Define and manage different fee categories for the school.
    - **Invoice Generation**: Create and manage invoices for students or entire classes.
    - **Payment Processing**: Record and track payments made by students.
    - **Financial Reports**: Generate detailed financial reports, including income statements and payment summaries.
- **AI-Powered Reporting**: An intelligent report generation tool that uses generative AI to create custom reports based on natural language criteria.
- **Responsive Design**: A fully responsive interface that works seamlessly on desktops, tablets, and mobile devices.
- **Theming**: Supports both light and dark modes.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## Project Structure

The project follows a standard Next.js App Router structure.

```
.
├── src
│   ├── app/                # Main application routes
│   │   ├── (page-name)/    # Folder for each page/route
│   │   └── layout.tsx      # Root layout
│   │   └── page.tsx        # Dashboard/Home page
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── dashboard/      # Components specific to the dashboard
│   │   └── layout/         # Layout components like the sidebar
│   ├── lib/                # Utility functions and libraries
│   ├── hooks/              # Custom React hooks
│   └── ai/                 # Genkit AI flows and configuration
│       ├── flows/
│       └── genkit.ts
├── tailwind.config.ts      # Tailwind CSS configuration
└── next.config.ts          # Next.js configuration
```

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository** (if applicable) or ensure you are in the project directory.

2.  **Install dependencies**:
    Open your terminal and run the following command to install all the necessary packages:

    ```bash
    npm install
    ```

### Running the Development Server

Once the dependencies are installed, you can start the development server:

```bash
npm run dev
```

This will start the application on `http://localhost:9002`. You can now open this URL in your web browser to see the application.

## Core Concepts

### UI and Styling

The user interface is built using **ShadCN UI**, a collection of reusable components built on top of Radix UI and Tailwind CSS. This allows for rapid development of a consistent and accessible UI. The styling is primarily handled by **Tailwind CSS**, with a theme defined in `src/app/globals.css`.

### State Management

For client-side state management, the application primarily uses React's built-in hooks (`useState`, `useMemo`, `useCallback`). For more complex form state, `react-hook-form` is used for performance and validation.

### AI-Powered Features

The intelligent report generation feature is powered by **Genkit**, Google's open-source framework for building AI-powered applications. The flow for this is defined in `src/ai/flows/generate-custom-report.ts`, which orchestrates the call to the underlying generative model.
