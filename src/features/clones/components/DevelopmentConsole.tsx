import {
	CheckCircle,
	Clock,
	Copy,
	Download,
	Play,
	Square,
	Terminal,
	Trash2,
	XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../../shared/components/ui/card';
import { ScrollArea } from '../../../shared/components/ui/scroll-area';
import { Separator } from '../../../shared/components/ui/separator';

interface AnalysisLog {
	id: string;
	timestamp: Date;
	type: 'info' | 'warning' | 'error' | 'success';
	message: string;
	details?: string | Record<string, unknown>;
}

interface DevelopmentConsoleProps {
	logs: AnalysisLog[];
	isRunning: boolean;
	onClear: () => void;
	onExport?: () => void;
}

export function DevelopmentConsole({
	logs,
	isRunning,
	onClear,
	onExport,
}: DevelopmentConsoleProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const getLogIcon = (type: AnalysisLog['type']) => {
		switch (type) {
			case 'success':
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case 'error':
				return <XCircle className="w-4 h-4 text-red-500" />;
			case 'warning':
				return <Clock className="w-4 h-4 text-yellow-500" />;
			default:
				return <Terminal className="w-4 h-4 text-blue-500" />;
		}
	};

	const getLogColor = (type: AnalysisLog['type']) => {
		switch (type) {
			case 'success':
				return 'text-green-700 bg-green-50 border-green-200';
			case 'error':
				return 'text-red-700 bg-red-50 border-red-200';
			case 'warning':
				return 'text-yellow-700 bg-yellow-50 border-yellow-200';
			default:
				return 'text-blue-700 bg-blue-50 border-blue-200';
		}
	};

	const formatTimestamp = (timestamp: Date) => {
		return timestamp.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	};

	const copyLogsToClipboard = () => {
		const logText = logs
			.map(
				(log) =>
					`[${formatTimestamp(log.timestamp)}] ${log.type.toUpperCase()}: ${
						log.message
					}`,
			)
			.join('\n');

		navigator.clipboard.writeText(logText);
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Terminal className="w-5 h-5" />
						<CardTitle className="text-lg">Development Console</CardTitle>
						<Badge variant={isRunning ? 'default' : 'secondary'}>
							{isRunning ? 'Running' : 'Idle'}
						</Badge>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsExpanded(!isExpanded)}
						>
							{isExpanded ? (
								<Square className="w-4 h-4" />
							) : (
								<Play className="w-4 h-4" />
							)}
							{isExpanded ? 'Collapse' : 'Expand'}
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={copyLogsToClipboard}
							disabled={logs.length === 0}
						>
							<Copy className="w-4 h-4" />
						</Button>

						{onExport && (
							<Button
								variant="outline"
								size="sm"
								onClick={onExport}
								disabled={logs.length === 0}
							>
								<Download className="w-4 h-4" />
							</Button>
						)}

						<Button
							variant="outline"
							size="sm"
							onClick={onClear}
							disabled={logs.length === 0}
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<ScrollArea
					className={`w-full ${
						isExpanded ? 'h-96' : 'h-48'
					} border rounded-md p-4 bg-gray-50`}
				>
					{logs.length === 0 ? (
						<div className="text-center text-muted-foreground py-8">
							<Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
							<p>Console bo'sh. Analiz boshlash uchun URL kiriting.</p>
						</div>
					) : (
						<div className="space-y-2">
							{logs.map((log) => (
								<div key={log.id} className="space-y-1">
									<div
										className={`p-2 rounded border ${getLogColor(log.type)}`}
									>
										<div className="flex items-start gap-2">
											{getLogIcon(log.type)}
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 text-sm">
													<span className="font-mono text-xs text-muted-foreground">
														{formatTimestamp(log.timestamp)}
													</span>
													<Badge variant="outline" className="text-xs">
														{log.type}
													</Badge>
												</div>
												<p className="text-sm mt-1 break-words">
													{log.message}
												</p>
												{log.details && (
													<details className="mt-2">
														<summary className="text-xs cursor-pointer text-muted-foreground">
															Details
														</summary>
														<pre className="text-xs mt-1 p-2 bg-white rounded border overflow-auto">
															{typeof log.details === 'string'
																? log.details
																: JSON.stringify(log.details, null, 2)}
														</pre>
													</details>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</ScrollArea>

				{logs.length > 0 && (
					<>
						<Separator className="my-4" />
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<span>{logs.length} ta log entry</span>
							<div className="flex items-center gap-4">
								<span className="flex items-center gap-1">
									<CheckCircle className="w-3 h-3 text-green-500" />
									{logs.filter((l) => l.type === 'success').length} success
								</span>
								<span className="flex items-center gap-1">
									<XCircle className="w-3 h-3 text-red-500" />
									{logs.filter((l) => l.type === 'error').length} errors
								</span>
								<span className="flex items-center gap-1">
									<Clock className="w-3 h-3 text-yellow-500" />
									{logs.filter((l) => l.type === 'warning').length} warnings
								</span>
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
