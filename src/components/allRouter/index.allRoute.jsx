import { useRoutes } from "react-router-dom";
import { router } from "../router/index.route";
function AllRoute() {
    const element = useRoutes(router);
    return (
        <>
            {element}
        </>
    )
}
export default AllRoute;
