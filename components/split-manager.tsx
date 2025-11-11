"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Users, TrendingDown, TrendingUp } from "lucide-react"
import type { SplitTransaction } from "@/lib/storage"

interface SplitManagerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  existingSplits: SplitTransaction[]
  onCreateSplit: (split: SplitTransaction) => void
  currentUserName: string
}

export default function SplitManager({
  isOpen,
  onOpenChange,
  existingSplits,
  onCreateSplit,
  currentUserName,
}: SplitManagerProps) {
  const [activeTab, setActiveTab] = useState("create")
  const [groupName, setGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [members, setMembers] = useState([{ name: currentUserName, email: `${currentUserName}@velocity.com` }])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0])
  const [transactions, setTransactions] = useState<any[]>([])
  const [individualSplits, setIndividualSplits] = useState<{ [member: string]: number }>({})

  const moneyStatus = useMemo(() => {
    let youOwe = 0
    const owedToYou: { [person: string]: number } = {}

    transactions.forEach((tx) => {
      if (tx.paidBy === currentUserName) {
        tx.splits.forEach(({ member, amount: splitAmt }: any) => {
          if (member !== currentUserName) {
            owedToYou[member] = (owedToYou[member] || 0) + splitAmt
          }
        })
      } else {
        tx.splits.forEach(({ member, amount: splitAmt }: any) => {
          if (member === currentUserName) {
            youOwe += splitAmt
          }
        })
      }
    })

    return { youOwe, owedToYou }
  }, [transactions, currentUserName])

  const toggleMember = (memberName: string) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.includes(memberName) ? prevMembers.filter((m) => m !== memberName) : [...prevMembers, memberName],
    )
    setIndividualSplits((prevSplits) => {
      if (!prevSplits[memberName]) {
        return { ...prevSplits, [memberName]: 0 }
      }
      return prevSplits
    })
  }

  const selectAll = () => {
    const allNames = members.map((m) => m.name)
    setSelectedMembers(allNames)
    const newSplits: { [key: string]: number } = {}
    allNames.forEach((name) => {
      newSplits[name] = 0
    })
    setIndividualSplits(newSplits)
  }

  const addMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      alert("Please fill in both fields")
      return
    }
    const exists = members.some((m) => m.name === newMemberName)
    if (exists) {
      alert("Member already exists")
      return
    }
    setMembers([...members, { name: newMemberName, email: newMemberEmail }])
    setNewMemberName("")
    setNewMemberEmail("")
  }

  const splitAmount = selectedMembers.length > 0 ? Number.parseFloat(amount || "0") / selectedMembers.length : 0

  const addTransaction = () => {
    if (!description || !amount || !paidBy || selectedMembers.length === 0 || !expenseDate) {
      alert("Please fill all fields including date")
      return
    }

    const newTransaction = {
      description,
      amount: Number.parseFloat(amount),
      paidBy,
      splits: selectedMembers.map((member) => ({
        member,
        amount: individualSplits[member] || splitAmount,
      })),
      date: expenseDate,
    }

    setTransactions([...transactions, newTransaction])
    setDescription("")
    setAmount("")
    setPaidBy("")
    setExpenseDate(new Date().toISOString().split("T")[0])
    setIndividualSplits({})
  }

  const saveSplit = () => {
    if (!groupName || selectedMembers.length === 0 || transactions.length === 0) {
      alert("Please complete all steps")
      return
    }

    const balances: Record<string, number> = {}
    selectedMembers.forEach((member) => {
      balances[member] = 0
    })

    transactions.forEach((transaction) => {
      balances[transaction.paidBy] += transaction.amount
      transaction.splits.forEach(({ member, amount: splitAmt }: any) => {
        balances[member] -= splitAmt
      })
    })

    const newSplit: SplitTransaction = {
      id: Date.now(),
      groupName,
      groupMembers: members.filter((m) => selectedMembers.includes(m.name)),
      transactions,
      createdDate: new Date().toISOString().split("T")[0],
      balances,
    }

    onCreateSplit(newSplit)

    setGroupName("")
    setSelectedMembers([])
    setTransactions([])
    setDescription("")
    setAmount("")
    setPaidBy("")
    setExpenseDate(new Date().toISOString().split("T")[0])
    setIndividualSplits({})
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-black via-gray-900 to-black border-gray-800/50 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Split Manager
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="create">Create Split</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border border-purple-500/30">
              <h3 className="text-sm font-semibold text-purple-300 mb-4">💰 Your Current Money Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-orange-400" />
                    <span className="text-sm text-gray-300">You Owe</span>
                  </div>
                  <span
                    className={`text-2xl font-bold ${moneyStatus.youOwe > 0 ? "text-orange-400" : "text-green-400"}`}
                  >
                    ₹{moneyStatus.youOwe.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-300">Owed to You</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    ₹
                    {Object.values(moneyStatus.owedToYou)
                      .reduce((a, b) => a + b, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              {Object.entries(moneyStatus.owedToYou).length > 0 && (
                <div className="mt-4 pt-4 border-t border-purple-500/30">
                  <p className="text-xs text-gray-400 mb-2">Breakdown:</p>
                  <div className="space-y-2">
                    {Object.entries(moneyStatus.owedToYou).map(([person, amt]) => (
                      <p key={person} className="text-sm text-gray-300">
                        <span className="text-green-400 font-semibold">{person}</span> owes you{" "}
                        <span className="text-green-400 font-semibold">₹{(amt as number).toFixed(2)}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white font-semibold">Group Name</Label>
              <Input
                placeholder="e.g., Weekend Trip, Dinner Party"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white font-semibold flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Select Members
                </Label>
                <Button
                  size="sm"
                  onClick={selectAll}
                  className="bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30"
                >
                  Select All
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {members.map((member) => (
                    <div key={member.name} className="flex items-center space-x-3">
                      <Checkbox
                        id={member.name}
                        checked={selectedMembers.includes(member.name)}
                        onCheckedChange={() => toggleMember(member.name)}
                        className="border-gray-600"
                      />
                      <label
                        htmlFor={member.name}
                        className="text-sm cursor-pointer flex items-center space-x-2 flex-1"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {member.name[0]}
                        </div>
                        <span className="text-gray-300">{member.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {selectedMembers.length > 0 && (
                  <p className="text-sm text-purple-400">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white font-semibold text-sm">Add New Member</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Member name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 flex-1"
                  />
                  <Input
                    placeholder="Email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 flex-1"
                  />
                  <Button onClick={addMember} className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-800" />

            <div className="space-y-3">
              <h3 className="font-semibold text-white">Add Expenses</h3>

              <div className="space-y-2">
                <Label className="text-white">What was paid for?</Label>
                <Input
                  placeholder="e.g., Fuel, Food, Hotel"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-white">Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Paid By</Label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-white text-sm focus:border-purple-500"
                  >
                    <option value="">Select...</option>
                    {selectedMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {amount && selectedMembers.length > 0 && (
                <Card className="bg-purple-500/10 border-purple-500/30">
                  <CardContent className="p-3">
                    <p className="text-sm text-gray-300">
                      Default split: <span className="font-bold text-purple-400">₹{splitAmount.toFixed(2)}</span> per
                      person
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Individual splits can be edited below</p>
                  </CardContent>
                </Card>
              )}

              {amount && selectedMembers.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white text-sm">Individual Split Amounts</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMembers.map((member) => (
                      <div key={member} className="space-y-1">
                        <p className="text-xs text-gray-400">{member}</p>
                        <Input
                          type="number"
                          placeholder={splitAmount.toFixed(2)}
                          value={individualSplits[member] || ""}
                          onChange={(e) =>
                            setIndividualSplits((prev) => ({
                              ...prev,
                              [member]: Number.parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-white">Date</Label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-black/80 border-2 border-purple-500/50 rounded-lg text-white font-semibold focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 cursor-pointer"
                  style={{ colorScheme: "dark" }}
                />
              </div>

              <Button onClick={addTransaction} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>

            {transactions.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Expenses Added</h3>
                <ScrollArea className="h-40">
                  <div className="pr-4 space-y-2">
                    {transactions.map((tx, idx) => (
                      <Card key={idx} className="bg-gray-900/50 border-gray-800">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-white">{tx.description}</p>
                              <p className="text-sm text-gray-400">
                                {tx.paidBy} paid ₹{tx.amount.toFixed(2)} on {tx.date}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setTransactions(transactions.filter((_, i) => i !== idx))}
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3 mt-4">
            <ScrollArea className="h-96">
              <div className="pr-4 space-y-3">
                {existingSplits.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No splits created yet</p>
                  </div>
                ) : (
                  existingSplits.map((split) => (
                    <Card
                      key={split.id}
                      className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base text-purple-400">{split.groupName}</CardTitle>
                        <p className="text-xs text-gray-400">{split.createdDate}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Members:</p>
                          <div className="flex flex-wrap gap-2">
                            {split.groupMembers.map((member) => (
                              <Badge
                                key={member.name}
                                className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                              >
                                {member.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Separator className="bg-gray-800" />
                        <div className="space-y-2">
                          {Object.entries(split.balances).map(([member, amount]) => (
                            <div
                              key={member}
                              className="flex items-center justify-between text-sm p-2 rounded bg-black/50"
                            >
                              <span className="text-gray-300">{member}</span>
                              <div className="flex items-center space-x-2">
                                <span className={amount > 0 ? "text-orange-400" : "text-green-400"}>
                                  {amount > 0 ? "owes" : "gets"}
                                </span>
                                <span className={`font-bold ${amount > 0 ? "text-orange-400" : "text-green-400"}`}>
                                  ₹{Math.abs(amount as number).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {activeTab === "create" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveSplit}
              disabled={!groupName || selectedMembers.length === 0 || transactions.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
