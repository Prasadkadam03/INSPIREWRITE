import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
import { updateUserInput } from "@_prasadk_/inspirewrite-common";
import { Appbar } from "../components/Appbar";
import { Avatar } from "../components/BlogCard";
import { BACKEND_URL } from "../config";

export const UpdateUser = () => {
    const [formData, setFormData] = useState({ name: "", occupation: "", bio: "" });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/user`, { headers: { Authorization: localStorage.getItem("token") || "" } })
            .then((response) => setFormData({ name: response.data.name || "", occupation: response.data.occupation || "", bio: response.data.bio || "" }))
            .catch(() => setError("Your profile could not be loaded. Try refreshing the page."))
            .finally(() => setFetching(false));
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = event.target; setFormData((current) => ({ ...current, [name]: value })); setSuccess(null); };
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault(); setError(null); setSuccess(null);
        const validation = updateUserInput.safeParse(formData);
        if (!validation.success) { setError("Add a name of at least 3 characters and a short bio before saving."); return; }
        setLoading(true);
        try { await axios.put(`${BACKEND_URL}/api/v1/user/updateUser`, validation.data, { headers: { Authorization: localStorage.getItem("token") || "" } }); setSuccess("Profile saved."); }
        catch (requestError) { setError(axios.isAxiosError(requestError) ? requestError.response?.data?.error || "Your profile could not be saved." : "Your profile could not be saved."); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen">
            <Appbar button={<ArrowLeft size={18} />} />
            <main id="main-content" className="page-shell pb-28 pt-12 sm:pt-20">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <header className="lg:col-span-5">
                        <p className="eyebrow rise">Public profile</p>
                        <h1 className="headline rise d-1 mt-3 text-4xl">Put a person behind the words.</h1>
                        <p className="rise d-2 mt-5 max-w-sm leading-7 text-muted">Readers see these details beside every story you publish.</p>

                        {/* live preview of the author card */}
                        <div className="rise d-3 mt-10 rounded-2xl border border-line bg-surface p-6">
                            <div className="flex items-center gap-3">
                                <Avatar name={formData.name || "?"} size="big" />
                                <div className="min-w-0">
                                    <p className="truncate font-semibold">{formData.name || "Your name"}</p>
                                    <p className="truncate text-sm text-muted">{formData.occupation || "Writer"}</p>
                                </div>
                            </div>
                            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">{formData.bio || "A line or two about what you notice and write about."}</p>
                        </div>
                    </header>

                    <section className="rise d-2 lg:col-span-7">
                        {error && <p role="alert" className="notice-error drop mb-6">{error}</p>}
                        {success && <p role="status" className="notice-success drop mb-6 flex items-center gap-2"><Check size={16} />{success}</p>}
                        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
                            {fetching && <div role="status" className="flex items-center gap-2 text-sm text-muted"><LoaderCircle size={16} className="animate-spin" />Loading profile…</div>}
                            <ProfileField label="Name" name="name" value={formData.name} placeholder="Your name" onChange={handleChange} />
                            <ProfileField label="Occupation" name="occupation" value={formData.occupation} placeholder="Writer, student, designer…" onChange={handleChange} />
                            <ProfileField label="Bio" name="bio" value={formData.bio} placeholder="What do you write about?" onChange={handleChange} multiline />
                            <button type="submit" disabled={loading || fetching} className="button-primary">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{loading ? "Saving…" : "Save profile"}</button>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
};

const ProfileField = ({ label, name, value, placeholder, onChange, multiline = false }: { label: string; name: string; value: string; placeholder: string; onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; multiline?: boolean; }) => (
    <div>
        <label htmlFor={`profile-${name}`} className="field-label">{label}</label>
        {multiline
            ? <textarea id={`profile-${name}`} name={name} value={value} onChange={onChange} className="text-field min-h-36 resize-y !leading-7" placeholder={placeholder} rows={5} />
            : <input id={`profile-${name}`} name={name} value={value} onChange={onChange} className="text-field" placeholder={placeholder} />}
    </div>
);

export default UpdateUser;
