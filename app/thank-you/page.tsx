"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Home, Download, Calendar, Coffee, Sun, Moon } from "lucide-react"
import Link from "next/link"

interface OrderData {
  customerInfo: {
    name: string
    age: number
    gender: string
    height: number
    weight: number
    bmr: number
    tdee: number
  }
  preferences: {
    activityLevel: string
    goal: string
    medicalConditions: string[]
    allergies: string[]
  }
  calories: {
    maintenance: number
    goal: number
  }
  mealPlan: {
    breakfast?: any[]
    lunch?: any[]
    dinner?: any[]
  }
  selectedMeals: {
    breakfast: boolean
    lunch: boolean
    dinner: boolean
  }
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
  totalPrice: number
  orderDate: string
  orderId: string
}

export default function ThankYouPage() {
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    // Get order data from localStorage
    const storedOrderData = localStorage.getItem("orderData")
    if (storedOrderData) {
      setOrderData(JSON.parse(storedOrderData))
    }
  }, [])

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return <Coffee className="w-5 h-5" />
      case "lunch":
        return <Sun className="w-5 h-5" />
      case "dinner":
        return <Moon className="w-5 h-5" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getSelectedMealsList = () => {
    if (!orderData) return []
    return Object.entries(orderData.selectedMeals)
      .filter(([_, isSelected]) => isSelected)
      .map(([mealType, _]) => mealType)
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedMealsList = getSelectedMealsList()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <Card className="mb-8 bg-gradient-to-r from-green-100 to-green-50 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">Thank You, {orderData.customerInfo.name}!</h1>
              <p className="text-lg text-green-700 mb-4">Your order has been placed successfully</p>
              <div className="bg-white rounded-lg p-4 inline-block">
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="text-xl font-bold text-gray-900">{orderData.orderId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{formatDate(orderData.orderDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goal:</span>
                  <Badge variant="secondary">{orderData.preferences.goal.replace("-", " ")}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activity Level:</span>
                  <span className="font-medium capitalize">
                    {orderData.preferences.activityLevel.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meals Ordered:</span>
                  <span className="font-medium">{selectedMealsList.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-xl font-bold text-green-600">₹{orderData.totalPrice}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Meals Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{orderData.nutrition.calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{orderData.nutrition.protein}g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{orderData.nutrition.carbs}g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{orderData.nutrition.fats}g</div>
                    <div className="text-sm text-gray-600">Fats</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Meals Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Selected Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {selectedMealsList.map((mealType) => {
                  const mealItems = orderData.mealPlan[mealType as keyof typeof orderData.mealPlan] || []
                  return (
                    <div key={mealType} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getMealIcon(mealType)}
                          <h3 className="font-semibold capitalize">{mealType}</h3>
                          <Badge variant="outline">
                            {mealItems.reduce((sum: number, item: any) => sum + item.calories, 0)} cal
                          </Badge>
                        </div>
                        <Badge variant="secondary">₹99</Badge>
                      </div>
                      <div className="space-y-2">
                        {mealItems.map((item: any, index: number) => (
                          <div key={index} className="text-sm flex justify-between">
                            <span>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">({item.quantity}g)</span>
                            </span>
                            <span className="text-gray-500">{item.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Order Confirmation</h4>
                    <p className="text-sm text-gray-600">You'll receive an email confirmation within 5 minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Meal Preparation</h4>
                    <p className="text-sm text-gray-600">Our chefs will prepare your selected meals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Delivery</h4>
                    <p className="text-sm text-gray-600">Your selected meals will be delivered within 24 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            {/* <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <Download className="w-5 h-5 mr-2" />
              Download Meal Plan
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Delivery
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
