"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormData } from "../page"
import { Button } from "@/components/ui/button"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export default function Step1PersonalInfo({ formData, updateFormData }: Props) {
  const [expectedWeight, setExpectedWeight] = useState<number>(0)
  const [showExpectedWeight, setShowExpectedWeight] = useState(false)

  // Calculate expected weight based on height (using BMI of 22 as ideal)
  const calculateExpectedWeight = (height: number) => {
    if (height > 0) {
      const heightInMeters = height / 100
      const idealBMI = 22 // Ideal BMI for healthy weight
      const expectedWt = Math.round(idealBMI * heightInMeters * heightInMeters)
      setExpectedWeight(expectedWt)
      setShowExpectedWeight(true)
      return expectedWt
    }
    return 0
  }

  // Calculate BMR whenever personal info changes
  useEffect(() => {
    if (formData.age > 0 && formData.weight > 0 && formData.height > 0 && formData.gender) {
      let bmr = 0

      if (formData.gender === "male") {
        // BMR (men) = 66 + (13.7 x weight in kg) + (5 x height in cm) - (6.76 x age in years)
        bmr = 66 + 13.7 * formData.weight + 5 * formData.height - 6.76 * formData.age
      } else {
        // BMR (women) = 655 + (9.6 x weight in kg) + (1.8 x height in cm) - (4.7 x age in years)
        bmr = 655 + 9.6 * formData.weight + 1.8 * formData.height - 4.7 * formData.age
      }

      updateFormData({ bmr: Math.round(bmr) })
    }
  }, [formData.age, formData.weight, formData.height, formData.gender])

  // Calculate expected weight when height changes
  useEffect(() => {
    if (formData.height > 0) {
      calculateExpectedWeight(formData.height)
    }
  }, [formData.height])

  const useExpectedWeight = () => {
    updateFormData({ weight: expectedWeight })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself to calculate your BMR</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            type="number"
            value={formData.age || ""}
            onChange={(e) => updateFormData({ age: Number.parseInt(e.target.value) || 0 })}
            placeholder="Enter your age"
          />
        </div>

        <div className="space-y-3">
          <Label>Gender</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => updateFormData({ gender: value as "male" | "female" })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height || ""}
            onChange={(e) => updateFormData({ height: Number.parseInt(e.target.value) || 0 })}
            placeholder="Enter your height in cm"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight || ""}
            onChange={(e) => updateFormData({ weight: Number.parseInt(e.target.value) || 0 })}
            placeholder="Enter your weight in kg"
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Expected Weight Display */}
      {showExpectedWeight && expectedWeight > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-800">Expected Healthy Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-2">{expectedWeight} kg</div>
                <p className="text-sm text-yellow-700">
                  Based on your height ({formData.height}cm), your ideal weight range is around {expectedWeight}kg (BMI:
                  22)
                </p>
              </div>
              <Button
                variant="outline"
                onClick={useExpectedWeight}
                className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
              >
                Use This Weight
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BMR Display */}
      {formData.bmr > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Your BMR (Basal Metabolic Rate)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{formData.bmr} calories/day</div>
              <p className="text-sm text-blue-700">
                This is the number of calories your body needs at rest to maintain basic physiological functions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
