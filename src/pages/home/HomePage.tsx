import {
	ArrowRight,
	CheckCircle,
	Code2,
	Github,
	Globe,
	Layers3,
	Play,
	Sparkles,
	Target,
	Wand2,
	Zap,
} from 'lucide-react';
import { useState } from 'react';
import { CloneGallery } from '../../features/clones/components/CloneGallery';
import { WebsiteAnalyzer } from '../../features/clones/components/WebsiteAnalyzer';
import { Badge } from '../../shared/components/ui/badge';
import { Button } from '../../shared/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../../shared/components/ui/card';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../../shared/components/ui/tabs';

export function HomePage() {
	const [activeTab, setActiveTab] = useState('analyzer');

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
			{/* Navigation - Advanced Flexbox with better spacing */}
			<nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
					<div className="flex items-center justify-between h-16">
						{/* Logo Section - Flex */}
						<div className="flex items-center space-x-3 flex-shrink-0">
							<div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
								<Code2 className="w-5 h-5 text-white" />
							</div>
							<span className="text-xl font-bold text-gray-900 tracking-tight">
								CloneAI
							</span>
						</div>

						{/* Action Section - Flex */}
						<div className="flex items-center space-x-6">
							<div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
								<a
									href="#features"
									className="hover:text-indigo-600 transition-colors"
								>
									Features
								</a>
								<a
									href="#demo"
									className="hover:text-indigo-600 transition-colors"
								>
									Demo
								</a>
								<a
									href="#pricing"
									className="hover:text-indigo-600 transition-colors"
								>
									Pricing
								</a>
							</div>
							<Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-lg hover:shadow-xl transition-all duration-300">
								<Sparkles className="w-4 h-4 mr-2" />
								Try Free
							</Button>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section - Advanced Grid Layout with better responsive design */}
			<section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
				{/* Background decoration */}
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
				<div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
				<div className="absolute top-40 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />

				<div className="container mx-auto max-w-7xl relative z-10">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[85vh]">
						{/* Hero Content - Grid column span with perfect centering */}
						<div className="lg:col-span-7 flex flex-col justify-center space-y-10">
							{/* Badge Section - Centered flex */}
							<div className="flex items-center justify-center lg:justify-start">
								<Badge
									variant="outline"
									className="px-6 py-3 text-indigo-600 border-indigo-200 bg-indigo-50/50 backdrop-blur-sm"
								>
									<Wand2 className="w-4 h-4 mr-2" />
									AI-Powered Website Cloning
								</Badge>
							</div>

							{/* Main heading and description */}
							<div className="text-center lg:text-left space-y-8">
								<h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight tracking-tight">
									Clone Any Website
									<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent block mt-2">
										In Seconds
									</span>
								</h1>

								<p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
									Transform any website into clean React components with AI.
									Just paste a URL and get production-ready code instantly.
								</p>
							</div>

							{/* Action Buttons - Enhanced Flexbox */}
							<div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
								<Button
									onClick={() => setActiveTab('analyzer')}
									size="lg"
									className="flex items-center justify-center h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold group transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
								>
									<Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
									Start Cloning
									<ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
								</Button>
								<Button
									onClick={() => setActiveTab('gallery')}
									variant="outline"
									size="lg"
									className="flex items-center justify-center h-16 px-10 border-2 border-gray-300 hover:bg-gray-50 text-lg font-semibold transition-all duration-300 hover:scale-105"
								>
									View Examples
								</Button>
							</div>

							{/* Stats Grid - Enhanced responsive grid */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
								<div className="flex items-center justify-center lg:justify-start space-x-3 text-base text-gray-600">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
									<span className="font-medium">Free to start</span>
								</div>
								<div className="flex items-center justify-center lg:justify-start space-x-3 text-base text-gray-600">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
									<span className="font-medium">No setup required</span>
								</div>
								<div className="flex items-center justify-center lg:justify-start space-x-3 text-base text-gray-600">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
									<span className="font-medium">Production ready</span>
								</div>
							</div>
						</div>

						{/* Hero Visual/Demo - Enhanced Grid column with better visual */}
						<div className="lg:col-span-5 flex items-center justify-center">
							<div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-8 backdrop-blur-sm relative">
								{/* Browser chrome */}
								<div className="flex items-center space-x-3 mb-6">
									<div className="flex space-x-2">
										<div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
										<div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm" />
										<div className="w-3 h-3 bg-green-500 rounded-full shadow-sm" />
									</div>
									<div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500 font-mono">
										https://example.com
									</div>
								</div>

								{/* Mock website content with better grid layout */}
								<div className="space-y-6">
									<div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
									<div className="grid grid-cols-3 gap-3">
										<div className="h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg" />
										<div className="h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg" />
										<div className="h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg" />
									</div>
									<div className="space-y-3">
										<div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
										<div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-4/5" />
										<div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-3/5" />
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div className="h-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg" />
										<div className="h-10 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg" />
									</div>
								</div>

								{/* Floating elements for visual appeal */}
								<div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
									<Sparkles className="w-4 h-4 text-white" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Demo Section - Centered Layout with header on top */}
			<section
				id="demo"
				className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/80 backdrop-blur-sm"
			>
				<div className="container mx-auto max-w-7xl">
					{/* Section Header - Centered at top */}
					<div className="text-center mb-16 space-y-8">
						<h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
							Try It Now
						</h2>
						<p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
							Paste any website URL and watch the magic happen
						</p>

						{/* Feature Grid - Centered below header */}
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto pt-8">
							<div className="flex flex-col items-center space-y-3 group">
								<div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<Zap className="w-7 h-7 text-indigo-600" />
								</div>
								<div className="text-center space-y-1">
									<h3 className="font-bold text-gray-900 text-lg">
										Lightning Fast
									</h3>
									<p className="text-gray-600 text-sm">Under 30s</p>
								</div>
							</div>

							<div className="flex flex-col items-center space-y-3 group">
								<div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<Code2 className="w-7 h-7 text-purple-600" />
								</div>
								<div className="text-center space-y-1">
									<h3 className="font-bold text-gray-900 text-lg">
										Clean Code
									</h3>
									<p className="text-gray-600 text-sm">TypeScript ready</p>
								</div>
							</div>

							<div className="flex flex-col items-center space-y-3 group">
								<div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<Target className="w-7 h-7 text-green-600" />
								</div>
								<div className="text-center space-y-1">
									<h3 className="font-bold text-gray-900 text-lg">
										Pixel Perfect
									</h3>
									<p className="text-gray-600 text-sm">100% accurate</p>
								</div>
							</div>

							<div className="flex flex-col items-center space-y-3 group">
								<div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<Layers3 className="w-7 h-7 text-blue-600" />
								</div>
								<div className="text-center space-y-1">
									<h3 className="font-bold text-gray-900 text-lg">Modular</h3>
									<p className="text-gray-600 text-sm">Reusable</p>
								</div>
							</div>
						</div>
					</div>

					{/* Interactive Demo Component - Centered and Larger */}
					<div className="flex justify-center">
						<div className="w-full max-w-4xl">
							<div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
								<Tabs
									value={activeTab}
									onValueChange={setActiveTab}
									className="w-full"
								>
									<div className="flex flex-col space-y-10 p-10">
										{/* Tab header - Better flex layout */}
										<div className="flex items-center justify-between">
											<TabsList className="grid w-full max-w-md grid-cols-2 bg-transparent py-2 rounded-xl ">
												<TabsTrigger
													value="analyzer"
													className="flex items-center space-x-2 rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 text-gray-600 hover:text-gray-900 transition-all duration-200"
												>
													<Globe className="w-5 h-5" />
													<span className="font-medium text-base">
														Analyzer
													</span>
												</TabsTrigger>
												<TabsTrigger
													value="gallery"
													className="flex items-center space-x-2 rounded-lg px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 text-gray-600 hover:text-gray-900 transition-all duration-200"
												>
													<Layers3 className="w-5 h-5" />
													<span className="font-medium text-base">Gallery</span>
												</TabsTrigger>
											</TabsList>

											<div className="flex items-center space-x-3">
												<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
												<span className="text-base text-gray-600 font-medium">
													AI Online
												</span>
											</div>
										</div>

										<TabsContent value="analyzer" className="mt-0">
											<WebsiteAnalyzer />
										</TabsContent>

										<TabsContent value="gallery" className="mt-0">
											<CloneGallery />
										</TabsContent>
									</div>
								</Tabs>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section - Advanced Grid Layout with better visual hierarchy */}
			<section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
				<div className="container mx-auto max-w-7xl">
					{/* Section header - Centered with max-width */}
					<div className="text-center mb-20 max-w-4xl mx-auto">
						<h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
							Why Developers Love CloneAI
						</h2>
						<p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed">
							Built for modern development workflows with enterprise-grade
							reliability
						</p>
					</div>

					{/* Features Grid - Better responsive design */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
						<Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden hover:-translate-y-2">
							<CardHeader className="space-y-6 p-8">
								<div className="flex items-center justify-between">
									<div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-200 transition-all duration-300">
										<Zap className="w-7 h-7 text-indigo-600" />
									</div>
									<div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-full">
										30s
									</div>
								</div>
								<CardTitle className="text-2xl font-bold">
									Lightning Fast
								</CardTitle>
							</CardHeader>
							<CardContent className="px-8 pb-8">
								<p className="text-gray-600 leading-relaxed text-lg mb-6">
									Generate production-ready React components in under 30 seconds
									with advanced AI processing
								</p>
								<div className="flex items-center space-x-3 text-base text-gray-500">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
									<span className="font-medium">99.9% uptime guaranteed</span>
								</div>
							</CardContent>
						</Card>

						<Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden hover:-translate-y-2">
							<CardHeader className="space-y-6 p-8">
								<div className="flex items-center justify-between">
									<div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
										<Code2 className="w-7 h-7 text-purple-600" />
									</div>
									<div className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-2 rounded-full">
										Clean
									</div>
								</div>
								<CardTitle className="text-2xl font-bold">Clean Code</CardTitle>
							</CardHeader>
							<CardContent className="px-8 pb-8">
								<p className="text-gray-600 leading-relaxed text-lg mb-6">
									TypeScript, Tailwind CSS, and modern React patterns. No
									cleanup needed
								</p>
								<div className="flex items-center space-x-3 text-base text-gray-500">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
									<span className="font-medium">Production-ready output</span>
								</div>
							</CardContent>
						</Card>

						<Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden hover:-translate-y-2 md:col-span-2 lg:col-span-1">
							<CardHeader className="space-y-6 p-8">
								<div className="flex items-center justify-between">
									<div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-green-200 transition-all duration-300">
										<Target className="w-7 h-7 text-green-600" />
									</div>
									<div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-full">
										100%
									</div>
								</div>
								<CardTitle className="text-2xl font-bold">
									Pixel Perfect
								</CardTitle>
							</CardHeader>
							<CardContent className="px-8 pb-8">
								<p className="text-gray-600 leading-relaxed text-lg mb-6">
									AI-powered analysis ensures your components match the original
									design exactly
								</p>
								<div className="flex items-center space-x-3 text-base text-gray-500">
									<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
									<span className="font-medium">Responsive by default</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section - Enhanced Grid Layout with better visual impact */}
			<section
				id="pricing"
				className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 relative overflow-hidden"
			>
				{/* Background decoration */}
				<div className="absolute inset-0 bg-black/20" />
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl" />

				<div className="container mx-auto max-w-5xl relative z-10">
					<div className="grid grid-cols-1 gap-12 text-center text-white">
						{/* Main CTA content */}
						<div className="space-y-8">
							<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
								Ready to Build Faster?
							</h2>
							<p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto font-light leading-relaxed">
								Join thousands of developers already using CloneAI to accelerate
								their workflow
							</p>
						</div>

						{/* Action buttons with better flex layout */}
						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
							<Button
								size="lg"
								className="bg-white text-indigo-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
							>
								<Play className="w-6 h-6 mr-3" />
								Start Free Trial
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-white text-indigo-600 hover:bg-gray-100 px-10 py-4 text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
							>
								<Github className="w-6 h-6 mr-3" />
								View on GitHub
							</Button>
						</div>

						{/* Stats Grid - Enhanced design */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pt-16 border-t border-white/20">
							<div className="flex flex-col items-center space-y-3 group">
								<div className="text-4xl sm:text-5xl font-bold group-hover:scale-110 transition-transform duration-300">
									10K+
								</div>
								<div className="text-indigo-200 text-lg font-medium">
									Websites Analyzed
								</div>
							</div>
							<div className="flex flex-col items-center space-y-3 group">
								<div className="text-4xl sm:text-5xl font-bold group-hover:scale-110 transition-transform duration-300">
									50K+
								</div>
								<div className="text-indigo-200 text-lg font-medium">
									Components Generated
								</div>
							</div>
							<div className="flex flex-col items-center space-y-3 group">
								<div className="text-4xl sm:text-5xl font-bold group-hover:scale-110 transition-transform duration-300">
									99.9%
								</div>
								<div className="text-indigo-200 text-lg font-medium">
									Uptime
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer - Enhanced Flex Layout with better structure */}
			<footer className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
				<div className="container mx-auto max-w-7xl">
					{/* Main footer content */}
					<div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 pb-12">
						{/* Logo and brand */}
						<div className="flex items-center space-x-4">
							<div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
								<Code2 className="w-6 h-6 text-white" />
							</div>
							<div className="flex flex-col">
								<span className="text-2xl font-bold text-white">CloneAI</span>
								<span className="text-sm text-gray-400">
									Clone any website with AI
								</span>
							</div>
						</div>

						{/* Navigation links */}
						<div className="flex items-center space-x-8 text-gray-400">
							<a
								href="/privacy"
								className="hover:text-white transition-colors duration-300 font-medium"
							>
								Privacy
							</a>
							<a
								href="/terms"
								className="hover:text-white transition-colors duration-300 font-medium"
							>
								Terms
							</a>
							<a
								href="/docs"
								className="hover:text-white transition-colors duration-300 font-medium"
							>
								Documentation
							</a>
							<a
								href="/support"
								className="hover:text-white transition-colors duration-300 font-medium"
							>
								Support
							</a>
						</div>

						{/* Social links */}
						<div className="flex items-center space-x-4">
							<Button
								variant="outline"
								size="sm"
								className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
							>
								<Github className="w-4 h-4" />
							</Button>
						</div>
					</div>

					{/* Bottom border and copyright */}
					<div className="border-t border-gray-800 pt-8 text-center">
						<p className="text-gray-400 text-lg">
							&copy; 2024 CloneAI. Built with{' '}
							<span className="text-red-500">❤️</span> for developers.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
