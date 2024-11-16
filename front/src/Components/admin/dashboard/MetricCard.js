const MetricCard = ({ title, value, trend, subText, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {trend && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium
            ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
          `}>
            <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      {children ? children : (
        <>
          <div className="text-3xl font-semibold text-gray-900 mb-2">{value}</div>
          {subText && <div className="text-sm text-gray-500">{subText}</div>}
        </>
      )}
    </div>
  );