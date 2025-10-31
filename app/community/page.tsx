import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Award,
  Star,
  Heart,
  Eye,
  MessageCircle,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Zap,
  Lightbulb,
  HelpCircle,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Community Page
 * Forum, discussions, events, and member profiles
 * 
 * Created: October 31, 2025
 */

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  threads: number;
  posts: number;
  color: string;
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  solved: boolean;
  pinned: boolean;
  lastReply: string;
  tags: string[];
}

interface Event {
  id: string;
  title: string;
  type: 'webinar' | 'workshop' | 'meetup' | 'launch';
  date: string;
  time: string;
  attendees: number;
  maxAttendees?: number;
  host: string;
  description: string;
}

interface FeaturedMember {
  id: string;
  name: string;
  role: string;
  contributions: number;
  helpfulAnswers: number;
  avatar: string;
  badge: string;
}

const forumCategories: ForumCategory[] = [
  {
    id: 'general',
    name: 'General Discussion',
    description: 'General chat about CR AudioViz AI',
    icon: MessageSquare,
    threads: 1240,
    posts: 8920,
    color: 'blue'
  },
  {
    id: 'showcase',
    name: 'Show Your Work',
    description: 'Share your creations with the community',
    icon: Star,
    threads: 890,
    posts: 3450,
    color: 'purple'
  },
  {
    id: 'help',
    name: 'Help & Support',
    description: 'Get help from community members',
    icon: HelpCircle,
    threads: 2340,
    posts: 12890,
    color: 'green'
  },
  {
    id: 'tips',
    name: 'Tips & Tricks',
    description: 'Share best practices and workflows',
    icon: Lightbulb,
    threads: 670,
    posts: 4230,
    color: 'yellow'
  },
  {
    id: 'feature-requests',
    name: 'Feature Requests',
    description: 'Suggest new features and improvements',
    icon: Zap,
    threads: 450,
    posts: 2780,
    color: 'orange'
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official updates and news',
    icon: TrendingUp,
    threads: 120,
    posts: 890,
    color: 'red'
  }
];

const discussions: Discussion[] = [
  {
    id: '1',
    title: 'How I went from 0 to 100K followers using CR AudioViz AI',
    author: 'Sarah Mitchell',
    authorRole: 'Power User',
    category: 'Show Your Work',
    replies: 89,
    views: 3420,
    likes: 156,
    solved: false,
    pinned: true,
    lastReply: '2 hours ago',
    tags: ['Success Story', 'Social Media', 'Growth']
  },
  {
    id: '2',
    title: 'Best practices for AI image prompts - My complete guide',
    author: 'Marcus Chen',
    authorRole: 'Community Expert',
    category: 'Tips & Tricks',
    replies: 67,
    views: 2890,
    likes: 134,
    solved: false,
    pinned: true,
    lastReply: '4 hours ago',
    tags: ['AI Images', 'Prompts', 'Tutorial']
  },
  {
    id: '3',
    title: 'Tool not loading - anyone else experiencing this?',
    author: 'David Park',
    authorRole: 'Member',
    category: 'Help & Support',
    replies: 12,
    views: 456,
    likes: 8,
    solved: true,
    pinned: false,
    lastReply: '1 hour ago',
    tags: ['Bug', 'Technical']
  },
  {
    id: '4',
    title: 'Feature Request: Batch processing for images',
    author: 'Jennifer Williams',
    authorRole: 'Pro User',
    category: 'Feature Requests',
    replies: 45,
    views: 1230,
    likes: 89,
    solved: false,
    pinned: false,
    lastReply: '3 hours ago',
    tags: ['Feature Request', 'Workflow']
  },
  {
    id: '5',
    title: 'My complete workflow for client projects',
    author: 'Alex Turner',
    authorRole: 'Community Expert',
    category: 'Tips & Tricks',
    replies: 34,
    views: 1890,
    likes: 76,
    solved: false,
    pinned: false,
    lastReply: '5 hours ago',
    tags: ['Workflow', 'Productivity', 'Tutorial']
  },
  {
    id: '6',
    title: 'October 2025 Platform Update - What\'s New',
    author: 'CR AudioViz Team',
    authorRole: 'Staff',
    category: 'Announcements',
    replies: 78,
    views: 4560,
    likes: 234,
    solved: false,
    pinned: true,
    lastReply: '1 hour ago',
    tags: ['Update', 'Announcement', 'Features']
  }
];

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Master AI Image Generation - Live Workshop',
    type: 'workshop',
    date: 'Nov 5, 2025',
    time: '2:00 PM EST',
    attendees: 145,
    maxAttendees: 200,
    host: 'Sarah Mitchell',
    description: '90-minute hands-on workshop covering advanced AI image generation techniques'
  },
  {
    id: '2',
    title: 'New Features Launch Event',
    type: 'launch',
    date: 'Nov 10, 2025',
    time: '1:00 PM EST',
    attendees: 89,
    host: 'CR AudioViz Team',
    description: 'Join us for the reveal of our latest features and tools'
  },
  {
    id: '3',
    title: 'Community Coffee Chat - Marketing Tips',
    type: 'meetup',
    date: 'Nov 12, 2025',
    time: '10:00 AM EST',
    attendees: 34,
    maxAttendees: 50,
    host: 'Marcus Chen',
    description: 'Casual discussion about effective marketing strategies using our platform'
  }
];

