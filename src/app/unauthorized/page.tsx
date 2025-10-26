import Unauthorized from "@/components/common/Unauthorized";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Unauthorized ⚠️",
};

export default function UnauthorizedPage() {
    return <Unauthorized />;
}
