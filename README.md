# Ohio LIHTC GIS Map Application

An AI-enhanced Low-Income Housing Tax Credit (LIHTC) development platform that provides end-to-end site evaluation, underwriting, and strategic analysis for multifamily affordable housing projects.

## 🎯 Project Overview

This application is designed to encapsulate the knowledge of top-tier developers, providing calculated, math-driven insights while maintaining a simple user experience. The platform guides users from initial site identification through detailed underwriting, proprietary scoring, AI-driven strategic advice, and project management.

### Current Status
This repository contains the foundational GIS mapping interface built with React, TypeScript, and modern web technologies. The application is designed to integrate with a comprehensive LIHTC scoring and underwriting engine.

## 🚀 Features

### Core Capabilities
- **Interactive GIS Mapping**: Visual site analysis with geographic overlays
- **Address Geocoding**: Convert addresses to precise coordinates for analysis
- **Real-time Data Integration**: Automated fetching of site and market data
- **Responsive Design**: Modern UI built with Tailwind CSS
- **TypeScript Support**: Type-safe development environment

### Planned Integration Features
- **Automated Data Extraction**: AI-powered extraction from offering memorandums, rent rolls, and financial documents in seconds
- **Rapid Underwriting**: Complete deal analysis from raw files to full underwriting in minutes
- **Proprietary Financial Model**: Built-in LIHTC development proforma with standardized calculations and assumptions
- **Site Evaluation Scoring**: Proprietary HDFLAS, MOFS, and QSVOS algorithms
- **QAP Scoring Engine**: State-specific Qualified Allocation Plan analysis with competitive positioning
- **Deal Pipeline Management**: End-to-end deal tracking from sourcing through closing and asset management
- **Financial Modeling Integration**: Excel plugin capabilities for seamless model population and scenario comparison
- **AI Copilot**: Strategic recommendations and optimization guidance
- **Centralized Data Platform**: Single source of truth for all deal, property, and market data
- **Real-time Analytics**: Automated reporting and dashboard insights for portfolio performance
- **Collaboration Tools**: Team workflows with task management, document sharing, and approval processes
- **Investment Committee Tools**: Automated IC memo generation and presentation materials
- **Capital Raising CRM**: Investor and lender relationship management with communication tracking

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Maps**: (Integration planned for Mapbox/Google Maps)
- **State Management**: React Hooks
- **Code Quality**: ESLint configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dmichaelroth/RBM-LIHTC-Site-Screener-GIS-Screener-.git
   cd RBM-LIHTC-Site-Screener-GIS-Screener-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/                   # Source code
