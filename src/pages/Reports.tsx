import React, { useEffect, useState } from 'react';
import { getReports } from '../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Type declarations
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ServiceStat {
  serviceName: string;
  count: number;
  revenue: number;
}

interface TopCustomer {
  name: string;
  totalVisits: number;
  totalSpent: number;
}

interface ReportsData {
  totalRevenue: number;
  totalTransactions: number;
  topCustomers: TopCustomer[];
  serviceStats: ServiceStat[];
}

export default function Reports() {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(res => setReports(res.data))
      .catch(err => console.error('Error loading reports:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="text-center text-gray-500">
        Unable to load reports. Please try again later.
      </div>
    );
  }

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Revenue', `KES ${reports.totalRevenue}`],
      ['Total Transactions', reports.totalTransactions],
      ['Top Customers', reports.topCustomers.length],
      ['Services Offered', reports.serviceStats.length],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    // Service Stats sheet
    const serviceData = [
      ['Service Name', 'Count', 'Revenue'],
      ...reports.serviceStats.map(stat => [stat.serviceName, stat.count, stat.revenue])
    ];
    const serviceSheet = XLSX.utils.aoa_to_sheet(serviceData);
    XLSX.utils.book_append_sheet(wb, serviceSheet, 'Service Stats');

    // Top Customers sheet
    const customerData = [
      ['Name', 'Total Visits', 'Total Spent', 'Avg per Visit'],
      ...reports.topCustomers.map(customer => [
        customer.name,
        customer.totalVisits,
        customer.totalSpent,
        (customer.totalSpent / customer.totalVisits).toFixed(2)
      ])
    ];
    const customerSheet = XLSX.utils.aoa_to_sheet(customerData);
    XLSX.utils.book_append_sheet(wb, customerSheet, 'Top Customers');

    XLSX.writeFile(wb, 'TheeBazaar_Reports.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Thee Bazaar Carwash Reports', 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

    // Summary
    doc.setFontSize(16);
    doc.text('Summary', 20, 55);
    doc.setFontSize(12);
    doc.text(`Total Revenue: KES ${reports.totalRevenue}`, 20, 70);
    doc.text(`Total Transactions: ${reports.totalTransactions}`, 20, 80);
    doc.text(`Top Customers: ${reports.topCustomers.length}`, 20, 90);

    // Service Stats
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Service Statistics', 20, 20);

    const serviceTableData = reports.serviceStats.map(stat => [
      stat.serviceName,
      stat.count.toString(),
      `KES ${stat.revenue}`
    ]);

    doc.autoTable({
      head: [['Service', 'Count', 'Revenue']],
      body: serviceTableData,
      startY: 30,
    });

    // Top Customers
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Top Customers', 20, 20);

    const customerTableData = reports.topCustomers.map(customer => [
      customer.name,
      customer.totalVisits.toString(),
      `KES ${customer.totalSpent}`,
      `KES ${(customer.totalSpent / customer.totalVisits).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [['Name', 'Visits', 'Total Spent', 'Avg per Visit']],
      body: customerTableData,
      startY: 30,
    });

    doc.save('TheeBazaar_Reports.pdf');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📊 Reports & Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">KES {reports.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{reports.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Customers</p>
              <p className="text-2xl font-bold text-gray-900">{reports.topCustomers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">🛠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Services Offered</p>
              <p className="text-2xl font-bold text-gray-900">{reports.serviceStats.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Popularity */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Service Popularity</h3>
        </div>
        <div className="p-6">
          {reports.serviceStats.length === 0 ? (
            <p className="text-gray-500">No service data available.</p>
          ) : (
            <div className="space-y-4">
              {reports.serviceStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{stat.serviceName}</span>
                      <span className="text-sm text-gray-500">{stat.count} washes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(stat.count / Math.max(...reports.serviceStats.map(s => s.count))) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-sm font-semibold text-green-600">KES {stat.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Top Customers</h3>
        </div>
        <div className="overflow-x-auto">
          {reports.topCustomers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No customer data available.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg per Visit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.topCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.totalVisits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      KES {customer.totalSpent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KES {(customer.totalSpent / customer.totalVisits).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}