# NBCon Finance/Payments System

A comprehensive finance and payments management system for NBCon, the Saudi engineering marketplace platform.

## Overview

This system provides a complete financial management solution for engineers and clients, featuring 8 distinct payment management tabs with Saudi-specific localization and compliance features.

## Architecture

### Components Structure

```
src/features/finance/
├── components/
│   ├── PaymentsContent.tsx          # Main container with 8-tab navigation
│   ├── PaymentsOverview.tsx         # Dashboard with analytics and metrics
│   ├── PaymentsInvoices.tsx         # Invoice management and tracking
│   ├── PaymentsMilestone.tsx        # Milestone-based payment tracking
│   ├── PaymentsEscrow.tsx           # Escrow payment management
│   ├── PaymentsPayout.tsx           # Payout processing and history
│   ├── PaymentsRefund.tsx           # Refund management and processing
│   ├── PaymentsReports.tsx          # Financial reports and analytics
│   └── PaymentsSettings.tsx         # Payment settings and configuration
└── store/
    └── usePaymentsStore.ts          # Zustand store with Saudi data
```

## Features

### 1. Overview Tab
- **Summary Cards**: Total payments, pending, completed, escrow amounts
- **Recent Activity**: Latest payment transactions with client details
- **Quick Actions**: Request payout, download statement, dispute payment
- **Payment Methods**: Bank transfer, STC Pay, digital wallet management
- **Monthly Trends**: Growth percentage, earnings, platform fees

### 2. Invoices Tab
- **Invoice Management**: Create, view, download invoices
- **Status Tracking**: Pending, completed, failed payment tracking
- **Due Date Alerts**: Overdue and due-soon notifications
- **Search & Filter**: Advanced filtering capabilities
- **Export Options**: CSV and PDF export functionality

### 3. Milestone Tab
- **Project Progress**: Visual progress bars for project phases
- **Milestone Tracking**: Pending, in-progress, completed milestones
- **Work Management**: Start work, message clients, view details
- **Fee Breakdown**: Platform fees, processing fees, net earnings
- **Saudi Projects**: NEOM, Aramco, SABIC, King Salman Park, Qiddiya

### 4. Escrow Tab
- **Escrow Management**: Secure payment holding and release
- **Progress Tracking**: Escrow release countdown and progress
- **Protection Rate**: 99.8% successful release rate
- **Dispute Handling**: Dispute resolution and communication
- **How It Works**: Step-by-step escrow process explanation

### 5. Payout Tab
- **Payout Requests**: Request payouts with amount and method selection
- **Payment Methods**: Bank transfer, STC Pay, digital wallet
- **Processing Time**: 1-3 business days processing
- **Minimum Amount**: SAR 100 minimum payout
- **Payout History**: Recent and pending payout tracking

### 6. Refund Tab
- **Refund Requests**: Create refund requests with reason selection
- **Refund Policy**: Clear policy explanation and eligibility
- **Processing Time**: 3-5 business days processing
- **Refund Tracking**: Pending and completed refund status
- **Reason Categories**: Project cancelled, quality issues, delays

### 7. Reports Tab
- **Financial Analytics**: Income trends, expense tracking, net income
- **Chart Visualizations**: Line charts, bar charts, pie charts
- **Client Analysis**: Top clients by revenue and project count
- **Export Options**: CSV, PDF, tax reports, income statements
- **Period Selection**: 3 months, 6 months, 12 months, YTD

### 8. Settings Tab
- **Payment Methods**: Add, edit, remove payment methods
- **Payout Settings**: Frequency, minimum amount, payout day
- **Tax Information**: VAT number, tax rate, business address
- **Notifications**: Payment alerts, invoice reminders, reports
- **Security**: 2FA, payment confirmation, session timeout

## Saudi Localization

### Currency & Formatting
- **Primary Currency**: Saudi Riyal (SAR)
- **Formatting**: `SAR 50,000.00` with proper Arabic numeral support
- **VAT Rate**: 15% standard rate with exemption options

### Companies & Projects
- **Major Clients**: NEOM, Saudi Aramco, SABIC, PIF, SEC
- **Projects**: NEOM Smart City, Aramco Refinery, King Salman Park, Qiddiya, Red Sea Project
- **Locations**: Riyadh, Tabuk, Eastern Province, Jubail Industrial City

### Compliance Features
- **ZATCA Integration**: E-invoice compliance
- **VAT Management**: 15% VAT calculation and reporting
- **SCE Verification**: Saudi Council of Engineers credential integration
- **Business Address**: Saudi business address requirements

## Data Structure

### Payment Types
- `invoice`: Standard invoice payments
- `milestone`: Project milestone payments
- `escrow`: Escrow-secured payments
- `payout`: Engineer payout requests
- `refund`: Refund transactions

### Payment Status
- `pending`: Awaiting action
- `processing`: In progress
- `completed`: Successfully processed
- `failed`: Processing failed
- `cancelled`: Cancelled by user
- `disputed`: Under dispute

### Payment Methods
- `bank_transfer`: Traditional bank transfer
- `digital_wallet`: Digital wallet payments
- `credit_card`: Credit card payments
- `stc_pay`: STC Pay mobile payments

## State Management

### Zustand Store Features
- **Payment Data**: Comprehensive payment tracking
- **Statistics**: Real-time payment statistics
- **Filters**: Date range, company, type, status filtering
- **Search**: Global search across all payments
- **Actions**: Create, update, export, refund operations

### Mock Data
- **Realistic Data**: 8 sample payments with Saudi context
- **Project Details**: Complete project information with phases
- **Client Information**: Saudi company names and details
- **Engineer Profiles**: SCE-verified engineer information

## Usage

### Basic Implementation
```tsx
import { PaymentsContent } from "@/features/finance/components/PaymentsContent";

export default function PaymentsPage() {
  return <PaymentsContent />;
}
```

### Store Usage
```tsx
import { usePaymentsStore } from "@/features/finance/store/usePaymentsStore";

function MyComponent() {
  const { payments, paymentStats, loadPayments } = usePaymentsStore();
  
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);
  
  return (
    <div>
      <h2>Total Payments: {paymentStats.total.count}</h2>
      {/* Render payment data */}
    </div>
  );
}
```

## Styling

### Design System
- **Primary Color**: Teal-600/700 for active states and CTAs
- **Status Colors**: Green (success), Yellow (pending), Red (error)
- **Typography**: Consistent with Tailwind CSS v4
- **Components**: Shadcn/ui component library

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg responsive breakpoints
- **Touch-Friendly**: 44px minimum touch targets
- **Accessibility**: WCAG 2.2 AA compliance

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native implementation
- **API Integration**: Supabase backend integration
- **Multi-language**: Full Arabic language support

### Integration Points
- **Supabase**: Database and authentication
- **Payment Gateways**: Stripe, PayPal, local Saudi gateways
- **ZATCA API**: E-invoice compliance
- **SCE API**: Engineer verification
- **SMS/WhatsApp**: Notification services

## Development

### Prerequisites
- React 18+
- TypeScript 5+
- Tailwind CSS v4
- Shadcn/ui components
- Zustand for state management
- Lucide React for icons

### Installation
```bash
npm install @radix-ui/react-* lucide-react recharts
```

### File Structure
Follow the established pattern in `src/features/finance/` for consistency and maintainability.

## Support

For questions or issues related to the Finance/Payments system, please refer to the main NBCon documentation or contact the development team.
