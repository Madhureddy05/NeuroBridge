import { Button } from "../components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import Link from "next/link"
import { ArrowRight, Brain, Calendar, MessageSquare, Smile, Sparkles } from 'lucide-react'
import WellnessScore from "../components/wellness-score"

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="py-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Your Wellness Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your mood, find relief, chat with our AI assistant, and take breaks with fun activities.
          </p>
        </div>
      </section>

      <WellnessScore />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          title="Mood Journal"
          description="Track how you're feeling and reflect on your day"
          icon={<Smile className="h-8 w-8 text-blue-500" />}
          href="/journal"
        />

        <FeatureCard
          title="Relief Exercises"
          description="Quick exercises to help you relax and refocus"
          icon={<Brain className="h-8 w-8 text-purple-500" />}
          href="/exercises"
        />

        <FeatureCard
          title="AI Assistant"
          description="Chat with our AI to get support or just talk"
          icon={<MessageSquare className="h-8 w-8 text-green-500" />}
          href="/chat"
        />

        <FeatureCard
          title="Fun Games"
          description="Take a break with some quick games"
          icon={<Sparkles className="h-8 w-8 text-yellow-500" />}
          href="/games"
        />

        <FeatureCard
          title="Calendar"
          description="View your schedule and manage your time"
          icon={<Calendar className="h-8 w-8 text-red-500" />}
          href="/calendar"
        />

        <FeatureCard
          title="Wellness Report"
          description="View detailed analytics about your wellbeing"
          icon={<Brain className="h-8 w-8 text-indigo-500" />}
          href="/reports"
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon, href }) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full group">
            Explore
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}