import { getServerRole } from "@/lib/getRole";
import SalesInvoicesPage from "@/components/page-components/SalesInvoicePage";

const ServerSalesInvoicesPage = async () => {
    const role = await getServerRole();
    return <SalesInvoicesPage role={role} />
}

export default ServerSalesInvoicesPage