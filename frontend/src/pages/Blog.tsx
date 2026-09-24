import { FullBlog } from "../components/FullBlog";
import { Navigate, useParams } from "react-router-dom";

export const Blog = () => {
    const { id } = useParams();
    if (!id) return <Navigate to="/blogs" replace />;
    return <FullBlog blogId={id} />;
}