const featuredMembers: FeaturedMember[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Creative Director',
    contributions: 234,
    helpfulAnswers: 156,
    avatar: '/avatars/sarah.jpg',
    badge: 'Power User'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    role: 'Content Creator',
    contributions: 189,
    helpfulAnswers: 134,
    avatar: '/avatars/marcus.jpg',
    badge: 'Community Expert'
  },
  {
    id: '3',
    name: 'Jessica Rodriguez',
    role: 'Business Owner',
    contributions: 145,
    helpfulAnswers: 98,
    avatar: '/avatars/jessica.jpg',
    badge: 'Top Contributor'
  },
  {
    id: '4',
    name: 'David Park',
    role: 'Marketing Specialist',
    contributions: 123,
    helpfulAnswers: 87,
    avatar: '/avatars/david.jpg',
    badge: 'Helpful Member'
  }
];

export default function CommunityPage() {
  const totalThreads = forumCategories.reduce((acc, cat) => acc + cat.threads, 0);
  const totalPosts = forumCategories.reduce((acc, cat) => acc + cat.posts, 0);
  const totalMembers = 10240;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Community
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Connect with creators, share your work, get help, and learn from 10,000+ 
              community members using CR AudioViz AI.
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-sm mb-8">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{totalMembers.toLocaleString()} members</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>{totalThreads.toLocaleString()} discussions</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Active daily</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Join Community
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Browse Forums
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalThreads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Discussions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalPosts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Community Forums</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discuss, share, and learn with fellow CR AudioViz AI users
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forumCategories.map((category) => (
              <Link key={category.id} href={`/community/forum/${category.id}`}>
                <Card className="hover:shadow-xl transition-all cursor-pointer group h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-${category.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                      </div>
                      <Badge variant="secondary">
                        {category.threads} threads
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{category.posts.toLocaleString()} posts</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Recent Discussions</h2>
              <p className="text-gray-600">Latest conversations in the community</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className={`hover:shadow-lg transition-shadow ${discussion.pinned ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {discussion.author.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {discussion.pinned && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Pinned
                              </Badge>
                            )}
                            {discussion.solved && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Solved
                              </Badge>
                            )}
                            <Badge variant="outline">{discussion.category}</Badge>
                          </div>
                          <Link href={`/community/discussion/${discussion.id}`}>
                            <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors mb-1">
                              {discussion.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600">
                            by <span className="font-medium">{discussion.author}</span>
                            {discussion.authorRole !== 'Member' && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {discussion.authorRole}
                              </Badge>
                            )}
                          </p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{discussion.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{discussion.likes} likes</span>
                        </div>
                        <span className="text-gray-500">Last reply {discussion.lastReply}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button>
              View All Discussions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join live workshops, webinars, and community meetups
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <div className={`h-2 ${
                  event.type === 'workshop' ? 'bg-blue-500' :
                  event.type === 'webinar' ? 'bg-purple-500' :
                  event.type === 'launch' ? 'bg-red-500' :
                  'bg-green-500'
                }`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {event.attendees} attending
                    </div>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Hosted by {event.host}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {event.description}
                  </p>

                  {event.maxAttendees && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                          {event.attendees}/{event.maxAttendees} spots filled
                        </span>
                        <span className="font-medium text-blue-600">
                          {Math.round((event.attendees / event.maxAttendees) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button className="w-full">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Featured Community Members</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our top contributors and community experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMembers.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <Badge className="mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                    {member.badge}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{member.role}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{member.contributions}</div>
                      <div className="text-gray-600">Posts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{member.helpfulAnswers}</div>
                      <div className="text-gray-600">Helpful</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Be Respectful</h3>
                  <p className="text-sm text-gray-600">
                    Treat everyone with respect. No harassment, hate speech, or personal attacks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Share Knowledge</h3>
                  <p className="text-sm text-gray-600">
                    Help others learn and grow. Share your expertise and experiences generously.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Stay On Topic</h3>
                  <p className="text-sm text-gray-600">
                    Keep discussions relevant to the category and helpful to the community.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">No Spam</h3>
                  <p className="text-sm text-gray-600">
                    Don't post promotional content, advertisements, or irrelevant links.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Conversation?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with 10,000+ creators, get expert help, and be part of 
            the fastest-growing creative community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Sign Up Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <MessageSquare className="mr-2 w-5 h-5" />
              Start Discussion
            </Button>
          </div>
          <p className="text-sm text-white/80 mt-4">
            No credit card required • Join in seconds
          </p>
        </div>
      </section>
    </div>
  );
}
