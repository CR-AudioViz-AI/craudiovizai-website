// CR AudioViz AI - Paycheck Calculator Tool
// Session: 2025-10-25 Phase 6 Build
// Page: app/tools/paycheck-calculator/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Calculator, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

interface TaxCalculation {
  federal: number
  state: number
  fica: number
  total: number
}

export default function PaycheckCalculatorPage() {
  const [salary, setSalary] = useState('50000')
  const [payFrequency, setPayFrequency] = useState<'weekly' | 'biweekly' | 'semimonthly' | 'monthly'>('biweekly')
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head'>('single')
  const [state, setState] = useState('CA')
  const [preDeductions, setPreDeductions] = useState('0')
  
  const [grossPay, setGrossPay] = useState(0)
  const [taxes, setTaxes] = useState<TaxCalculation>({ federal: 0, state: 0, fica: 0, total: 0 })
  const [netPay, setNetPay] = useState(0)

  useEffect(() => {
    calculatePaycheck()
  }, [salary, payFrequency, filingStatus, state, preDeductions])

  const calculatePaycheck = () => {
    const annualSalary = parseFloat(salary) || 0
    const deductions = parseFloat(preDeductions) || 0

    // Calculate gross pay per period
    const periodsPerYear = {
      weekly: 52,
      biweekly: 26,
      semimonthly: 24,
      monthly: 12
    }
    const periods = periodsPerYear[payFrequency]
    const grossPerPeriod = annualSalary / periods

    // Calculate taxes
    const federalTax = calculateFederalTax(annualSalary, filingStatus) / periods
    const stateTax = calculateStateTax(annualSalary, state) / periods
    const ficaTax = calculateFICA(annualSalary) / periods

    const totalTax = federalTax + stateTax + ficaTax
    const net = grossPerPeriod - totalTax - deductions

    setGrossPay(grossPerPeriod)
    setTaxes({
      federal: federalTax,
      state: stateTax,
      fica: ficaTax,
      total: totalTax
    })
    setNetPay(net)
  }

  const calculateFederalTax = (annual: number, status: string): number => {
    // 2024 Tax Brackets (simplified)
    const standardDeduction = status === 'married' ? 29200 : status === 'head' ? 21900 : 14600
    const taxableIncome = Math.max(0, annual - standardDeduction)

    let tax = 0
    if (status === 'single') {
      if (taxableIncome <= 11600) tax = taxableIncome * 0.10
      else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12
      else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22
      else if (taxableIncome <= 191950) tax = 17168.50 + (taxableIncome - 100525) * 0.24
      else if (taxableIncome <= 243725) tax = 39110.50 + (taxableIncome - 191950) * 0.32
      else if (taxableIncome <= 609350) tax = 55678.50 + (taxableIncome - 243725) * 0.35
      else tax = 183647.25 + (taxableIncome - 609350) * 0.37
    } else {
      // Simplified married/head calculations
      tax = taxableIncome * 0.22 // Average effective rate
    }

    return tax
  }

  const calculateStateTax = (annual: number, stateCode: string): number => {
    // Simplified state tax rates
    const stateTaxRates: { [key: string]: number } = {
      'CA': 0.093, 'NY': 0.0685, 'TX': 0, 'FL': 0, 'WA': 0,
      'IL': 0.0495, 'PA': 0.0307, 'OH': 0.0399, 'NC': 0.0499,
      'MI': 0.0425, 'NJ': 0.0637, 'VA': 0.0575, 'AZ': 0.025,
      'MA': 0.05, 'TN': 0, 'IN': 0.0323, 'MO': 0.0495,
      'MD': 0.0575, 'WI': 0.0765, 'CO': 0.044, 'MN': 0.0985
    }
    
    const rate = stateTaxRates[stateCode] || 0.05
    return annual * rate
  }

  const calculateFICA = (annual: number): number => {
    // Social Security: 6.2% up to $160,200
    const socialSecurity = Math.min(annual, 160200) * 0.062
    // Medicare: 1.45% on all income
    const medicare = annual * 0.0145
    return socialSecurity + medicare
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const hourlyRate = (parseFloat(salary) / 2080).toFixed(2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Paycheck Calculator
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Calculate your take-home pay after taxes
                </p>
              </div>
            </div>
            
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Salary Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Income Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Annual Salary
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Hourly: ${hourlyRate}/hour (based on 2,080 hours/year)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pay Frequency
                  </label>
                  <select
                    value={payFrequency}
                    onChange={(e) => setPayFrequency(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="weekly">Weekly (52 paychecks/year)</option>
                    <option value="biweekly">Bi-weekly (26 paychecks/year)</option>
                    <option value="semimonthly">Semi-monthly (24 paychecks/year)</option>
                    <option value="monthly">Monthly (12 paychecks/year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filing Status
                  </label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                    <option value="head">Head of Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="WA">Washington</option>
                    <option value="IL">Illinois</option>
                    <option value="PA">Pennsylvania</option>
                    {/* Add more states as needed */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pre-tax Deductions (per paycheck)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      value={preDeductions}
                      onChange={(e) => setPreDeductions(e.target.value)}
                      placeholder="401(k), HSA, etc."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Take Home Pay */}
            <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-lg shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Your Paycheck</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-green-100 text-sm">Gross Pay (per paycheck)</p>
                  <p className="text-4xl font-bold">{formatCurrency(grossPay)}</p>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <p className="text-green-100 text-sm">Net Pay (take-home)</p>
                  <p className="text-5xl font-bold">{formatCurrency(netPay)}</p>
                </div>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tax Breakdown (per paycheck)
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Federal Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(taxes.federal)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">State Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(taxes.state)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">FICA (Social Security + Medicare)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(taxes.fica)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">Total Taxes</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(taxes.total)}
                  </span>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 text-sm">
                  <p className="text-blue-800 dark:text-blue-200">
                    Effective tax rate: {((taxes.total / grossPay) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Annual Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Annual Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gross Annual</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(parseFloat(salary))}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Net Annual</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(netPay * (payFrequency === 'weekly' ? 52 : payFrequency === 'biweekly' ? 26 : payFrequency === 'semimonthly' ? 24 : 12))}
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Disclaimer:</strong> This calculator provides estimates based on 2024 tax rates. Actual withholding may vary based on additional factors like allowances, extra withholding, and tax credits. Consult a tax professional for accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
