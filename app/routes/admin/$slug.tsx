import {Link, useLoaderData} from "remix";
import type { LoaderFunction } from "remix";
import { getPost } from "~/post";
import invariant from "tiny-invariant";

export let loader: LoaderFunction = async ({ params }) => {
    invariant(params.slug, "expected params.slug");
    return getPost(params.slug);
};

export default function PostSlug() {
    let {html, slug} = useLoaderData();
    return (
        <>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <Link to={`/admin/new?slug=${slug}`}>Edit</Link>
        </>
    );
}