import {Link, LoaderFunction, useLoaderData} from "remix";
import { getPosts } from "~/post";
import type { Post } from "~/post";

export const loader: LoaderFunction = (): Promise<Post[]> => getPosts()

const Posts = () => {
    const posts = useLoaderData<Post[]>();
    return <div>
        <h1>Posts2</h1>
        <ul>
            {posts.map(post => (
                <li key={post.slug}>
                    <Link to={post.slug}>{post.title}</Link>
                </li>
            ))}
        </ul>
    </div>
}



export default Posts