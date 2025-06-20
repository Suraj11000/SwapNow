"use client"

import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormData } from "../page"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

const activityLevels = [
  {
    value: "sedentary",
    title: "Sedentary",
    description: "Little to no exercise, desk job",
    multiplier: 1.2,
  },
  {
    value: "light",
    title: "Light Exercise",
    description: "1-2 days per week of light activity",
    multiplier: 1.375,
  },
  {
    value: "moderate",
    title: "Moderate Exercise",
    description: "3-5 days per week of moderate activity",
    multiplier: 1.55,
  },
  {
    value: "heavy",
    title: "Heavy Exercise",
    description: "6-7 days per week of intense activity",
    multiplier: 1.725,
  },
  {
    value: "very-heavy",
    title: "Very Heavy Exercise",
    description: "Twice daily or very intense training",
    multiplier: 1.9,
  },
]

export default function Step2ActivityLevel({ formData, updateFormData }: Props) {
  // Calculate TDEE whenever activity level changes
  useEffect(() => {
    if (formData.activityLevel && formData.bmr > 0) {
      const selectedActivity = activityLevels.find((level) => level.value === formData.activityLevel)
      if (selectedActivity) {
        const tdee = Math.round(formData.bmr * selectedActivity.multiplier)
        updateFormData({
          tdee,
          maintenanceCalories: tdee,
        })
      }
    }
  }, [formData.activityLevel, formData.bmr])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Level</h2>
        <p className="text-gray-600">How active are you on a typical week?</p>
      </div>

      {/* Show current BMR for reference */}
      {formData.bmr > 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Your BMR: <span className="font-semibold">{formData.bmr} calories/day</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <RadioGroup
        value={formData.activityLevel}
        onValueChange={(value) => updateFormData({ activityLevel: value })}
        className="space-y-4"
      >
        {activityLevels.map((level) => (
          <Card key={level.value} className="cursor-pointer hover:bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <div className="flex-1">
                    <Label htmlFor={level.value} className="text-base font-medium cursor-pointer">
                      {level.title}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Multiplier: {level.multiplier}</div>
                  {formData.bmr > 0 && (
                    <div className="text-sm font-medium text-gray-700">
                      = {Math.round(formData.bmr * level.multiplier)} cal/day
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      {/* TDEE Display */}
      {formData.tdee > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg text-green-800">Your TDEE (Total Daily Energy Expenditure)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{formData.tdee} calories/day</div>
              <p className="text-sm text-green-700">
                This is your maintenance calories - the total number of calories you burn in a day including exercise.
              </p>
              <div className="mt-2 text-xs text-green-600">
                BMR ({formData.bmr}) × Activity Level (
                {activityLevels.find((l) => l.value === formData.activityLevel)?.multiplier}) = {formData.tdee}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
