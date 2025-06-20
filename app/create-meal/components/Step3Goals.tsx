"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import type { FormData } from "../page"
import { TrendingUp, TrendingDown, Dumbbell, Heart } from "lucide-react"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const goals = [
  {
    value: "bulking",
    title: "Bulking",
    description: "Gain weight and build muscle mass",
    icon: TrendingUp,
    color: "text-blue-600",
    calorieAdjustment: 400,
  },
  {
    value: "cutting",
    title: "Cutting",
    description: "Lose weight while maintaining muscle",
    icon: TrendingDown,
    color: "text-red-600",
    calorieAdjustment: -400,
  },
  {
    value: "build-muscle",
    title: "Build Muscle",
    description: "Focus on muscle growth and strength",
    icon: Dumbbell,
    color: "text-purple-600",
    calorieAdjustment: 400,
  },
  {
    value: "eat-healthy",
    title: "Eat Healthy",
    description: "Maintain a balanced, nutritious diet",
    icon: Heart,
    color: "text-green-600",
    calorieAdjustment: 0,
  },
]

export default function Step3Goals({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Goal</h2>
        <p className="text-gray-600">What do you want to achieve with your nutrition?</p>
      </div>

      <RadioGroup
        value={formData.goal}
        onValueChange={(value) => updateFormData({ goal: value })}
        className="grid md:grid-cols-2 gap-4"
      >
        {goals.map((goal) => {
          const IconComponent = goal.icon
          return (
            <Card key={goal.value} className="cursor-pointer hover:bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={goal.value} id={goal.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className={`w-5 h-5 ${goal.color}`} />
                      <Label htmlFor={goal.value} className="text-base font-medium cursor-pointer">
                        {goal.title}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    <div className="text-xs text-gray-500">
                      Calorie adjustment: {goal.calorieAdjustment > 0 ? "+" : ""}
                      {goal.calorieAdjustment} calories
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </RadioGroup>
    </div>
  )
}
