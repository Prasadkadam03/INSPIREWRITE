export const Quote = () => (
    <aside className="m-3 flex h-[calc(100%-1.5rem)] flex-col justify-between rounded-2xl bg-ink p-12 text-canvas">
        <p className="rise text-sm text-canvas/60">A community for people who notice things</p>
        <figure className="max-w-lg">
            <blockquote className="headline rise d-1 text-4xl xl:text-5xl">
                “A thought becomes clearer when someone else can read it.”
            </blockquote>
            <figcaption className="rise d-2 mt-6 text-canvas/60">Read closely. Write honestly. Leave the page better than you found it.</figcaption>
        </figure>
        <p className="rise d-3 text-sm font-medium text-canvas/60">InspireWrite</p>
    </aside>
);
