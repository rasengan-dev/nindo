import { Link } from "rasengan";

type Props = {
	children?: React.ReactNode
}
export default function Footer({ children }: Props) {
	return (
		<footer className="w-full h-[60px] border-t border-t-border text-sm">
			{children}

			<div className="w-full h-full max-w-[1200px] mx-auto px-4 flex items-center justify-center gap-1 text-center text-sm text-foreground">
				Built by 
				<Link to="https://x.com/dilanekombou" target="_blank" className="font-semibold underline underline-offset-4">dilane3</Link> 
				with 
				<Link to="https://rasengan.dev" target="_blank" className="font-semibold underline underline-offset-4">Rasengan</Link>. 
				The source code is available on 
				<Link to="https://github.com/rasengan-dev/nindo" target="_blank" className="font-semibold underline underline-offset-4">GitHub</Link>.
			</div>
		</footer>
	)
}