import { useUserName } from "../hooks";
import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const Appbar = () => {
    const { loading, name } = useUserName();

    return (
        <div className="border-b flex justify-between items-center px-10 py-4 bg-white shadow-sm">
            <Link
                to="/blogs"
                className="text-4xl font-bold text-red-700 hover:text-red-900 transition-colors"
            >
                InspireWrite
            </Link>

            <div className="flex items-center space-x-4">
                <Link to="/publish">
                    <button
                        type="button"
                        className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 transition"
                    >
                        New
                    </button>
                </Link>

                <Link to="/UpdateUser">
                    <Avatar size="big" name={loading ? "..." : name || "Guest"} />
                </Link>
            </div>
        </div>
    );
};
