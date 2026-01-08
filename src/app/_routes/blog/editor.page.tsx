import { MarkdownEditor } from "@/registry/nindo/editors/markdown";
import { useState } from "react";

export default function Page() {
	const [content, setContent] = useState("");

	return (
		<section className="w-full py-16">
			<div className="max-w-[1500px] mx-auto">
				<MarkdownEditor defaultContent={content} onChangeContent={setContent} />
			</div>
		</section>
	)
}