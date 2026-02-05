import ThemeButton from "@/components/component/atoms/theme-button";
import { Link } from "rasengan";

export default function Navbar() {
	return (
		<header className="w-full mx-auto px-6 h-[50px] flex items-center justify-between bg-background">
			<Link to="/">
				<div className="flex items-center gap-2">
					{/* <NotebookPen size={18} /> */}
					<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 256 256' enable-background='new 0 0 256 256' width='30' height='30'>
						<metadata> Nindo Logo : https://www.nindo.rasengan.dev/nindo.svg </metadata>
						<g>
							<g>
								<path fill='var(--primary)' d='M128,10c65.2,0,118,52.8,118,118c0,65.2-52.8,118-118,118c-65.2,0-118-52.8-118-118C10,62.8,62.8,10,128,10z M197.2,83.5c-0.1-0.7-0.1-1.5-0.2-2.3c-0.4-3.6-2-6.6-3.9-9.5c-2.4-3.4-5.3-6.5-8.6-9c-2.6-2-5.7-3-8.9-3.4c-0.2,0-0.4-0.1-0.6-0.2c-0.9,0-1.8,0-2.6,0c-0.1,0-0.3,0.1-0.4,0.1c-2.5,0.3-4.8,1.2-6.7,2.8c-3,2.6-6,5.4-9,8.1c0,0,0,0.1,0,0c9.8,9.8,19.6,19.6,29.4,29.4c0,0,0.1-0.1,0.2-0.2c2.6-2.6,5.3-5,7.9-7.7c1-1,1.8-2.3,2.4-3.6c0.6-1.3,0.7-2.8,1.1-4.2C197.2,83.8,197.2,83.6,197.2,83.5z M144.1,82.2c0-0.1-0.1,0-0.2,0.1c-23.5,23.6-47,47.1-70.5,70.7c-3.2,3.2-5.5,6.8-6.8,11c-2.3,7.2-4.5,14.4-6.6,21.6c-0.7,2.4-1.2,4.8-1.1,7.3c0.1,2.3,1.3,3.8,3.6,3.9c1.7,0.1,3.4,0,5-0.4c6.4-1.3,12.5-3.3,18.7-5.5c2.5-0.9,5-1.9,7.5-2.8c4.6-1.7,8.3-4.6,11.6-8c22.7-22.7,45.4-45.5,68.1-68.2c0.1-0.1,0.2-0.2,0.4-0.5C163.9,101.7,154,91.9,144.1,82.2z' />
							</g>
						</g>
					</svg>

					<span className="text-xl font-bold text-foreground">Nindo</span>
				</div>
			</Link>

			<div className="flex items-center space-x-4">
				<Link to="https://github.com/rasengan-dev/nindo" target='_blank'>
					<div className="flex items-center gap-2 text-foreground">
						<svg viewBox="0 0 1024 1024" fill="currentColor" className="size-4">
							<path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="currentColor" />
						</svg>

						{/* <span className="text-sm font-medium text-muted-foreground">10</span> */}
					</div>
				</Link>

				<div className="w-px h-4 bg-border"></div>

				<ThemeButton />
			</div>
		</header>
	)
}