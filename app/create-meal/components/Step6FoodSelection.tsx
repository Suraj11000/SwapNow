import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormData } from "../page"

interface Props {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
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

export default function Step6FoodSelection({ formData, updateFormData }: Props) {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Ingredients</h2>
        <p className="text-gray-600">Select your preferred ingredients for each category</p>
      </div>

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
          <strong>Tip:</strong> Select at least one carb and one protein source to generate your meal plan.
          {formData.allergies.length > 0 && " Some options have been filtered based on your allergies."}
        </p>
      </div>
    </div>
  )
}
