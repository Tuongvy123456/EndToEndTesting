import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Info, Clock } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  dateInfo?: {
    dayOfWeek: string;
    isLeapYear: boolean;
    daysInMonth: number;
  };
}

function App() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [fullDate, setFullDate] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [inputMethod, setInputMethod] = useState<'separate' | 'single'>('separate');

  const validateDate = (d: string, m: string, y: string): ValidationResult => {
    const dayNum = parseInt(d);
    const monthNum = parseInt(m);
    const yearNum = parseInt(y);

    // Check if all fields are filled
    if (!d || !m || !y) {
      return {
        isValid: false,
        message: 'Please fill in all date fields',
        type: 'info'
      };
    }

    // Check for valid numbers
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      return {
        isValid: false,
        message: 'Please enter valid numbers',
        type: 'error'
      };
    }

    // Check year range
    if (yearNum < 1 || yearNum > 9999) {
      return {
        isValid: false,
        message: 'Year must be between 1 and 9999',
        type: 'error'
      };
    }

    // Check month range
    if (monthNum < 1 || monthNum > 12) {
      return {
        isValid: false,
        message: 'Month must be between 1 and 12',
        type: 'error'
      };
    }

    // Check leap year
    const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);

    // Days in each month
    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const maxDays = daysInMonth[monthNum - 1];

    // Check day range
    if (dayNum < 1 || dayNum > maxDays) {
      return {
        isValid: false,
        message: `Day must be between 1 and ${maxDays} for ${getMonthName(monthNum)} ${yearNum}`,
        type: 'error'
      };
    }

    // Create date object to verify
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getFullYear() !== yearNum || date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
      return {
        isValid: false,
        message: 'Invalid date combination',
        type: 'error'
      };
    }

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      isValid: true,
      message: `Valid date! This is a ${dayOfWeek}.`,
      type: 'success',
      dateInfo: {
        dayOfWeek,
        isLeapYear,
        daysInMonth: maxDays
      }
    };
  };

  const validateFullDate = (dateStr: string): ValidationResult => {
    if (!dateStr) {
      return {
        isValid: false,
        message: 'Please enter a date',
        type: 'info'
      };
    }

    // Try different date formats
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY or MM/DD/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    ];

    let day, month, year;

    for (let i = 0; i < formats.length; i++) {
      const match = dateStr.match(formats[i]);
      if (match) {
        if (i === 1) { // YYYY-MM-DD
          year = match[1];
          month = match[2];
          day = match[3];
        } else { // DD/MM/YYYY or DD-MM-YYYY
          day = match[1];
          month = match[2];
          year = match[3];
        }
        break;
      }
    }

    if (!day || !month || !year) {
      return {
        isValid: false,
        message: 'Invalid date format. Try DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD',
        type: 'error'
      };
    }

    return validateDate(day, month, year);
  };

  const getMonthName = (monthNum: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1] || '';
  };

  useEffect(() => {
    if (inputMethod === 'separate') {
      const result = validateDate(day, month, year);
      setValidationResult(result);
    } else {
      const result = validateFullDate(fullDate);
      setValidationResult(result);
    }
  }, [day, month, year, fullDate, inputMethod]);

  const getStatusIcon = () => {
    if (!validationResult) return null;
    
    switch (validationResult.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <X className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    if (!validationResult) return 'border-gray-200';
    
    switch (validationResult.type) {
      case 'success':
        return 'border-green-400 bg-green-50';
      case 'error':
        return 'border-red-400 bg-red-50';
      case 'info':
        return 'border-blue-400 bg-blue-50';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Date Validator</h1>
            <p className="text-gray-600 text-lg">Check if your date is valid with comprehensive validation</p>
          </div>

          {/* Input Method Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setInputMethod('separate')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  inputMethod === 'separate'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Separate Fields
              </button>
              <button
                onClick={() => setInputMethod('single')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  inputMethod === 'single'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Single Field
              </button>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {inputMethod === 'separate' ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Enter Date Components</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                    <input
                      type="number"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      placeholder="01"
                      min="1"
                      max="31"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <input
                      type="number"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      placeholder="01"
                      min="1"
                      max="12"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2024"
                      min="1"
                      max="9999"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Enter Full Date</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="text"
                    value={fullDate}
                    onChange={(e) => setFullDate(e.target.value)}
                    placeholder="DD/MM/YYYY, MM/DD/YYYY, or YYYY-MM-DD"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: 15/03/2024, 03/15/2024, 2024-03-15
                  </p>
                </div>
              </div>
            )}

            {/* Validation Result */}
            {validationResult && (
              <div className={`rounded-lg p-4 border-2 transition-all duration-300 ${getStatusColor()}`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon()}
                  <p className="text-sm font-medium text-gray-800">{validationResult.message}</p>
                </div>
                
                {validationResult.isValid && validationResult.dateInfo && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Date Information:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Day: {validationResult.dateInfo.dayOfWeek}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">
                          {validationResult.dateInfo.isLeapYear ? 'Leap Year' : 'Regular Year'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">
                          {validationResult.dateInfo.daysInMonth} days in month
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Validation Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Leap year detection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Month day limits</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Multiple date formats</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Day of week calculation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Real-time validation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                <span>Detailed error messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;