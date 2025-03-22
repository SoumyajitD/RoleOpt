# Role Mining Application

A comprehensive application for role mining and access management, designed to help administrators analyze user access patterns and define optimal roles.

## Architecture

The application consists of two main parts:

1. **Frontend**: React SPA with Material-UI for the user interface
2. **Backend**: Java Spring Boot API for data processing and role mining

## Features

- **Data Upload**: Upload CSV files with user access data
- **Data Summary**: View summaries of uploaded data
- **Role Mining**: Discover roles based on configurable filters
- **AI Integration**: Get AI-suggested roles based on access patterns
- **Visualization**: View role mining results in tables with details
- **Export**: Download reports as CSV files

## Getting Started

### Prerequisites

- Node.js 14+ and npm for frontend
- Java 11+ and Maven for backend
- Modern web browser

### Running the Backend (Spring Boot)

1. Navigate to the backend directory:
   ```
   cd role-mining-api
   ```

2. Build with Maven:
   ```
   mvn clean package
   ```

3. Run the Spring Boot application:
   ```
   java -jar target/role-mining-0.1.0.jar
   ```

The API will be available at `http://localhost:8080/api/`.

### Running the Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd role-mining-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## File Format

The application expects the following CSV files for upload:

1. **users.csv**: User information
   - Columns: userId, firstName, lastName, ouId

2. **ou.csv**: Organizational unit information
   - Columns: ouId, name, description

3. **applications.csv**: Application information
   - Columns: applicationId, name, description

4. **entitlements.csv**: Entitlement information
   - Columns: entitlementId, name, description, applicationId

5. **assignments.csv**: User access assignments
   - Columns: userId, entitlementId

## API Endpoints

- `POST /api/upload`: Upload data files
- `GET /api/data/summary`: Get data summary
- `POST /api/role-mining/run`: Run role mining with filters
- `GET /api/role-mining/results`: Get role mining results
- `GET /api/role-mining/ai-suggest`: Get AI-suggested roles
- `GET /api/report/download`: Download CSV report

## Technical Stack

- **Frontend**:
  - React
  - Material-UI
  - Axios for API calls
  - PapaParse for CSV parsing

- **Backend**:
  - Spring Boot
  - Spring Data JPA
  - H2 Database (in-memory)
  - Apache Commons CSV
  - Lombok
  - Weka for AI/ML processing 