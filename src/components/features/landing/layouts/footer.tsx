import { Link } from "rasengan";

export default function Footer() {
	return (
		<footer className="w-full h-[60px] border-t border-t-border text-sm">
			<div className="w-full h-full max-w-[1200px] mx-auto px-4 flex items-center justify-between text-foreground/60">
				<div>
					<p>Built by <Link to="https://dilane3.dev" target="_blank" className="font-medium text-foreground hover:underline cursor-pointer transition-all duration-300">Dilane3</Link> at <Link to="https://github.com/rasengan-dev" target="_blank" className="font-medium text-foreground hover:underline cursor-pointer transition-all duration-300">Rasengan Labs</Link></p>
				</div>

				<div>
					<ul className="flex items-center gap-4">
						<li className="hover:text-foreground hover:underline hover:font-medium cursor-pointer transition-all duration-300">
							<Link to="https://github.com/rasengan-dev/nindo" target="_blank">Github</Link>
						</li>
						<li className="hover:text-foreground hover:underline hover:font-medium cursor-pointer transition-all duration-300">
							<Link to="/docs">Docs</Link>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	)
}