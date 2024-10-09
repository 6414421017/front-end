export function TotalByType({ loading , total }) {
    return (
        <>
            <p className="text-sm font-sans">Balance</p>
            <div className="mt-1 pl-1">
                { loading ? (
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full">
                    
                  </div>
                ) : (
                  <p>
                    {new Intl.NumberFormat('th', {
                      style: 'currency',
                      currency: 'THB',
                    }).format(total)}
                  </p>
                )}
            </div>
        </>
    )
}