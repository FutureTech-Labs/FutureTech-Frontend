import { getSession } from "@/lib/session";
import InventoryPage from "@/components/page-components/InventoryPage";

const InventoryServerPage = async () => {
    const session = await getSession();
    const role = session?.role || null;

    return <InventoryPage role={role} />
};

export default InventoryServerPage;
