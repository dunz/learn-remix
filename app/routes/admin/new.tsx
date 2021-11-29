import {useEffect, useState } from "react";
import {ActionFunction, Form, redirect, useActionData, useTransition} from "remix";
import invariant from "tiny-invariant";
import { createPost } from "~/post";

function ValidationMessage({ error, isSubmitting }) {
    let [show, setShow] = useState(!!error);

    useEffect(() => {
        let id = setTimeout(() => {
            console.log('error', error)
            let hasError = !!error;
            console.log('hasError', hasError)
            console.log('!isSubmitting', !isSubmitting)
            setShow(hasError && !isSubmitting);
        });
        return () => clearTimeout(id);
    }, [error, isSubmitting]);

    return (
        <div
            style={{
                opacity: show ? 1 : 0,
                height: show ? "1em" : 0,
                color: "red",
                transition: "all 300ms ease-in-out"
            }}
        >
            error: {error}
        </div>
    );
}

export let action: ActionFunction = async ({ request }) => {
    // await new Promise(res => setTimeout(res, 1000));

    let formData = await request.formData();

    let title = formData.get("title");
    let slug = formData.get("slug");
    let markdown = formData.get("markdown");

    let errors: {title?: boolean, slug?: boolean, markdown?: boolean} = {};
    if (!title) errors.title = true;
    if (!slug) errors.slug = true;
    if (!markdown) errors.markdown = true;

    if (Object.keys(errors).length) {
        return {errors, values: Object.fromEntries(formData)};
    }

    invariant(typeof title === "string");
    invariant(typeof slug === "string");
    invariant(typeof markdown === "string");
    await createPost({ title, slug, markdown });

    return redirect("/admin");
};

export default function NewPost() {
    let actionData = useActionData();
    let transition = useTransition();

    return (
        <Form method="post" reloadDocument>
            <fieldset
                disabled={transition.state === "submitting"}
            >
                <p>
                    <label>
                        Post Title:{" "}
                        {actionData?.errors.title && <em>Title is required</em>}
                        <input type="text" name="title" style={{
                            borderColor: actionData?.errors.title
                                ? "red"
                                : ""
                        }}
                            defaultValue={actionData?.values.title}
                        />
                    </label>
                </p>
                {actionData?.errors.title && (
                    <ValidationMessage
                        isSubmitting={transition.state === "submitting"}
                        error={actionData?.errors?.title}
                    />
                )}

                <p>
                    <label>
                        Post Slug:{" "}
                        {actionData?.errors.slug && <em>Slug is required</em>}
                        <input type="text" name="slug" defaultValue={actionData?.values.slug} />
                    </label>
                </p>

                <ValidationMessage
                    isSubmitting={transition.state === "submitting"}
                    error={actionData?.errors.slug}
                />

                <p>
                    <label htmlFor="markdown">Markdown:</label>{" "}
                    {actionData?.errors.markdown && <em>Markdown is required</em>}
                    <br />
                    <textarea rows={20} name="markdown" defaultValue={actionData?.values.markdown} />
                </p>

                <ValidationMessage
                    isSubmitting={transition.state === "submitting"}
                    error={actionData?.errors.markdown}
                />

                <p>
                    <button type="submit">
                        {transition.submission
                            ? "Creating..."
                            : "Create Post"}
                    </button>
                </p>
            </fieldset>
        </Form>
    );
}