import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const App = () => {
    return (
        <>
            {/* Standard notification provider used in StockX */}
            <Toaster position="top-right" richColors closeButton />
            
            {/* Child routes (like Dashboard) render here */}
            <Outlet />
        </>
    );
};

export default App;