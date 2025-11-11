"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Award, Bike, Calendar, MapPin, Star, TrendingUp, CreditCard, AlertCircle, LogOut } from "lucide-react"
import type { UserProfile, Trip, SplitTransaction } from "@/lib/storage"

interface ProfileDashboardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  profile: UserProfile
  joinedTrips: Trip[]
  splits: SplitTransaction[]
  onLogout?: () => void
}

export default function ProfileDashboard({
  isOpen,
  onOpenChange,
  profile,
  joinedTrips,
  splits,
  onLogout,
}: ProfileDashboardProps) {
  const calculateMoneyBalance = () => {
    let totalOwed = 0
    const owedToYouDetails: { [person: string]: number } = {}

    splits.forEach((split) => {
      split.transactions.forEach((tx) => {
        if (tx.paidBy === profile.name) {
          tx.splits.forEach((split_item: any) => {
            if (split_item.member !== profile.name) {
              owedToYouDetails[split_item.member] = (owedToYouDetails[split_item.member] || 0) + split_item.amount
            }
          })
        } else {
          tx.splits.forEach((split_item: any) => {
            if (split_item.member === profile.name) {
              totalOwed += split_item.amount
            }
          })
        }
      })
    })

    return { totalOwed, owedToYouDetails }
  }

  const { totalOwed, owedToYouDetails } = calculateMoneyBalance()
  const totalOwnedToMe = Object.values(owedToYouDetails).reduce((a: number, b: number) => a + b, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-black via-gray-900 to-black border-gray-800/50 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            My Profile
          </DialogTitle>
          {onLogout && (
            <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rides">My Rides</TabsTrigger>
            <TabsTrigger value="money">Money Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-orange-500/20 border border-purple-500/30 shadow-lg">
              <Avatar className="h-24 w-24 ring-4 ring-blue-400/50 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{profile.name}</h3>
                <p className="text-sm text-gray-400">{profile.email}</p>
                <div className="flex items-center space-x-2 mt-3 flex-wrap gap-2">
                  <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/50 px-3 py-1">
                    {profile.experienceLevel}
                  </Badge>
                  {profile.organizerRating && (
                    <Badge className="bg-orange-500/30 text-orange-300 border-orange-500/50 px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      {profile.organizerRating.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 shadow-lg hover:shadow-blue-500/20 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Rides</p>
                      <p className="text-3xl font-bold text-blue-400">{profile.totalRides}</p>
                    </div>
                    <Bike className="h-10 w-10 text-blue-500/40" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 shadow-lg hover:shadow-purple-500/20 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">This Month</p>
                      <p className="text-3xl font-bold text-purple-400">{profile.stats.ridesThisMonth}</p>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-500/40" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 shadow-lg hover:shadow-green-500/20 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Distance</p>
                      <p className="text-3xl font-bold text-green-400">{profile.stats.avgRideDistance}</p>
                    </div>
                    <MapPin className="h-10 w-10 text-green-500/40" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30 shadow-lg hover:shadow-orange-500/20 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Longest Ride</p>
                      <p className="text-3xl font-bold text-orange-400">{profile.stats.longestRide}</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-orange-500/40" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {profile.achievements.length > 0 && (
              <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.achievements.map((achievement) => (
                      <Badge key={achievement} className="bg-yellow-500/30 text-yellow-300 border-yellow-500/50">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rides" className="space-y-3 mt-4">
            <ScrollArea className="h-96">
              <div className="pr-4 space-y-3">
                {joinedTrips.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bike className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No rides joined yet</p>
                  </div>
                ) : (
                  joinedTrips.map((trip) => (
                    <Card
                      key={trip.id}
                      className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-white">{trip.title}</p>
                            <p className="text-sm text-gray-400 flex items-center mt-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              {trip.startLocation} → {trip.destination}
                            </p>
                            <p className="text-sm text-gray-400 flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {trip.date} at {trip.time}
                            </p>
                          </div>
                          <Badge className="bg-green-500/30 text-green-300 border-green-500/50 ml-2">Joined</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="money" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`border-2 shadow-2xl transition-all transform hover:scale-105 ${
                  totalOwed > 0
                    ? "border-orange-500/50 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-red-600/20 shadow-orange-500/20"
                    : "border-green-500/50 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-emerald-600/20 shadow-green-500/20"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 font-semibold tracking-wide">YOU OWE</p>
                      <p className={`text-4xl font-bold mt-2 ${totalOwed > 0 ? "text-orange-400" : "text-green-400"}`}>
                        ₹{totalOwed.toFixed(2)}
                      </p>
                    </div>
                    <CreditCard
                      className={`h-16 w-16 transition-all ${totalOwed > 0 ? "text-orange-500/60 animate-pulse" : "text-green-500/60"}`}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`border-2 shadow-2xl transition-all transform hover:scale-105 ${
                  totalOwnedToMe > 0
                    ? "border-green-500/50 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-emerald-600/20 shadow-green-500/20"
                    : "border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-gray-700/20"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 font-semibold tracking-wide">OWED TO YOU</p>
                      <p
                        className={`text-4xl font-bold mt-2 ${totalOwnedToMe > 0 ? "text-green-400" : "text-gray-400"}`}
                      >
                        ₹{totalOwnedToMe.toFixed(2)}
                      </p>
                    </div>
                    <AlertCircle
                      className={`h-16 w-16 transition-all ${totalOwnedToMe > 0 ? "text-green-500/60 animate-pulse" : "text-gray-500/30"}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {Object.entries(owedToYouDetails).length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-sm">Who Owes You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(owedToYouDetails).map(([person, amount]) => (
                      <div
                        key={person}
                        className="p-4 rounded-lg bg-black/50 border border-green-500/30 flex justify-between items-center"
                      >
                        <span className="text-gray-300">{person}</span>
                        <span className="text-lg font-bold text-green-400">₹{(amount as number).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {splits.length > 0 && (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-sm">All Splits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="pr-4 space-y-3">
                      {splits.map((split) => (
                        <div
                          key={split.id}
                          className="p-4 rounded-lg bg-black/50 border border-gray-800 hover:border-purple-500/50 transition-all"
                        >
                          <p className="font-semibold text-purple-400 mb-3">{split.groupName}</p>
                          <div className="space-y-2">
                            {Object.entries(split.balances).map(([member, amount]) =>
                              member === profile.name ? (
                                <div
                                  key={member}
                                  className="flex items-center justify-between text-sm p-2 rounded bg-gray-900/50"
                                >
                                  <span className="text-gray-300">Your Balance</span>
                                  <span className={`font-bold ${amount > 0 ? "text-orange-400" : "text-green-400"}`}>
                                    {amount > 0 ? "Owe " : "Get Back "}₹{Math.abs(amount).toFixed(2)}
                                  </span>
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
