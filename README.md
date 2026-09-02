# Expense Tracker

A full-stack expense tracking application with an interactive analytics dashboard, built with React and Django REST Framework.

The application allows users to securely manage personal expenses, explore spending patterns over time, and analyse their spending across categories through a responsive dashboard.

## Live Demo

[View Live Application](https://expense-frontend-tau-eight.vercel.app/)

> The backend is hosted on Render and may take a short time to wake up after a period of inactivity.

## Features

### Expense Management

- Create, edit, and delete expenses
- Categorise transactions
- Search expenses by name
- Filter transactions by category
- Paginated transaction history
- Created and last-updated timestamps

### Dashboard Analytics

- Total spending across all transactions
- Total transaction count
- Top spending category
- Current-month spending
- Spending breakdown by category
- Interactive spending trend visualisation
- Daily spending view for the last 30 days
- Monthly spending view for the last 12 months
- Zero-spend periods included for consistent time-series analysis

### Authentication & Data Isolation

- User registration and login
- Token-based authentication
- User-specific expense data
- Protected API endpoints
- Users can only access and modify their own transactions

### Responsive Interface

- Responsive dashboard layout
- Dark/light theme support
- Interactive charts and transaction controls
- Custom confirmation flow for destructive actions

## Tech Stack

### Frontend

- React
- Vite
- Axios
- CSS

### Backend

- Django
- Django REST Framework
- PostgreSQL
- Token Authentication

### Deployment

- Vercel — frontend
- Render — backend and PostgreSQL

## Architecture

The frontend communicates with a REST API built using Django REST Framework.

The application separates transaction browsing from dashboard analytics:

- **Transaction data** is paginated and can be searched or filtered.
- **Analytics data** is aggregated across the user's complete expense history, preventing pagination from affecting dashboard statistics and charts.

This allows the transaction list to remain efficient while ensuring dashboard metrics represent the complete dataset.

## Backend Repository

[expense-api](https://github.com/xuannhi-tran/expense-api)

## Running Locally

### Frontend

```bash
git clone https://github.com/xuannhi-tran/expense-frontend.git
cd expense-frontend
npm install
npm run dev
```

### Backend

Clone the backend repository and follow its setup instructions:

```bash
git clone https://github.com/xuannhi-tran/expense-api.git
```

The frontend requires the Django API to be running and configured as its API base URL.
