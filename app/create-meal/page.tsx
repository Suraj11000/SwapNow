"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

// Import step components
import Step1PersonalInfo from "./components/Step1PersonalInfo"
import Step2ActivityLevel from "./components/Step2ActivityLevel"
import Step3Goals from "./components/Step3Goals"
import Step4MedicalConditions from "./components/Step4MedicalConditions"
import Step5Allergies from "./components/Step5Allergies"
import Step6CaloriesAndFoods from "./components/Step6CaloriesAndFoods"
import Step7MealReview from "./components/Step7MealReview"

export interface FormData {
  // Step 1
  name: string
  age: number
  gender: "male" | "female" | ""
  height: number
  weight: number
  bmr: number

  // Step 2
  activityLevel: string
  tdee: number

  // Step 3
  goal: string

  // Step 4
  medicalConditions: string[]

  // Step 5
  allergies: string[]

  // Step 6
  maintenanceCalories: number
  goalCalories: number
  selectedFoods: {
    carbs: string[]
    proteins: string[]
    veggies: string[]
    fats: string[]
  }

  // Step 7
  meals: {
    breakfast: any[]
    lunch: any[]
    dinner: any[]
  }
  totalMacros: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

const initialFormData: FormData = {
  name: "",
  age: 0,
  gender: "",
  height: 0,
  weight: 0,
  bmr: 0,
  activityLevel: "",
  tdee: 0,
  goal: "",
  medicalConditions: [],
  allergies: [],
  maintenanceCalories: 0,
  goalCalories: 0,
  selectedFoods: {
    carbs: [],
    proteins: [],
    veggies: [],
    fats: [],
  },
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
  },
  totalMacros: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  },
}

export default function CreateMealPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const totalSteps = 7
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo formData={formData} updateFormData={updateFormData} />
      case 2:
        return <Step2ActivityLevel formData={formData} updateFormData={updateFormData} />
      case 3:
        return <Step3Goals formData={formData} updateFormData={updateFormData} />
      case 4:
        return <Step4MedicalConditions formData={formData} updateFormData={updateFormData} />
      case 5:
        return <Step5Allergies formData={formData} updateFormData={updateFormData} />
      case 6:
        return <Step6CaloriesAndFoods formData={formData} updateFormData={updateFormData} />
      case 7:
        return <Step7MealReview formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age > 0 && formData.gender && formData.height > 0 && formData.weight > 0
      case 2:
        return formData.activityLevel !== ""
      case 3:
        return formData.goal !== ""
      case 4:
        return true // Medical conditions can be empty
      case 5:
        return true // Allergies can be empty
      case 6:
        return formData.selectedFoods.carbs.length > 0 && formData.selectedFoods.proteins.length > 0
      case 7:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Your Meal</h1>
            </div>
            <div className="text-sm text-gray-600 text-center sm:text-right">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardContent className="p-4 sm:p-8">{renderStep()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} disabled={!isStepValid()} className="bg-green-600 hover:bg-green-700">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