│   ├── components/        # Reusable React components
│   ├── pages/            # Application pages
│   └── ...               # Additional source files
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build configuration
```

## 🗺 Planned Module Integration

### Module 1: Site Data & Evaluation Scoring
- **QCT/DDA Analysis**: Qualified Census Tract and Difficult Development Area checks
- **Environmental Screening**: FEMA floodplain, EPA contamination data
- **Zoning Analysis**: Land use restrictions and development potential
- **Market Assessment**: Demographics, employment, housing market dynamics

### Module 2: Underwriting Engine & Financial Model
- **Proprietary LIHTC Model**: Built-in development proforma optimized for tax credit projects with industry-standard assumptions
- **Rapid Document Processing**: AI-powered extraction from rent rolls, operating statements, and financial documents
- **Revenue Proforma**: LIHTC rent calculations and market verification with automated data standardization
- **Operating Expenses**: Automated expense benchmarking with real-time market comparables
- **Development Costs**: Construction, soft costs, and permit fee automation with regional cost databases
- **Sources & Uses**: Automated capital stack assembly including debt, equity, and gap funding calculations
- **Tax Credit Calculations**: Eligible basis determination, credit pricing, and equity projections
- **Feasibility Analysis**: Debt sizing, equity calculations, and gap analysis with sensitivity testing
- **Excel Integration**: Seamless data population into proprietary underwriting models or existing templates
- **Scenario Modeling**: Compare multiple financial scenarios and stress testing capabilities
- **Model Flexibility**: Choice between using the built-in model or integrating with existing Excel templates

### Module 3: QAP Scoring Engine
- **State-Specific Rules**: Automated QAP point calculation
- **Competitive Analysis**: Award probability assessment
- **Strategic Recommendations**: Point optimization guidance

### Module 4: AI Copilot
- **Conversational Interface**: Natural language Q&A about deals
- **Strategy Optimization**: Product type and market focus recommendations
- **Problem Solving**: Multi-factor analysis and solutions

### Module 5: Project Management & Deal Pipeline
- **End-to-End Deal Tracking**: Complete lifecycle management from sourcing through asset management
- **Pipeline Visibility**: Real-time progress tracking with critical date monitoring
- **Task Management**: Automated workflows with role-based assignments and notifications  
- **Document Management**: Centralized repository with version control and team access
- **Collaboration Platform**: Internal and external team coordination with contextual deal data
- **CRM Integration**: Capital raising and investor management with communication logs
- **Application Tracking**: LIHTC application monitoring with automated deadline alerts
- **Portfolio Analytics**: Performance tracking across multiple deals and assets
- **Approval Workflows**: Streamlined investment committee processes with automated memo generation

### Module 6: Analytics, Reporting & Data Intelligence
- **Real-time Dashboards**: Live pipeline insights with customizable views and KPI tracking
- **Automated Reporting**: Investment committee presentations, QAP scorecards, and feasibility reports
- **Market Intelligence**: Comparable analysis with integrated market data and trends
- **Excel Model Export**: Full underwriting models with formulas for offline analysis
- **Pitch Book Generation**: Professional investor presentation materials with customizable templates
- **Data Centralization**: Single source of truth eliminating spreadsheet silos
- **Performance Analytics**: Portfolio-level insights and deal outcome tracking
- **Custom Reports**: Flexible reporting engine for stakeholder-specific needs

## 🔑 Key Data Sources (Planned)

- **HUD**: Area Median Income, QCT/DDA designations
- **Census Bureau**: Demographics, income, housing data
- **FEMA**: Flood risk and natural disaster data
- **EPA**: Environmental screening data
- **Municipal APIs**: Zoning, permits, utility information
- **Market Data**: CoStar, Zillow, local comparables

## 🎯 Target Users

- **LIHTC Developers**: Specialized affordable housing and tax credit development firms
- **Syndication Companies**: Tax credit syndicators and equity investors
- **Investment Firms**: Institutional investors evaluating LIHTC opportunities and portfolios
- **Affordable Housing Consultants**: Market analysts, underwriters, and development advisors
- **Non-Profit Developers**: Community development organizations and affordable housing providers
- **Government Agencies**: Housing finance agencies, planning departments, and allocation authorities
- **Lenders & Financial Institutions**: Banks and lenders specializing in affordable housing finance
- **Property Management Companies**: Firms managing LIHTC asset portfolios

## 🚧 Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic GIS mapping interface
- ✅ React/TypeScript application structure
- ✅ Responsive design framework

### Phase 2: Core Integration
- 🔄 API integration for geocoding and automated data fetching
- 🔄 AI-powered document extraction and data standardization
- 🔄 Site evaluation scoring algorithms implementation
- 🔄 Proprietary LIHTC financial model development and integration
- 🔄 Rapid underwriting engine with Excel plugin capabilities

### Phase 3: Advanced Features & Analytics
- ⏳ QAP scoring automation with state-specific rule engines
- ⏳ Deal pipeline management and collaboration tools
- ⏳ Real-time analytics and dashboard development
- ⏳ AI copilot integration for strategic recommendations

### Phase 4: Enterprise Platform Completion
- ⏳ Investment committee and approval workflow automation
- ⏳ Advanced portfolio analytics and performance tracking
- ⏳ Multi-state expansion with comprehensive QAP coverage
- ⏳ Enterprise security and scalability enhancements

## 🤝 Contributing

This is a proprietary platform under active development. For collaboration opportunities or integration discussions, please contact the development team.

## 📄 License

Proprietary - All rights reserved. This software is not open source and requires licensing for use.

## 📞 Contact

For questions about this project or potential collaboration on LIHTC scoring tool integration, please reach out through the repository's issue system or contact the project maintainers directly.

## 🔍 Related Documentation

- [AI-Enhanced LIHTC Development Platform Specification](./docs/platform-specification.md)
- [Module Integration Guide](./docs/integration-guide.md)
- [API Documentation](./docs/api-docs.md) *(Coming Soon)*

---

**Note**: This application represents the foundational mapping interface for a comprehensive LIHTC development and syndication platform. The full feature set described above combines the rapid underwriting capabilities of leading multifamily analysis tools with the end-to-end deal management functionality of institutional investment platforms, specifically optimized for the LIHTC market. The platform includes a proprietary financial model designed specifically for affordable housing development, allowing users to either leverage the built-in model for standardized analysis or integrate with their existing Excel templates. The system is designed to eliminate manual data entry, accelerate deal evaluation, and provide the specialized analytics needed for successful affordable housing development and syndication.