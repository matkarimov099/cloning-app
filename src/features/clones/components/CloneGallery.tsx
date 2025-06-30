import {
	AlertCircle,
	Bookmark,
	Calendar,
	CheckCircle,
	Clock,
	Code,
	Download,
	ExternalLink,
	Eye,
	Filter,
	Grid,
	Heart,
	List,
	Pause,
	Play,
	Plus,
	Search,
	Share2,
	Sparkles,
	Star,
	TrendingUp,
	Users,
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
import { Input } from '../../../shared/components/ui/input';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../../../shared/components/ui/tabs';

// Mock data - real implementation da backend dan keladi
const mockProjects = [
	{
		id: 'instagram-clone',
		name: 'Instagram Clone',
		description:
			"Instagram ning asosiy funksiyalari bilan to'liq klon. Feed, stories, va profile sahifalari.",
		url: 'https://instagram.com',
		status: 'completed' as const,
		difficulty: 'hard' as const,
		components: 15,
		progress: 100,
		thumbnail: '/thumbnails/instagram.png',
		technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Shadcn/UI'],
		createdAt: '2024-01-15',
		likes: 42,
		views: 1250,
		downloads: 89,
	},
	{
		id: 'youtube-clone',
		name: 'YouTube Clone',
		description:
			'Video streaming platform kloni. Video player, comments va playlists bilan.',
		url: 'https://youtube.com',
		status: 'analyzing' as const,
		difficulty: 'hard' as const,
		components: 8,
		progress: 35,
		thumbnail: '/thumbnails/youtube.png',
		technologies: ['React', 'TypeScript', 'Video.js', 'Node.js'],
		createdAt: '2024-01-20',
		likes: 28,
		views: 890,
		downloads: 45,
	},
	{
		id: 'twitter-clone',
		name: 'Twitter Clone',
		description:
			'Mikroblog platformasi kloni. Tweet, retweet va trending topics.',
		url: 'https://twitter.com',
		status: 'generated' as const,
		difficulty: 'medium' as const,
		components: 12,
		progress: 80,
		thumbnail: '/thumbnails/twitter.png',
		technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'],
		createdAt: '2024-01-25',
		likes: 35,
		views: 1100,
		downloads: 67,
	},
	{
		id: 'spotify-clone',
		name: 'Spotify Clone',
		description:
			'Musiqa streaming platformasi. Player controls va playlist management.',
		url: 'https://spotify.com',
		status: 'completed' as const,
		difficulty: 'hard' as const,
		components: 18,
		progress: 100,
		thumbnail: '/thumbnails/spotify.png',
		technologies: ['React', 'TypeScript', 'Web Audio API', 'Redux'],
		createdAt: '2024-01-10',
		likes: 52,
		views: 1800,
		downloads: 112,
	},
	{
		id: 'airbnb-clone',
		name: 'Airbnb Clone',
		description: 'Uy ijarasi platformasi. Booking system va interactive map.',
		url: 'https://airbnb.com',
		status: 'generated' as const,
		difficulty: 'medium' as const,
		components: 14,
		progress: 90,
		thumbnail: '/thumbnails/airbnb.png',
		technologies: ['React', 'TypeScript', 'Mapbox', 'Stripe'],
		createdAt: '2024-01-18',
		likes: 31,
		views: 750,
		downloads: 38,
	},
	{
		id: 'netflix-clone',
		name: 'Netflix Clone',
		description: 'Video streaming service. Movie catalog va video player.',
		url: 'https://netflix.com',
		status: 'analyzing' as const,
		difficulty: 'hard' as const,
		components: 10,
		progress: 25,
		thumbnail: '/thumbnails/netflix.png',
		technologies: ['React', 'TypeScript', 'HLS.js', 'AWS'],
		createdAt: '2024-01-22',
		likes: 19,
		views: 420,
		downloads: 12,
	},
];

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'popular' | 'progress' | 'trending';
type FilterOption = 'all' | 'completed' | 'analyzing' | 'generated';

export function CloneGallery() {
	const [searchQuery, setSearchQuery] = useState('');
	const [viewMode, setViewMode] = useState<ViewMode>('grid');
	const [sortBy, setSortBy] = useState<SortOption>('newest');
	const [filterBy, setFilterBy] = useState<FilterOption>('all');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const filteredProjects = mockProjects.filter((project) => {
		const matchesSearch =
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.technologies.some((tech) =>
				tech.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		const matchesFilter = filterBy === 'all' || project.status === filterBy;
		const matchesTags =
			selectedTags.length === 0 ||
			selectedTags.some((tag) => project.technologies.includes(tag));

		return matchesSearch && matchesFilter && matchesTags;
	});

	const sortedProjects = [...filteredProjects].sort((a, b) => {
		switch (sortBy) {
			case 'newest':
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case 'oldest':
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			case 'popular':
				return b.likes - a.likes;
			case 'progress':
				return b.progress - a.progress;
			case 'trending':
				return b.views - a.views;
			default:
				return 0;
		}
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed':
				return 'bg-green-500';
			case 'analyzing':
				return 'bg-blue-500';
			case 'generated':
				return 'bg-purple-500';
			default:
				return 'bg-gray-500';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'completed':
				return 'Tugallangan';
			case 'analyzing':
				return 'Tahlil qilinmoqda';
			case 'generated':
				return 'Yaratilgan';
			default:
				return "Noma'lum";
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case 'easy':
				return 'text-green-600 bg-green-50 border-green-200';
			case 'medium':
				return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'hard':
				return 'text-red-600 bg-red-50 border-red-200';
			default:
				return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	};

	const getAllTechnologies = () => {
		const allTechs = mockProjects.flatMap((project) => project.technologies);
		return [...new Set(allTechs)];
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<div className="text-center space-y-4">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border">
						<Sparkles className="w-4 h-4 text-purple-600" />
						<span className="text-sm font-medium text-gray-700">
							Clone Gallery
						</span>
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						Website Klonlari Gallereyasi
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						AI yordamida yaratilgan zamonaviy website klonlarini ko'ring, yuklab
						oling va o'rganing
					</p>
				</div>

				{/* Filter Controls */}
				<Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
					<CardContent className="pt-6">
						<div className="flex flex-col lg:flex-row gap-4">
							{/* Search */}
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
									<Input
										placeholder="Loyiha, texnologiya yoki tavsif bo'yicha qidiring..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 h-12"
									/>
								</div>
							</div>

							{/* Filters */}
							<div className="flex gap-2">
								<Button
									variant={filterBy === 'all' ? 'default' : 'outline'}
									onClick={() => setFilterBy('all')}
									size="sm"
								>
									Barchasi
								</Button>
								<Button
									variant={filterBy === 'completed' ? 'default' : 'outline'}
									onClick={() => setFilterBy('completed')}
									size="sm"
								>
									<CheckCircle className="w-4 h-4 mr-2" />
									Tugallangan
								</Button>
								<Button
									variant={filterBy === 'analyzing' ? 'default' : 'outline'}
									onClick={() => setFilterBy('analyzing')}
									size="sm"
								>
									<AlertCircle className="w-4 h-4 mr-2" />
									Jarayonda
								</Button>
								<Button
									variant={filterBy === 'generated' ? 'default' : 'outline'}
									onClick={() => setFilterBy('generated')}
									size="sm"
								>
									<Code className="w-4 h-4 mr-2" />
									Yaratilgan
								</Button>
							</div>

							{/* View Mode */}
							<div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
								<Button
									variant={viewMode === 'grid' ? 'default' : 'ghost'}
									size="sm"
									onClick={() => setViewMode('grid')}
								>
									<Grid className="w-4 h-4" />
								</Button>
								<Button
									variant={viewMode === 'list' ? 'default' : 'ghost'}
									size="sm"
									onClick={() => setViewMode('list')}
								>
									<List className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Technology Tags */}
						<div className="mt-4 pt-4 border-t">
							<div className="flex items-center gap-2 mb-3">
								<Filter className="w-4 h-4 text-gray-500" />
								<span className="text-sm font-medium text-gray-700">
									Texnologiyalar:
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{getAllTechnologies().map((tech) => (
									<Button
										key={tech}
										variant={
											selectedTags.includes(tech) ? 'default' : 'outline'
										}
										size="sm"
										onClick={() => toggleTag(tech)}
										className="h-8 text-xs"
									>
										{tech}
									</Button>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Sort and Stats */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<span className="text-sm text-gray-600">
							{sortedProjects.length} ta loyiha topildi
						</span>
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">Saralash:</span>
							<div className="flex gap-1">
								{[
									{
										value: 'newest',
										label: 'Yangi',
										icon: <Calendar className="w-4 h-4" />,
									},
									{
										value: 'popular',
										label: 'Mashhur',
										icon: <Heart className="w-4 h-4" />,
									},
									{
										value: 'trending',
										label: 'Trend',
										icon: <TrendingUp className="w-4 h-4" />,
									},
								].map((sort) => (
									<Button
										key={sort.value}
										variant={sortBy === sort.value ? 'default' : 'outline'}
										size="sm"
										onClick={() => setSortBy(sort.value as SortOption)}
										className="h-8"
									>
										{sort.icon}
										<span className="ml-1 hidden sm:inline">{sort.label}</span>
									</Button>
								))}
							</div>
						</div>
					</div>

					<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
						<Plus className="w-4 h-4 mr-2" />
						Yangi loyiha
					</Button>
				</div>

				{/* Projects */}
				<Tabs defaultValue="gallery" className="space-y-6">
					<TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
						<TabsTrigger
							value="gallery"
							className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
						>
							<Grid className="w-4 h-4 mr-2" />
							Galereya
						</TabsTrigger>
						<TabsTrigger
							value="favorites"
							className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
						>
							<Bookmark className="w-4 h-4 mr-2" />
							Saralanganlar
						</TabsTrigger>
					</TabsList>

					<TabsContent value="gallery">
						{viewMode === 'grid' ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{sortedProjects.map((project) => (
									<Card
										key={project.id}
										className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
									>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<div
															className={`w-2 h-2 rounded-full ${getStatusColor(
																project.status,
															)}`}
														/>
														<Badge variant="secondary" className="text-xs">
															{getStatusText(project.status)}
														</Badge>
													</div>
													<CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
														{project.name}
													</CardTitle>
												</div>
												<Button
													variant="ghost"
													size="sm"
													className="opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<ExternalLink className="w-4 h-4" />
												</Button>
											</div>
											<p className="text-sm text-gray-600 line-clamp-2">
												{project.description}
											</p>
										</CardHeader>

										<CardContent className="space-y-4">
											{/* Progress */}
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-gray-600">Progress</span>
													<span className="font-medium">
														{project.progress}%
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div
														className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
														style={{ width: `${project.progress}%` }}
													/>
												</div>
											</div>

											{/* Stats */}
											<div className="grid grid-cols-3 gap-4 text-center">
												<div>
													<div className="text-lg font-semibold text-purple-600">
														{project.components}
													</div>
													<div className="text-xs text-gray-500">
														Komponentlar
													</div>
												</div>
												<div>
													<div className="text-lg font-semibold text-pink-600">
														{project.likes}
													</div>
													<div className="text-xs text-gray-500">Likes</div>
												</div>
												<div>
													<div className="text-lg font-semibold text-blue-600">
														{project.views}
													</div>
													<div className="text-xs text-gray-500">
														Ko'rishlar
													</div>
												</div>
											</div>

											{/* Technologies */}
											<div className="space-y-2">
												<div className="text-sm font-medium text-gray-700">
													Texnologiyalar:
												</div>
												<div className="flex flex-wrap gap-1">
													{project.technologies.slice(0, 3).map((tech) => (
														<Badge
															key={tech}
															variant="outline"
															className="text-xs"
														>
															{tech}
														</Badge>
													))}
													{project.technologies.length > 3 && (
														<Badge variant="outline" className="text-xs">
															+{project.technologies.length - 3}
														</Badge>
													)}
												</div>
											</div>

											{/* Actions */}
											<div className="flex gap-2 pt-2 border-t">
												<Button
													size="sm"
													className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
												>
													<Eye className="w-4 h-4 mr-2" />
													Ko'rish
												</Button>
												<Button variant="outline" size="sm">
													<Download className="w-4 h-4" />
												</Button>
												<Button variant="outline" size="sm">
													<Share2 className="w-4 h-4" />
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							// List View
							<div className="space-y-4">
								{sortedProjects.map((project) => (
									<Card
										key={project.id}
										className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all"
									>
										<CardContent className="p-6">
											<div className="flex items-center gap-6">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<h3 className="text-lg font-semibold">
															{project.name}
														</h3>
														<Badge variant="secondary">
															{getStatusText(project.status)}
														</Badge>
														<Badge
															className={getDifficultyColor(project.difficulty)}
														>
															{project.difficulty}
														</Badge>
													</div>
													<p className="text-gray-600 mb-3">
														{project.description}
													</p>
													<div className="flex flex-wrap gap-2">
														{project.technologies.map((tech) => (
															<Badge
																key={tech}
																variant="outline"
																className="text-xs"
															>
																{tech}
															</Badge>
														))}
													</div>
												</div>

												<div className="text-center space-y-1">
													<div className="text-2xl font-bold text-purple-600">
														{project.progress}%
													</div>
													<div className="text-xs text-gray-500">Progress</div>
												</div>

												<div className="flex gap-2">
													<Button
														size="sm"
														className="bg-gradient-to-r from-purple-600 to-pink-600"
													>
														<Eye className="w-4 h-4 mr-2" />
														Ko'rish
													</Button>
													<Button variant="outline" size="sm">
														<Download className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						)}
					</TabsContent>

					<TabsContent value="favorites">
						<div className="text-center py-12">
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-0 shadow-xl max-w-md mx-auto">
								<Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-400" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Hech qanday saralangan loyiha yo'q
								</h3>
								<p className="text-gray-600 mb-4">
									Loyihalarni bookmark qilish uchun ♡ tugmasini bosing
								</p>
								<Button
									onClick={() => setFilterBy('all')}
									className="bg-gradient-to-r from-purple-600 to-pink-600"
								>
									<Grid className="w-4 h-4 mr-2" />
									Gallereyaga o'tish
								</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
