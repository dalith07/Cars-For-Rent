import { getAllCompaniesForMap } from "@/actions/dashboard/company/company";
import ServiceClient from "./service-client";

const Service = async () => {
    const res = await getAllCompaniesForMap();
    return (
        <ServiceClient companies={res.success ? res.data : []} />
    );
};

export default Service;
