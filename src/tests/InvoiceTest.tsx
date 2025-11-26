'use client';

import ThresholdInput from "@/components/common/ThresholdInput"

const InvoiceTest = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <ThresholdInput
                value={30}
                onSubmit={(v) => {
                    console.log("Submitted threshold:", v);
                }}
            />
        </div>
    )
}

export default InvoiceTest
