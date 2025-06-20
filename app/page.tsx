import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Calendar } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Swapnow</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized nutrition made simple. Create custom meals or subscribe to our curated plans.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Utensils className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Create Your Own Meal</CardTitle>
              <CardDescription className="text-base">
                Customize your perfect meal based on your goals, preferences, and dietary needs
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Personalized BMR & TDEE calculation</li>
                <li>• Custom macro calculations</li>
                <li>• Choose your ingredients</li>
                <li>• 3 meals per day planning</li>
              </ul>
              <Link href="/create-meal">
                <Button className="w-full bg-green-600 hover:bg-green-700">Start Creating</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl">Subscription Plans</CardTitle>
              <CardDescription className="text-base">
                Let our experts create weekly meal plans tailored to your lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Weekly meal deliveries</li>
                <li>• Expert nutritionist designed</li>
                <li>• Flexible scheduling</li>
                <li>• Premium ingredients</li>
              </ul>
              <Button className="w-full bg-orange-600 hover:bg-orange-700" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
