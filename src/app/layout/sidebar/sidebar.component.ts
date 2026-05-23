import { Component } from '@angular/core';
import { LayoutService } from '../../core/services/layout.service';

export interface MenuItem {
  name: string;
  route?: string;
  icon?: string;
  badge?: { text: string; colorClass: string };
  isLabel?: boolean;
  expanded?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarCollapsed$ = this.layoutService.isSidebarCollapsed$;

  constructor(public layoutService: LayoutService) {}

  toggleSubmenu(item: MenuItem, event: Event) {
    if (item.children) {
      event.preventDefault();
      item.expanded = !item.expanded;
    }
  }

  menuItems: MenuItem[] = [
    { name: 'DASHBOARD', isLabel: true },
    { 
      name: 'Dashboard', 
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      expanded: true,
      children: [
        { name: 'Executive Dashboard', route: '/dashboard/executive' },
        { name: 'Operations Dashboard', route: '/dashboard/operations' },
        { name: 'Sales Dashboard', route: '/dashboard/sales' },
        { name: 'Finance Dashboard', route: '/dashboard/finance' },
        { name: 'HR Dashboard', route: '/dashboard/hr' },
        { name: 'Fleet Dashboard', route: '/dashboard/fleet' },
      ]
    },

    { name: 'CRM', isLabel: true },
    {
      name: 'Leads',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      children: [
        { name: 'All Leads', route: '/crm/leads/all' },
        { name: 'New Leads', route: '/crm/leads/new' },
        { name: 'Follow Ups', route: '/crm/leads/follow-ups' },
        { name: 'Lead Sources', route: '/crm/leads/sources' },
        { name: 'Lead Statuses', route: '/crm/leads/statuses' },
      ]
    },
    {
      name: 'Customers',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      children: [
        { name: 'All Customers', route: '/crm/customers/all' },
        { name: 'Residential Customers', route: '/crm/customers/residential' },
        { name: 'Commercial Customers', route: '/crm/customers/commercial' },
        { name: 'Customer Addresses', route: '/crm/customers/addresses' },
        { name: 'Customer Documents', route: '/crm/customers/documents' },
      ]
    },
    {
      name: 'Surveys',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      children: [
        { name: 'Survey Requests', route: '/crm/surveys/requests' },
        { name: 'Scheduled Surveys', route: '/crm/surveys/scheduled' },
        { name: 'Completed Surveys', route: '/crm/surveys/completed' },
        { name: 'Virtual Surveys', route: '/crm/surveys/virtual' },
        { name: 'Survey Reports', route: '/crm/surveys/reports' },
      ]
    },
    {
      name: 'Quotations',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      children: [
        { name: 'Draft Quotes', route: '/crm/quotes/draft' },
        { name: 'Sent Quotes', route: '/crm/quotes/sent' },
        { name: 'Approved Quotes', route: '/crm/quotes/approved' },
        { name: 'Rejected Quotes', route: '/crm/quotes/rejected' },
        { name: 'Expired Quotes', route: '/crm/quotes/expired' },
        { name: 'Quote Templates', route: '/crm/quotes/templates' },
      ]
    },

    { name: 'OPERATIONS', isLabel: true },
    {
      name: 'Bookings',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      children: [
        { name: 'New Bookings', route: '/operations/bookings/new' },
        { name: 'Confirmed Bookings', route: '/operations/bookings/confirmed' },
        { name: 'Assigned Bookings', route: '/operations/bookings/assigned' },
        { name: 'Completed Bookings', route: '/operations/bookings/completed' },
        { name: 'Cancelled Bookings', route: '/operations/bookings/cancelled' },
      ]
    },
    {
      name: 'Move Orders',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      children: [
        { name: 'Active Moves', route: '/operations/moves/active' },
        { name: 'Scheduled Moves', route: '/operations/moves/scheduled' },
        { name: 'In Progress', route: '/operations/moves/in-progress' },
        { name: 'Completed', route: '/operations/moves/completed' },
        { name: 'Cancelled', route: '/operations/moves/cancelled' },
      ]
    },
    {
      name: 'Dispatch Center',
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      children: [
        { name: 'Dispatch Board', route: '/operations/dispatch/board' },
        { name: 'Assign Crew', route: '/operations/dispatch/crew' },
        { name: 'Assign Vehicles', route: '/operations/dispatch/vehicles' },
        { name: 'Route Planning', route: '/operations/dispatch/routes' },
      ]
    },
    {
      name: 'Move Tracking',
      icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
      children: [
        { name: 'Live Tracking', route: '/operations/tracking/live' },
        { name: 'Delayed Jobs', route: '/operations/tracking/delayed' },
        { name: 'Job Timeline', route: '/operations/tracking/timeline' },
        { name: 'Activity Logs', route: '/operations/tracking/logs' },
      ]
    },
    {
      name: 'Inventory Assessment',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      children: [
        { name: 'Property Inventory', route: '/operations/inventory/property' },
        { name: 'Room Inventory', route: '/operations/inventory/room' },
        { name: 'Special Items', route: '/operations/inventory/special' },
        { name: 'Weight Estimation', route: '/operations/inventory/weight' },
      ]
    },

    { name: 'SERVICES', isLabel: true },
    {
      name: 'Service Categories',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z',
      children: [
        { name: 'Residential Moving', route: '/services/categories/residential' },
        { name: 'Commercial Moving', route: '/services/categories/commercial' },
        { name: 'International Moving', route: '/services/categories/international' },
        { name: 'Storage Services', route: '/services/categories/storage' },
        { name: 'Packing Services', route: '/services/categories/packing' },
        { name: 'Cleaning Services', route: '/services/categories/cleaning' },
      ]
    },
    {
      name: 'Service Types',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      children: [
        { name: 'Full Service', route: '/services/types/full' },
        { name: 'Labor Only', route: '/services/types/labor' },
        { name: 'Packing Only', route: '/services/types/packing' },
        { name: 'Loading Only', route: '/services/types/loading' },
        { name: 'Unloading Only', route: '/services/types/unloading' },
      ]
    },
    {
      name: 'Add-On Services',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      children: [
        { name: 'Furniture Assembly', route: '/services/addons/assembly' },
        { name: 'Appliance Installation', route: '/services/addons/installation' },
        { name: 'Piano Moving', route: '/services/addons/piano' },
        { name: 'Fragile Handling', route: '/services/addons/fragile' },
      ]
    },
    {
      name: 'Pricing Management',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      children: [
        { name: 'Service Pricing', route: '/services/pricing/service' },
        { name: 'Distance Pricing', route: '/services/pricing/distance' },
        { name: 'Labor Pricing', route: '/services/pricing/labor' },
        { name: 'Fuel Pricing', route: '/services/pricing/fuel' },
        { name: 'Tax Rules', route: '/services/pricing/tax' },
      ]
    },
    {
      name: 'Property Types',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      children: [
        { name: 'Studio', route: '/services/property-types/studio' },
        { name: '1 Bedroom', route: '/services/property-types/1bed' },
        { name: '2 Bedroom', route: '/services/property-types/2bed' },
        { name: '3 Bedroom', route: '/services/property-types/3bed' },
        { name: 'Villa', route: '/services/property-types/villa' },
        { name: 'Office', route: '/services/property-types/office' },
        { name: 'Warehouse', route: '/services/property-types/warehouse' },
      ]
    },
    {
      name: 'Zones & Coverage',
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      children: [
        { name: 'Cities', route: '/services/zones/cities' },
        { name: 'Service Areas', route: '/services/zones/areas' },
        { name: 'Distance Matrix', route: '/services/zones/distance' },
        { name: 'Coverage Zones', route: '/services/zones/coverage' },
      ]
    },

    { name: 'RESOURCES', isLabel: true },
    {
      name: 'Fleet Management',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      children: [
        { name: 'Vehicles', route: '/resources/fleet/vehicles' },
        { name: 'Vehicle Categories', route: '/resources/fleet/categories' },
        { name: 'Maintenance', route: '/resources/fleet/maintenance' },
        { name: 'Fuel Logs', route: '/resources/fleet/fuel' },
        { name: 'Vehicle Insurance', route: '/resources/fleet/insurance' },
        { name: 'Vehicle Documents', route: '/resources/fleet/documents' },
      ]
    },
    {
      name: 'Crew Management',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      children: [
        { name: 'Crew Members', route: '/resources/crew/members' },
        { name: 'Teams', route: '/resources/crew/teams' },
        { name: 'Crew Schedules', route: '/resources/crew/schedules' },
        { name: 'Availability', route: '/resources/crew/availability' },
        { name: 'Performance Ratings', route: '/resources/crew/performance' },
      ]
    },
    {
      name: 'Warehouses',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      children: [
        { name: 'Warehouses', route: '/resources/warehouses/list' },
        { name: 'Storage Units', route: '/resources/warehouses/units' },
        { name: 'Stored Items', route: '/resources/warehouses/items' },
        { name: 'Storage Contracts', route: '/resources/warehouses/contracts' },
        { name: 'Warehouse Transfers', route: '/resources/warehouses/transfers' },
      ]
    },
    {
      name: 'Assets',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      children: [
        { name: 'Asset Registry', route: '/resources/assets/registry' },
        { name: 'Asset Categories', route: '/resources/assets/categories' },
        { name: 'Asset Assignment', route: '/resources/assets/assignment' },
        { name: 'Asset Maintenance', route: '/resources/assets/maintenance' },
        { name: 'Depreciation', route: '/resources/assets/depreciation' },
        { name: 'Asset Disposal', route: '/resources/assets/disposal' },
      ]
    },
    {
      name: 'Inventory',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      children: [
        { name: 'Packing Materials', route: '/resources/inventory/materials' },
        { name: 'Consumables', route: '/resources/inventory/consumables' },
        { name: 'Stock Levels', route: '/resources/inventory/levels' },
        { name: 'Stock Transfers', route: '/resources/inventory/transfers' },
        { name: 'Stock Adjustments', route: '/resources/inventory/adjustments' },
      ]
    },
    {
      name: 'Vendors',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      children: [
        { name: 'Vendors', route: '/resources/vendors/list' },
        { name: 'Vendor Contracts', route: '/resources/vendors/contracts' },
        { name: 'Vendor Performance', route: '/resources/vendors/performance' },
        { name: 'Vendor Payments', route: '/resources/vendors/payments' },
      ]
    },

    { name: 'PROCUREMENT', isLabel: true },
    { name: 'Purchase Requests', route: '/procurement/requests', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'RFQs', route: '/procurement/rfqs', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Purchase Orders', route: '/procurement/orders', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Goods Received Notes', route: '/procurement/grn', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Purchase Invoices', route: '/procurement/invoices', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Vendor Bills', route: '/procurement/bills', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Contract Management', route: '/procurement/contracts', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
    { name: 'Procurement Reports', route: '/procurement/reports', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },

    { name: 'FINANCE', isLabel: true },
    {
      name: 'Invoices',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      children: [
        { name: 'Customer Invoices', route: '/finance/invoices/customer' },
        { name: 'Draft Invoices', route: '/finance/invoices/draft' },
        { name: 'Paid Invoices', route: '/finance/invoices/paid' },
        { name: 'Overdue Invoices', route: '/finance/invoices/overdue' },
      ]
    },
    {
      name: 'Payments',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      children: [
        { name: 'Customer Payments', route: '/finance/payments/customer' },
        { name: 'Vendor Payments', route: '/finance/payments/vendor' },
        { name: 'Refunds', route: '/finance/payments/refunds' },
        { name: 'Payment Methods', route: '/finance/payments/methods' },
      ]
    },
    {
      name: 'Expenses',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      children: [
        { name: 'Fuel Expenses', route: '/finance/expenses/fuel' },
        { name: 'Maintenance Expenses', route: '/finance/expenses/maintenance' },
        { name: 'Payroll Expenses', route: '/finance/expenses/payroll' },
        { name: 'Other Expenses', route: '/finance/expenses/other' },
      ]
    },
    {
      name: 'Accounting',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      children: [
        { name: 'Chart Of Accounts', route: '/finance/accounting/coa' },
        { name: 'Journal Entries', route: '/finance/accounting/journal' },
        { name: 'General Ledger', route: '/finance/accounting/ledger' },
        { name: 'Trial Balance', route: '/finance/accounting/trial-balance' },
        { name: 'Fiscal Years', route: '/finance/accounting/fiscal-years' },
      ]
    },
    {
      name: 'Taxes',
      icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z',
      children: [
        { name: 'Tax Rates', route: '/finance/taxes/rates' },
        { name: 'Tax Rules', route: '/finance/taxes/rules' },
        { name: 'Tax Reports', route: '/finance/taxes/reports' },
      ]
    },
    {
      name: 'Insurance & Claims',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      children: [
        { name: 'Insurance Policies', route: '/finance/insurance/policies' },
        { name: 'Claims', route: '/finance/insurance/claims' },
        { name: 'Damaged Items', route: '/finance/insurance/damaged' },
        { name: 'Claim Settlements', route: '/finance/insurance/settlements' },
      ]
    },

    { name: 'HR', isLabel: true },
    {
      name: 'Employees',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      children: [
        { name: 'Employee Directory', route: '/hr/employees/directory' },
        { name: 'Designations', route: '/hr/employees/designations' },
        { name: 'Departments', route: '/hr/employees/departments' },
        { name: 'Contracts', route: '/hr/employees/contracts' },
        { name: 'Documents', route: '/hr/employees/documents' },
      ]
    },
    {
      name: 'Attendance',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      children: [
        { name: 'Daily Attendance', route: '/hr/attendance/daily' },
        { name: 'Attendance Logs', route: '/hr/attendance/logs' },
        { name: 'Attendance Reports', route: '/hr/attendance/reports' },
      ]
    },
    {
      name: 'Leave Management',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      children: [
        { name: 'Leave Requests', route: '/hr/leave/requests' },
        { name: 'Leave Types', route: '/hr/leave/types' },
        { name: 'Leave Balances', route: '/hr/leave/balances' },
        { name: 'Leave Calendar', route: '/hr/leave/calendar' },
      ]
    },
    {
      name: 'Payroll',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      children: [
        { name: 'Salary Structures', route: '/hr/payroll/structures' },
        { name: 'Payroll Processing', route: '/hr/payroll/processing' },
        { name: 'Payslips', route: '/hr/payroll/payslips' },
        { name: 'Bonuses', route: '/hr/payroll/bonuses' },
        { name: 'Deductions', route: '/hr/payroll/deductions' },
      ]
    },
    {
      name: 'Recruitment',
      icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
      children: [
        { name: 'Job Positions', route: '/hr/recruitment/positions' },
        { name: 'Applicants', route: '/hr/recruitment/applicants' },
        { name: 'Interviews', route: '/hr/recruitment/interviews' },
        { name: 'Hiring Pipeline', route: '/hr/recruitment/pipeline' },
      ]
    },
    {
      name: 'Performance',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      children: [
        { name: 'Reviews', route: '/hr/performance/reviews' },
        { name: 'KPIs', route: '/hr/performance/kpis' },
        { name: 'Promotions', route: '/hr/performance/promotions' },
        { name: 'Warnings', route: '/hr/performance/warnings' },
      ]
    },

    { name: 'SUPPORT', isLabel: true },
    { name: 'Tickets', route: '/support/tickets', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Complaints', route: '/support/complaints', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { name: 'Escalations', route: '/support/escalations', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Customer Feedback', route: '/support/feedback', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: 'Knowledge Base', route: '/support/kb', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Announcements', route: '/support/announcements', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' },

    { name: 'REPORTS', isLabel: true },
    { name: 'Sales Reports', route: '/reports/sales', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Customer Reports', route: '/reports/customers', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Lead Reports', route: '/reports/leads', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Booking Reports', route: '/reports/bookings', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Move Reports', route: '/reports/moves', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Fleet Reports', route: '/reports/fleet', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Warehouse Reports', route: '/reports/warehouses', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Asset Reports', route: '/reports/assets', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'HR Reports', route: '/reports/hr', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Payroll Reports', route: '/reports/payroll', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Financial Reports', route: '/reports/financial', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Tax Reports', route: '/reports/tax', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Custom Reports', route: '/reports/custom', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },

    { name: 'ADMINISTRATION', isLabel: true },
    {
      name: 'User Management',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      children: [
        { name: 'Users', route: '/admin/users' },
        { name: 'Roles', route: '/admin/roles' },
        { name: 'Permissions', route: '/admin/permissions' },
        { name: 'User Groups', route: '/admin/groups' },
      ]
    },
    {
      name: 'Organization',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      children: [
        { name: 'Branches', route: '/admin/org/branches' },
        { name: 'Departments', route: '/admin/org/departments' },
        { name: 'Teams', route: '/admin/org/teams' },
        { name: 'Locations', route: '/admin/org/locations' },
      ]
    },
    {
      name: 'Workflow Configuration',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      children: [
        { name: 'Approval Flows', route: '/admin/workflows/approval' },
        { name: 'Booking Workflow', route: '/admin/workflows/booking' },
        { name: 'Quote Workflow', route: '/admin/workflows/quote' },
        { name: 'Notification Workflow', route: '/admin/workflows/notification' },
      ]
    },
    {
      name: 'Notifications',
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      children: [
        { name: 'Email Templates', route: '/admin/notifications/email' },
        { name: 'SMS Templates', route: '/admin/notifications/sms' },
        { name: 'WhatsApp Templates', route: '/admin/notifications/whatsapp' },
        { name: 'Push Templates', route: '/admin/notifications/push' },
      ]
    },
    {
      name: 'Document Management',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      children: [
        { name: 'Document Types', route: '/admin/documents/types' },
        { name: 'Templates', route: '/admin/documents/templates' },
        { name: 'Storage Settings', route: '/admin/documents/storage' },
      ]
    },
    {
      name: 'Integrations',
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      children: [
        { name: 'Payment Gateways', route: '/admin/integrations/payments' },
        { name: 'SMS Providers', route: '/admin/integrations/sms' },
        { name: 'Email Providers', route: '/admin/integrations/email' },
        { name: 'Google Maps', route: '/admin/integrations/maps' },
        { name: 'Webhooks', route: '/admin/integrations/webhooks' },
      ]
    },
    { name: 'Audit Logs', route: '/admin/audit', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'System Settings', route: '/admin/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Activity Logs', route: '/admin/activity', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];
}
