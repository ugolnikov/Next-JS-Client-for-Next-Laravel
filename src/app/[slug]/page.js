export default function Page({ params }) {
    const slug = params.slug;
    return <div>My Post: {slug}</div>;
}
