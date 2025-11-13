import { getServerRole } from "@/lib/getRole";
import InventoryPage from "@/components/page-components/InventoryPage";

const InventoryServerPage = async () => {
    const role = await getServerRole();

    return <InventoryPage role={role} />
};

export default InventoryServerPage;