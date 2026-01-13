import { Card, CardContent, CardHeader } from "@/components/common/ui/card";

export default function Preview({ children }: { children: React.ReactNode }) {
	return (
		<Card className="p-0 shadow-none gap-0">
			<CardHeader className="p-4 h-[50px] flex items-center bg-muted rounded-t-xl">
				<h3 className="text-foreground font-semibold text-sm">Preview</h3>
			</CardHeader>
			<CardContent className="p-0 h-full border-t border-t-border">
				{children}
			</CardContent>
		</Card>
	)
}