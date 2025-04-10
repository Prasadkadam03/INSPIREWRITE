import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export interface Blog {
    content: string;
    title: string;
    id: string;
    author: {
        name: string;
        occupation: string;
        bio: string;
        id: string;
    };
    publishedAt: string;
    area: string;
    _count: {
        likes: number;
    };
}

export const useUserName = () => {
    const [name, setName] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/user`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((response) => {
                setName(response.data.name || "Anonymous");
                setUserId(response.data.id || "");
                localStorage.setItem("userId", response.data.id || "");
            })
            .catch(() => {
                setName("Anonymous");
                navigate("/signin");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { loading, name,userId };
};

export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();
    const [likes, setLikes] = useState<number>(0);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                const fetchedBlog = response.data.blog;
                setBlog(fetchedBlog);
                setLikes(fetchedBlog._count.likes);

                const likedResponse = await axios.get(`${BACKEND_URL}/api/v1/blog/${id}/liked`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setLiked(likedResponse.data.liked);
            } catch (error) {
                console.error("Error fetching blog:", error);
                navigate("/"); // Redirect to home page on error
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, navigate]);

    const handleLike = async () => {
        try {
            if (!liked) {
                await axios.post(
                    `${BACKEND_URL}/api/v1/blog/${id}/like`,
                    {},
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                setLikes((prev) => prev + 1);
                setLiked(true);
            } else {
                await axios.delete(`${BACKEND_URL}/api/v1/blog/${id}/like`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setLikes((prev) => prev - 1);
                setLiked(false);
            }
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    return {
        loading,
        blog,
        likes,
        liked,
        handleLike,
    };
};

export const useBlogs = ({ query }: { query: string }) => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/api/v1/blog/bulk?filter=${query}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            })
            .then((response) => {
                if (response.data.blogs.length === 0) {
                    setBlogs([
                        {
                            content: "",
                            title: "No blogs available with search content",
                            id: "",
                            author: { name: "", occupation: "", bio: "" , id: "" },
                            publishedAt: new Date().toISOString(),
                            area: "",
                            _count: { likes: 0 }, 
                        },
                    ]);
                } else {
                    setBlogs(response.data.blogs);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [query]);

    return {
        loading,
        blogs,
    };
};