"use client"

import { useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormData } from "../page"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const goalCalorieAdjustments: Record<string, number> = {
  bulking: 400,
  cutting: -400,
  "build-muscle": 400,
  "eat-healthy": 0,
}

const foodOptions = {
  carbs: [
    { value: "brown-rice", label: "Brown Rice", calories: 112 },
    { value: "quinoa", label: "Quinoa", calories: 120 },
    { value: "sweet-potato", label: "Sweet Potato", calories: 103 },
    { value: "oats", label: "Oats", calories: 154 },
    { value: "whole-wheat-bread", label: "Whole Wheat Bread", calories: 80 },
  ],
  proteins: [
    { value: "chicken-breast", label: "Chicken Breast", calories: 165 },
    { value: "salmon", label: "Salmon", calories: 208 },
    { value: "eggs", label: "Eggs", calories: 155 },
    { value: "greek-yogurt", label: "Greek Yogurt", calories: 100 },
    { value: "tofu", label: "Tofu", calories: 94 },
    { value: "lentils", label: "Lentils", calories: 116 },
  ],
  veggies: [
    { value: "broccoli", label: "Broccoli", calories: 25 },
    { value: "spinach", label: "Spinach", calories: 23 },
    { value: "bell-peppers", label: "Bell Peppers", calories: 20 },
    { value: "carrots", label: "Carrots", calories: 25 },
    { value: "zucchini", label: "Zucchini", calories: 17 },
    { value: "tomatoes", label: "Tomatoes", calories: 18 },
  ],
  fats: [
    { value: "avocado", label: "Avocado", calories: 160 },
    { value: "olive-oil", label: "Olive Oil", calories: 119 },
    { value: "almonds", label: "Almonds", calories: 164 },
    { value: "chia-seeds", label: "Chia Seeds", calories: 137 },
    { value: "coconut-oil", label: "Coconut Oil", calories: 117 },
  ],
}

const activityLevels = [
  { value: "sedentary", label: "Sedentary", multiplier: 1.2 },
  { value: "lightly-active", label: "Lightly Active", multiplier: 1.375 },
  { value: "moderately-active", label: "Moderately Active", multiplier: 1.55 },
  { value: "very-active", label: "Very Active", multiplier: 1.725 },
  { value: "extra-active", label: "Extra Active", multiplier: 1.9 },
]

export default function Step6CaloriesAndFoods({ formData, updateFormData }: Props) {
  // Calculate goal calories when goal changes
  useEffect(() => {
    if (formData.goal && formData.maintenanceCalories > 0) {
      const adjustment = goalCalorieAdjustments[formData.goal] || 0
      const goalCalories = formData.maintenanceCalories + adjustment
      updateFormData({ goalCalories })
    }
  }, [formData.goal, formData.maintenanceCalories])

  const handleFoodSelection = (category: keyof typeof foodOptions, food: string, checked: boolean) => {
    const currentSelections = { ...formData.selectedFoods }

    if (checked) {
      currentSelections[category] = [...currentSelections[category], food]
    } else {
      currentSelections[category] = currentSelections[category].filter((f) => f !== food)
    }

    updateFormData({ selectedFoods: currentSelections })
  }

  const filterFoodsByAllergies = (foods: any[], category: string) => {
    return foods.filter((food) => {
      // Filter based on allergies
      if (formData.allergies.includes("lactose") && ["greek-yogurt"].includes(food.value)) return false
      if (formData.allergies.includes("gluten") && ["whole-wheat-bread", "oats"].includes(food.value)) return false
      if (formData.allergies.includes("seafood") && ["salmon"].includes(food.value)) return false
      if (formData.allergies.includes("nuts") && ["almonds"].includes(food.value)) return false
      if (formData.allergies.includes("coconut") && ["coconut-oil"].includes(food.value)) return false

      return true
    })
  }

  const caloriesPerMeal = Math.round((formData.goalCalories * 30) / 100)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Calories & Food Selection</h2>
        <p className="text-gray-600">Your personalized calorie targets and ingredient selection</p>
      </div>

      {/* Calculation Flow Display */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Calorie Calculation Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>BMR (Base Metabolic Rate):</span>
              <span className="font-semibold">{formData.bmr} calories</span>
            </div>
            <div className="flex justify-between">
              <span>Activity Level Multiplier:</span>
              <span className="font-semibold">
                {formData.activityLevel
                  ? activityLevels.find((l) => l.value === formData.activityLevel)?.multiplier || 1.2
                  : 1.2}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>TDEE (Maintenance):</span>
              <span className="font-semibold">{formData.maintenanceCalories} calories</span>
            </div>
            <div className="flex justify-between">
              <span>Goal Adjustment ({formData.goal}):</span>
              <span className="font-semibold">
                {goalCalorieAdjustments[formData.goal] > 0 ? "+" : ""}
                {goalCalorieAdjustments[formData.goal]} calories
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base">
              <span className="font-semibold">Goal Calories:</span>
              <span className="font-bold text-green-600">{formData.goalCalories} calories</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calorie Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-800">Maintenance Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formData.maintenanceCalories}</div>
            <div className="text-xs text-blue-600">calories/day</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-800">Goal Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formData.goalCalories}</div>
            <div className="text-xs text-green-600">
              {goalCalorieAdjustments[formData.goal] > 0 ? "+" : ""}
              {goalCalorieAdjustments[formData.goal]} from maintenance
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-800">Per Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{caloriesPerMeal}</div>
            <div className="text-xs text-orange-600">30% of goal calories</div>
          </CardContent>
        </Card>
      </div>

      {/* Food Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(foodOptions).map(([category, foods]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize text-lg">{category === "veggies" ? "Vegetables" : category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filterFoodsByAllergies(foods, category).map((food) => (
                  <div key={food.value} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={food.value}
                        checked={formData.selectedFoods[category as keyof typeof foodOptions].includes(food.value)}
                        onCheckedChange={(checked) =>
                          handleFoodSelection(category as keyof typeof foodOptions, food.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={food.value} className="cursor-pointer">
                        {food.label}
                      </Label>
                    </div>
                    <span className="text-sm text-gray-500">{food.calories} cal</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Meal Planning:</strong> Each meal (breakfast, lunch, dinner) will contain approximately{" "}
          {caloriesPerMeal} calories based on your calculated goal calories.
          {formData.allergies.length > 0 && " Some options have been filtered based on your allergies."}
        </p>
      </div>
    </div>
  )
}
